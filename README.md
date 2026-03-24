# claude-pet 🐱

> ASCII cat companion for Claude Code — reacts to every tool call in real time.

A cute ASCII cat lives in a tmux pane below your Claude Code session.
It watches what Claude is doing and reacts with animations.

```
┌── Claude Cat ──────────────┐
│    /\_/\                   │
│   ( -.- )                  │
│    > ~ <   ...             │
│    |   |                   │
│    ~_~_~                   │
│  ● thinking...             │
└────────────────────────────┘
```

## States

| State | Trigger | Animation |
|-------|---------|-----------|
| 🚶 `idle` | Claude finished responding | Cat walks left and right |
| 🤔 `thinking` | Tool call started | Cat sits and sways tail with `...` |
| 🎉 `happy` | Tool call succeeded | Cat jumps with ♪ notes |
| 😱 `error` | Tool call failed | Cat's fur stands up with `!` |
| 💤 `sleep` | Idle for 5 minutes | Cat sleeps with ZZZ |

## Requirements

- [Claude Code](https://claude.ai/code)
- [tmux](https://github.com/tmux/tmux) (`apt install tmux`)
- Node.js >= 18

## Installation

```bash
claude plugin install claude-pet
```

Or from GitHub:
```bash
claude plugin install github:hodolee246/claude-pet
```

## Usage

Start the cat in a tmux pane below Claude Code:
```
/cat start
```

Stop it:
```
/cat stop
```

> **Note**: Claude Code must be running inside a tmux session.
> Start one with: `tmux new-session -s main` then run `claude`.

## How It Works

```
Claude Code events
  PreToolUse      → state: "thinking"
  PostToolUse     → state: "happy"
  PostToolUseFailure → state: "error"
  Stop            → state: "idle"
       ↓
~/.claude/claude-pet/state.json
       ↓
cat-daemon.mjs (tmux pane)
  polls state every 200ms → renders ASCII animation
```

## License

MIT © [hodolee246](https://github.com/hodolee246)
