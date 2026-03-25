#!/bin/bash
set -e

INFO_FILE=~/.claude/claude-cat/daemon-info.json

# daemon이 실행 중인지 확인
if [ ! -f "$INFO_FILE" ]; then
  echo "Claude Cat is not running."
  exit 0
fi

# pane ID 읽기
PANE_ID=$(node -e "const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)")

# pane 종료 및 정리
tmux kill-pane -t "$PANE_ID" 2>/dev/null || true
rm -f "$INFO_FILE"
echo "Claude Cat stopped"
