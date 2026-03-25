#!/bin/bash

INFO_FILE=~/.claude/claude-cat/daemon-info.json

# daemon이 실행 중인지 확인
if [ ! -f "$INFO_FILE" ]; then
  echo "Claude Cat is not running."
  exit 0
fi

# pane ID 읽기 (JSON 파싱 실패해도 계속 진행)
PANE_ID=$(node -e "const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)" 2>/dev/null) || PANE_ID=""

# pane 종료 (PANE_ID가 있으면)
if [ -n "$PANE_ID" ]; then
  tmux kill-pane -t "$PANE_ID" 2>/dev/null || true
fi

# 정보 파일 삭제 (항상 실행)
rm -f "$INFO_FILE"
echo "Claude Cat stopped"
