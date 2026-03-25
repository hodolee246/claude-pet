#!/bin/bash

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}"

# 이미 실행 중인지 확인
if [ -f ~/.claude/claude-cat/daemon-info.json ]; then
  echo "Claude Cat is already running."
  exit 0
fi

# tmux 설치 확인
if ! command -v tmux &> /dev/null; then
  echo "Claude Cat requires tmux. Please install tmux first."
  exit 1
fi

# tmux 세션 확인 및 생성
if [ -z "$TMUX" ]; then
  echo "Claude Cat requires tmux session. Please run: tmux new-session -s main"
  exit 1
fi

# daemon 시작
PANE_ID=$(tmux split-window -v -l 9 -P -F '#{pane_id}' "node \"${PLUGIN_ROOT}/daemon/cat-daemon.mjs\"" 2>/dev/null) || PANE_ID=""

if [ -z "$PANE_ID" ]; then
  echo "Failed to create tmux pane. Make sure you're in a tmux session."
  exit 1
fi

mkdir -p ~/.claude/claude-cat
echo "{\"paneId\":\"${PANE_ID}\"}" > ~/.claude/claude-cat/daemon-info.json
tmux select-pane -t '{last}' 2>/dev/null || true
echo "Claude Cat started in pane ${PANE_ID}"
