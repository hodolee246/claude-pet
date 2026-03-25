#!/bin/bash

INFO_FILE=~/.claude/claude-cat/daemon-info.json

# daemon이 실행 중인지 확인
if [ ! -f "$INFO_FILE" ]; then
  echo "Claude Cat is not running."
  exit 0
fi

# daemon PID 읽기
PID=$(node -e "try{const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)}catch{}" 2>/dev/null) || PID=""

# 방법 1: 저장된 PID로 종료
if [ -n "$PID" ] && [ "$PID" != "null" ] && [ "$PID" -gt 0 ] 2>/dev/null; then
  if kill -0 "$PID" 2>/dev/null; then
    kill -TERM "$PID" 2>/dev/null
    sleep 1
    kill -KILL "$PID" 2>/dev/null || true
  fi
fi

# 방법 2: daemon 프로세스 직접 찾기 (PID 방법 실패 시)
if pgrep -f "cat-daemon.mjs" > /dev/null 2>&1; then
  pkill -f "cat-daemon.mjs" 2>/dev/null || true
  sleep 1
fi

# 정보 파일 삭제
rm -f "$INFO_FILE"
echo "Claude Cat stopped"
