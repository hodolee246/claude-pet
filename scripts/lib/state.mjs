import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';
import { homedir, tmpdir } from 'os';

export const STATE_DIR = join(homedir(), '.claude', 'claude-cat');
export const STATE_FILE = join(STATE_DIR, 'state.json');
export const DAEMON_INFO_FILE = join(STATE_DIR, 'daemon-info.json');

export const STATES = ['idle', 'thinking', 'happy', 'error', 'sleep'];

export function ensureStateDir() {
  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
}

export function readState() {
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    return { state: 'idle', updatedAt: Date.now() };
  }
}

// Atomic write: write to tmp file then rename to prevent partial reads
export function writeState(state) {
  ensureStateDir();
  const data = JSON.stringify({ state, updatedAt: Date.now() });
  const tmp = join(tmpdir(), `claude-cat-state-${process.pid}.json`);
  writeFileSync(tmp, data, 'utf-8');
  renameSync(tmp, STATE_FILE);
}
