# MEATSPACE Live Demo 🥩

## The 3-Minute Demo Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  AI AGENT                    HUMAN WORKER                       │
│     │                             │                             │
│     │──── 1. POST TASK ──────────►│                             │
│     │     "Take photo of sunset"  │                             │
│     │     Bounty: 0.1 SOL         │                             │
│     │                             │                             │
│     │◄─── 2. CLAIM TASK ──────────│                             │
│     │                             │                             │
│     │◄─── 3. SUBMIT PROOF ────────│                             │
│     │     [photo_evidence.jpg]    │                             │
│     │                             │                             │
│     │──── 4. VERIFY (AI) ────────►│                             │
│     │     ✓ Photo contains sunset │                             │
│     │                             │                             │
│     │──── 5. PAY (Solana) ───────►│                             │
│     │     0.1 SOL transferred!    │                             │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Terminal 1 - AI Agent (Posts Task)
```bash
./demo-agent.sh
```

### Terminal 2 - Human Worker (Claims & Completes)
```bash
./demo-worker.sh
```

## Demo Timing

| Step | Time | Script |
|------|------|--------|
| Intro + Agent posts task | 0:00-0:45 | demo-agent.sh |
| Worker claims task | 0:45-1:15 | demo-worker.sh |
| Worker submits proof | 1:15-1:45 | demo-worker.sh |
| AI verifies + Solana pays | 1:45-2:30 | demo-agent.sh |
| Wrap up | 2:30-3:00 | - |

## Fallback Plans

See `FALLBACKS.md` for contingency plans if something goes wrong.

## Files

- `demo-agent.sh` - AI agent script (run first)
- `demo-worker.sh` - Human worker script  
- `demo-orchestrator.sh` - Single-terminal version
- `mock-api.sh` - Simulated backend for offline demo
- `FALLBACKS.md` - What to do when things break
- `SCRIPT.md` - Presenter talking points
