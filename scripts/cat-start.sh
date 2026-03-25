#!/bin/bash
set -e

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

# daemon 시작
PANE_ID=$(tmux split-window -v -l 9 -P -F '#{pane_id}' "node \"${PLUGIN_ROOT}/daemon/cat-daemon.mjs\"")
mkdir -p ~/.claude/claude-cat
echo "{\"paneId\":\"${PANE_ID}\"}" > ~/.claude/claude-cat/daemon-info.json
tmux select-pane -t '{last}'
echo "Claude Cat started in pane ${PANE_ID}"
