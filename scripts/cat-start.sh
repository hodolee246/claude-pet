#!/bin/bash

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}"

# 이미 실행 중인지 확인
if [ -f ~/.claude/claude-cat/daemon-info.json ]; then
  echo "Claude Cat is already running."
  exit 0
fi

# daemon 시작 (백그라운드 프로세스)
mkdir -p ~/.claude/claude-cat

# nohup으로 daemon 시작 (tmux 불필요)
nohup node "${PLUGIN_ROOT}/daemon/cat-daemon.mjs" > ~/.claude/claude-cat/daemon.log 2>&1 &
DAEMON_PID=$!

# PID 저장
echo "{\"paneId\":\"${DAEMON_PID}\"}" > ~/.claude/claude-cat/daemon-info.json
echo "Claude Cat daemon started (PID: ${DAEMON_PID})"
