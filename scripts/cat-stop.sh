#!/bin/bash

INFO_FILE=~/.claude/claude-cat/daemon-info.json

# daemon이 실행 중인지 확인
if [ ! -f "$INFO_FILE" ]; then
  echo "Claude Cat is not running."
  exit 0
fi

# daemon PID 읽기 (JSON 파싱 실패해도 계속 진행)
PID=$(node -e "const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)" 2>/dev/null) || PID=""

# daemon 프로세스 종료 (PID가 있고 숫자면)
if [ -n "$PID" ] && [ "$PID" != "null" ]; then
  kill "$PID" 2>/dev/null || true
fi

# 정보 파일 삭제 (항상 실행)
rm -f "$INFO_FILE"
echo "Claude Cat stopped"
