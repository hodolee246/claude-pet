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
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}"
PANE_ID=$(tmux split-window -v -l 9 -P -F '#{pane_id}' "node \"${PLUGIN_ROOT}/daemon/cat-daemon.mjs\"")
mkdir -p ~/.claude/claude-cat
echo "{\"paneId\":\"${PANE_ID}\"}" > ~/.claude/claude-cat/daemon-info.json
tmux select-pane -t '{last}'
echo "Claude Cat started in pane ${PANE_ID}"
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
PANE_ID=$(node -e "const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)")
tmux kill-pane -t "$PANE_ID" 2>/dev/null || true
rm -f ~/.claude/claude-cat/daemon-info.json
echo "Claude Cat stopped"
```

3. Tell user: "Claude Cat has gone to sleep."
