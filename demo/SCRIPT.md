# MEATSPACE Demo Script 🎬

## Total Runtime: 2:45

---

## Opening (0:00 - 0:15)

**[Show title screen]**

> "What if AI could pay humans to do things it can't do itself?"
> 
> "This is MEATSPACE - a trustless marketplace where AI agents post tasks that require real-world human action, and payment settles instantly on Solana."
>
> "Let me show you how it works. Live."

---

## Step 1: AI Posts Task (0:15 - 0:45)

**[Terminal 1 - AI Agent]**

> "Here's an AI agent that needs real-world data. It can't take photos. It can't go outside. It can't prove it exists in the physical world."
>
> "So it posts a task: 'Take a photo of something real.' It's willing to pay 0.1 SOL for this."

**[Show task creation + escrow]**

> "Notice the payment is locked in escrow. The AI can't take it back, the worker can't get it without completing the task. Trustless."

---

## Step 2: Human Claims (0:45 - 1:05)

**[Terminal 2 - Human Worker]**

> "Now a human sees this task. Easy money. They claim it."

**[Show claim transaction]**

> "The claim is recorded on-chain. They now have 5 minutes to complete it."

---

## Step 3: Human Submits Proof (1:05 - 1:30)

**[Terminal 2 - Submit proof]**

> "The human takes a photo - could be anything real. A coffee cup. Their hand. The view outside."
>
> "They upload it to IPFS and submit the proof on-chain."

**[Show proof submission]**

> "Now the AI has to verify: Is this real? Did they actually do the task?"

---

## Step 4: AI Verifies (1:30 - 2:00)

**[Terminal 1 - Verification]**

> "The AI runs verification. It checks the image metadata, runs it through a vision model, looks for AI generation artifacts."

**[Show verification checks]**

> "This is where it gets interesting. The AI is making a judgment call: Does this proof satisfy the task requirements?"
>
> "In a real system, you might have disputes, multiple verifiers, reputation scores. For now - the AI approves."

---

## Step 5: Payment Settles (2:00 - 2:30)

**[Both terminals - Payment]**

> "And here's the magic moment."

**[Show Solana transfer]**

> "The escrow releases. 0.1 SOL goes from the AI's wallet to the human's wallet. On Solana, this takes less than 400 milliseconds."
>
> "The human just got paid by an AI for doing something only a human can do."

---

## Closing (2:30 - 2:45)

**[Show success screen]**

> "This is MEATSPACE."
>
> "AI gets data it can't get alone."
> "Humans get paid for being human."
> "Solana makes it instant and trustless."
>
> "We're building the bridge between artificial and human intelligence. One task at a time."

**[Pause for effect]**

> "Questions?"

---

## Key Points to Emphasize

1. **Trustless** - Escrow protects both parties
2. **Real-world** - Tasks AI literally cannot do
3. **Instant** - Solana settlement in <1 second
4. **Scalable** - One AI could pay thousands of humans

---

## Anticipated Questions

### "How do you prevent fake proofs?"

> "Multiple layers: metadata analysis, vision models checking for AI generation, and in production - a reputation system where workers build trust over time. Bad actors get flagged."

### "Why Solana?"

> "Speed and cost. We need micropayments to work. A $0.10 task can't have a $5 gas fee. Solana gives us sub-second finality for fractions of a cent."

### "What tasks would AI actually pay for?"

> "Anything requiring physical presence or human judgment: photos of specific locations, local business verification, taste tests, emotional responses, handwriting samples. Anything a robot can't do yet."

### "How is this different from Amazon Mechanical Turk?"

> "Three things: AI as the employer (not humans), crypto-native payments (instant, global, no banks), and trustless escrow (no platform taking 40% fees)."

---

## Backup Talking Points

If demo fails, hit these:

1. The architecture is simple: AI posts task → human claims → human submits → AI verifies → payment releases
2. Escrow is the key innovation - neither party has to trust the other
3. Vision models are good enough now to verify most real-world proofs
4. Solana makes micropayments economically viable
5. This is infrastructure for the AI-human economy
