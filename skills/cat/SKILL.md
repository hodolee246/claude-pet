---
name: cat
description: Controls the Claude Cat terminal animation. Launches or stops an animated ASCII cat in a tmux pane below the Claude Code session.
level: 1
---

<Purpose>
Start or stop the Claude Cat daemon in a tmux pane below the current Claude Code session.
The cat reacts to Claude Code activity: thinking while tools run, happy on success, scared on errors, sleeping when idle for 5 minutes.
</Purpose>

<Use_When>
- User runs `/cat start` to launch the cat animation
- User runs `/cat stop` to close the cat pane
- User wants to toggle the terminal companion
</Use_When>

<Steps>
1. Check `$ARGUMENTS`:
   - If `start` → follow Start Steps below
   - If `stop` → follow Stop Steps below
   - If empty or unknown → ask the user: "start or stop?"

## Start Steps

2. Check if already running:
   ```bash
   cat ~/.claude/claude-cat/daemon-info.json 2>/dev/null
   ```
   If daemon-info.json exists and has a paneId, inform user the cat is already running.

3. Check tmux is available and we're inside a tmux session:
   ```bash
   echo "${TMUX:-not_in_tmux}"
   ```
   If not in tmux, output:
   > Claude Cat requires tmux. Start Claude Code inside a tmux session:
   > `tmux new-session -s main` then run `claude` inside it.
   Then stop.

4. Create a small pane at the bottom and run the daemon:
   ```bash
   PLUGIN_ROOT="$CLAUDE_PLUGIN_ROOT"
   PANE_ID=$(tmux split-window -v -l 9 -P -F '#{pane_id}' "node \"$PLUGIN_ROOT/daemon/cat-daemon.mjs\"")
   mkdir -p ~/.claude/claude-cat
   echo "{\"paneId\":\"$PANE_ID\"}" > ~/.claude/claude-cat/daemon-info.json
   tmux select-pane -t '{last}'
   echo "Claude Cat started in pane $PANE_ID"
   ```

5. Confirm success to the user: "🐱 Claude Cat is now watching from below!"

## Stop Steps

2. Read the pane ID:
   ```bash
   PANE_ID=$(node -e "try{const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)}catch{}" 2>/dev/null)
   echo "${PANE_ID:-not_found}"
   ```
   If `not_found`, inform user the cat is not currently running.

3. Kill the pane and clean up:
   ```bash
   PANE_ID=$(node -e "try{const d=require('fs').readFileSync(process.env.HOME+'/.claude/claude-cat/daemon-info.json','utf-8');console.log(JSON.parse(d).paneId)}catch{}")
   tmux kill-pane -t "$PANE_ID" 2>/dev/null || true
   rm -f ~/.claude/claude-cat/daemon-info.json
   echo "Claude Cat stopped"
   ```

4. Confirm: "Claude Cat has gone to sleep. 😴"
</Steps>
