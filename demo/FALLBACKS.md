# MEATSPACE Demo Fallback Plans 🚨

## Priority Order

1. **Live Demo** (Two terminals) - Ideal
2. **Orchestrator** (Single terminal) - Good fallback
3. **Pre-recorded Video** - Safe backup
4. **Slides + Narration** - Emergency only

---

## Fallback 1: Network Issues

### Symptom
- Solana RPC calls failing
- Slow/no transaction confirmations

### Solution
```bash
# Switch to mock mode
./demo-orchestrator.sh --mock
```

Or manually run the orchestrator which doesn't require live network.

### Talking Point
> "We're simulating the Solana interactions here, but the real system uses devnet - let me show you the actual transactions we ran earlier..."

---

## Fallback 2: Terminal Display Issues

### Symptom
- Colors not rendering
- ASCII art broken
- Text overflow

### Solution
1. Increase terminal font size: **Cmd + =** (3-4 times)
2. Switch to simple mode:
```bash
./demo-orchestrator.sh --simple
```

3. Use backup terminal app (iTerm2 → Terminal.app or vice versa)

---

## Fallback 3: Script Sync Issues (Two Terminal Demo)

### Symptom
- Agent and worker scripts not communicating
- One terminal stuck waiting

### Solution
1. **Quick fix**: Manually touch the state file
```bash
# In a third terminal:
echo "claimed" > /tmp/meatspace_demo_state
# wait a beat, then:
echo "proof_submitted" > /tmp/meatspace_demo_state
# wait a beat, then:
echo "payment_complete" > /tmp/meatspace_demo_state
```

2. **Better**: Switch to single-terminal orchestrator

---

## Fallback 4: Complete Demo Failure

### The Nuclear Option

1. Pull up the pre-recorded video:
```bash
open ~/Projects/meatspace/demo/backup/demo-recording.mp4
```

2. Or show the architecture diagram:
```bash
open ~/Projects/meatspace/demo/backup/flow-diagram.png
```

3. Narrate the flow manually with slides

---

## Fallback 5: "Can you show a REAL transaction?"

### Prepared Response
Have this ready to show:

```bash
# Show pre-made transactions on Solscan
open "https://solscan.io/tx/[PREPARED_TX_HASH]?cluster=devnet"
```

Keep 2-3 real devnet transaction hashes ready:
- Task creation TX: `_____________`
- Claim TX: `_____________`
- Payment TX: `_____________`

---

## Pre-Demo Checklist

### 5 Minutes Before

- [ ] Both terminals open and sized correctly
- [ ] Font size readable from back of room
- [ ] WiFi connected and stable
- [ ] Demo state file cleared: `rm -f /tmp/meatspace_demo_state`
- [ ] Scripts marked executable: `chmod +x *.sh`
- [ ] Backup video loaded and ready
- [ ] Phone on silent

### Terminal Settings

```bash
# Recommended terminal size
cols: 80
rows: 30

# Clear any previous state
rm -f /tmp/meatspace_demo_state

# Test scripts run
./demo-orchestrator.sh --test
```

---

## Recovery Phrases

If something breaks, use these:

### Tech glitch
> "This is live software - let me switch to our backup demo..."

### Network slow
> "Solana's usually sub-second, but devnet can be flaky - the mainnet experience is much smoother..."

### Total failure
> "Let me walk you through what just happened behind the scenes..."

### Success
> "And THAT is MEATSPACE. AI gets data, humans get paid, trustlessly."

---

## Emergency Contacts

- Demo backup location: `~/Projects/meatspace/demo/backup/`
- Slides: `~/Projects/meatspace/demo/backup/slides.pdf`
- Video: `~/Projects/meatspace/demo/backup/demo-recording.mp4`

---

## Post-Demo

If demo succeeded:
- Save terminal output for social media
- Note any issues for next time

If demo failed:
- It's fine. Every hackathon has demo fails.
- The code works. The concept is solid.
- Move to Q&A quickly.
