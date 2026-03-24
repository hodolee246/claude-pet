/**
 * Claude Cat Daemon
 * Run in a tmux pane below the Claude Code session.
 * Reads ~/.claude/claude-cat/state.json and renders animated ASCII cat.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { ANIMATIONS, FRAME_SPEEDS } from './animations.mjs';

const STATE_FILE = join(homedir(), '.claude', 'claude-cat', 'state.json');
const SLEEP_AFTER_MS = 5 * 60 * 1000; // 5분 idle → sleep

// ANSI helpers
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';
const CLEAR = '\x1b[2J\x1b[H';
const RESET = '\x1b[0m';

// 상태 복원
process.stdout.write(HIDE_CURSOR);
const restore = () => process.stdout.write(SHOW_CURSOR + RESET + '\n');
process.on('exit', restore);
process.on('SIGINT', () => { restore(); process.exit(0); });
process.on('SIGTERM', () => { restore(); process.exit(0); });

// ── 상태 관리 ──────────────────────────────────────────────
let currentState = 'idle';
let frameIndex = 0;
let lastFileState = { state: 'idle', updatedAt: Date.now() };
let lastPollMs = 0;
let lastFrameMs = 0;
let daemonIdleStart = Date.now(); // daemon 내부 idle 시작 시각

function readFileState() {
  try {
    if (!existsSync(STATE_FILE)) return { state: 'idle', updatedAt: Date.now() };
    return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    return { state: 'idle', updatedAt: Date.now() };
  }
}

function resolveDisplayState(fileState) {
  const { state, updatedAt } = fileState;
  const age = Date.now() - updatedAt;

  // happy/error는 3초 후 자동 idle
  if ((state === 'happy' || state === 'error') && age > 3000) return 'idle';

  return state;
}

// ── 렌더링 ────────────────────────────────────────────────
function renderFrame(state, idx) {
  const frames = ANIMATIONS[state] || ANIMATIONS.idle;
  const frame = frames[idx % frames.length];

  // 상태 레이블
  const labels = {
    idle: '\x1b[33m● idle\x1b[0m',
    thinking: '\x1b[36m● thinking...\x1b[0m',
    happy: '\x1b[32m● done!\x1b[0m',
    error: '\x1b[31m● error\x1b[0m',
    sleep: '\x1b[2m● zzz\x1b[0m',
  };

  const lines = frame.split('\n');
  // 패딩: 항상 5줄 고정 높이
  while (lines.length < 5) lines.push('');

  const output = CLEAR
    + '\x1b[90m┌── Claude Cat ──────────────┐\x1b[0m\n'
    + lines.map(l => `\x1b[90m│\x1b[0m  ${l}`).join('\n')
    + '\n'
    + `\x1b[90m│\x1b[0m  ${labels[state] || labels.idle}\n`
    + '\x1b[90m└────────────────────────────┘\x1b[0m';

  process.stdout.write(output);
}

// ── 메인 루프 ─────────────────────────────────────────────
const POLL_INTERVAL = 200;
const TICK = 100; // 100ms마다 tick

setInterval(() => {
  const now = Date.now();

  // 상태 폴링 (200ms마다)
  if (now - lastPollMs >= POLL_INTERVAL) {
    lastPollMs = now;
    lastFileState = readFileState();
    const resolved = resolveDisplayState(lastFileState);

    // idle → sleep 전환 (5분)
    if (resolved === 'idle') {
      if (currentState !== 'idle' && currentState !== 'sleep') {
        daemonIdleStart = now;
      }
      if (currentState === 'idle' && now - daemonIdleStart > SLEEP_AFTER_MS) {
        currentState = 'sleep';
      } else {
        if (currentState !== 'sleep') {
          if (currentState !== 'idle') daemonIdleStart = now;
          currentState = 'idle';
        }
      }
    } else {
      if (resolved !== currentState) frameIndex = 0;
      currentState = resolved;
      daemonIdleStart = now; // 비idle 활동 → idle 타이머 리셋
    }
  }

  // 프레임 전환
  const speed = FRAME_SPEEDS[currentState] || 500;
  if (now - lastFrameMs >= speed) {
    lastFrameMs = now;
    renderFrame(currentState, frameIndex);
    frameIndex++;
  }
}, TICK);
