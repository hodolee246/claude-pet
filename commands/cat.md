---
description: "Start or stop the Claude Cat ASCII animation in a tmux pane below your terminal"
argument-hint: "start|stop"
---

Start or stop the Claude Cat daemon in a tmux pane below the Claude Code session.
The cat reacts to Claude Code activity: thinking while tools run, happy on success, scared on errors, sleeping when idle.

If `$ARGUMENTS` is `start`:
1. Check if already running: `cat ~/.claude/claude-cat/daemon-info.json 2>/dev/null`
   - If exists, tell user the cat is already running.

2. Check tmux: `echo "${TMUX:-not_in_tmux}"`
   - If not in tmux, output: "Claude Cat requires tmux. Run: `tmux new-session -s main` then `claude`"
   - Stop.

3. Create pane and run daemon:
```!
LATEST_VERSION=$(ls -d ~/.claude/plugins/cache/hodolee-plugins/claude-pet/*/ 2>/dev/null | sort -V | tail -1 | sed 's:/$::')
if [ -z "$LATEST_VERSION" ]; then
  echo "Claude Cat plugin not found"
  exit 1
fi
bash "$LATEST_VERSION/scripts/cat-start.sh"
```

4. Tell user: "Claude Cat is now watching from below!"

If `$ARGUMENTS` is `stop`:
1. Read pane ID:
```!
node -e "try{const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)}catch{console.log('not_found')}"
```
   - If `not_found`, tell user the cat is not running.

2. Kill pane and clean up:
```!
LATEST_VERSION=$(ls -d ~/.claude/plugins/cache/hodolee-plugins/claude-pet/*/ 2>/dev/null | sort -V | tail -1 | sed 's:/$::')
if [ -z "$LATEST_VERSION" ]; then
  echo "Claude Cat plugin not found"
  exit 1
fi
bash "$LATEST_VERSION/scripts/cat-stop.sh"
```

3. Tell user: "Claude Cat has gone to sleep."
