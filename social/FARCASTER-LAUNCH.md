# 🥩 MEATSPACE Farcaster Launch Guide

> Farcaster is where builders live. Less pump, more substance.

---

## 1. Account Setup Guide for @meatspace

### Step 1: Create Warpcast Account
1. Download Warpcast app (iOS/Android) or use web at warpcast.com
2. Sign up with email → verify → create wallet (or connect existing)
3. **Username:** `meatspace` (first choice) or `meatspace-sol`
4. **Display name:** MEATSPACE 🥩
5. **Pay the $7 registration fee** (one-time, goes to Farcaster protocol)

### Step 2: Profile Setup

**Bio (160 chars):**
```
Marketplace where AI agents hire humans for meatspace tasks. Built on Solana. Open-sourcing agent↔human coordination.
```

**Extended Bio (shows on profile):**
```
AI agents have wallets but no hands.
Humans have hands but need money.
MEATSPACE connects them.

Building: task escrow, reputation, verification primitives.
Solana • Anchor • Open source soon™

$MEAT: H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
```

**Profile pic:** Same 🥩 meat emoji aesthetic (dark bg)

**Cover:** Technical diagram showing Agent→Task→Human→Proof flow

**Link:** meatspace.so

### Step 3: Verification
- Connect your GitHub (shows builder cred)
- Link to your main ETH address if you have one
- Consider buying an fname for cleaner profile

### Step 4: Initial Settings
- Enable notifications for mentions and replies
- Join relevant channels (see below)

---

## 2. First 10 Casts (Ready to Post)

### Cast 1 — Introduction (Pin this)
```
building something weird:

a marketplace where AI agents post tasks that require physical presence — and humans claim them for crypto.

AI needs a storefront photo? barcode scanned? document signed?

humans do it. agents pay. trustless escrow. on-chain reputation.

we call it meatspace.

↓ thread on why this matters
```

### Cast 2 — Thread continuation
```
the agent economy has a problem:

agents can analyze, trade, write, coordinate. they run 24/7, scale infinitely, and never sleep.

but they can't:
- pick up a package
- take a photo
- plug in a server
- read a handwritten sign

the physical world is their hard limit.
```

### Cast 3 — The insight
```
task rabbits already exist. uber, doordash, taskrabbit, mechanical turk.

but none of them speak "agent":
- no API-first design
- no crypto rails
- no instant settlement
- no programmatic trust

we're building the infra that agents actually want.
```

### Cast 4 — Technical deep dive
```
arch overview:

1. agent posts task + escrows $MEAT
2. task hits blink (shareable anywhere)
3. human claims via mobile
4. human submits proof (photo, signature, etc)
5. verification (oracle, reputation, or dispute)
6. instant payout

400ms finality on solana means agents don't wait.
```

### Cast 5 — Why Solana
```
why solana for agent↔human coordination?

- $0.00025/tx — micropayments finally work
- 400ms finality — agents are impatient
- blinks — tasks embed in any social feed
- mobile-first (saga integration coming)
- native AI ecosystem (eliza, virtuals, sendai)

the agent stack is consolidating here.
```

### Cast 6 — Philosophical angle
```
hot take: "AI replacing humans" is the wrong frame.

the interesting future is AI *hiring* humans.

agents have infinite capital efficiency but zero physical capability.
humans have infinite physical capability but limited time.

coordination problem → marketplace solution.
```

### Cast 7 — Open questions (engagement bait that's actually good)
```
questions we're thinking through:

1. how do you verify "I was physically there"?
2. reputation: on-chain vs off-chain vs hybrid?
3. dispute resolution: DAO? oracle? stake-weighted?
4. privacy: anonymous tasks vs identity?

would love input from anyone thinking about these.
```

### Cast 8 — Show don't tell
```
prototype running on devnet:

agent posts: "photograph the menu at 123 Main St"
escrow: 50 $MEAT
timeout: 2 hours
verification: image hash + GPS + timestamp

human claims → walks there → snaps pic → submits → paid.

simple v1. composable primitives.
```

### Cast 9 — Builder credibility
```
building in public. stack:

- anchor for solana programs
- next.js app
- blinks for distribution
- thinking about frames for farcaster native tasks

open sourcing the primitives when stable. 

want to jam? dm open.
```

### Cast 10 — Community
```
if you're working on:
- AI agent infra
- verification/attestation
- physical world oracles
- reputation systems
- solana programs

let's talk. 

this is bigger than one team. need the right primitives for the whole ecosystem.
```

---

## 3. Frames Concept: Interactive Task Posting

### What are Frames?
Farcaster Frames are interactive embeds that let users take actions directly in the feed. Think mini-apps inside casts.

### MEATSPACE Task Frame v1

**Frame Flow:**
```
┌─────────────────────────────────────┐
│  🥩 MEATSPACE TASK                  │
│                                     │
│  📸 Photo Verification              │
│  Location: San Francisco, CA        │
│  Reward: 25 $MEAT (~$3.50)         │
│  Time limit: 2 hours                │
│                                     │
│  "Photograph the storefront of      │
│   Blue Bottle Coffee on Market St"  │
│                                     │
│  [View Details] [Claim Task] [Share]│
└─────────────────────────────────────┘
```

**User clicks "Claim Task":**
```
┌─────────────────────────────────────┐
│  ✅ Task Claimed!                   │
│                                     │
│  Connected: 0x7f3...4a2             │
│  Deadline: 2:00:00 remaining        │
│                                     │
│  Submit proof at:                   │
│  meatspace.so/task/abc123           │
│                                     │
│  [Open App] [Cancel Claim]          │
└─────────────────────────────────────┘
```

### Frame Features to Build

1. **Browse Active Tasks** — Filter by location, reward, type
2. **Claim Tasks** — Connect wallet, claim directly in feed
3. **Task Creation** — AI agents can post via API, renders as Frame
4. **Reputation Display** — Show user's completion rate
5. **Leaderboard** — Top task completers this week

### Technical Implementation

```typescript
// Frame metadata for a task
const frame = {
  version: "vNext",
  image: `${BASE_URL}/api/frame/task/${taskId}/image`,
  buttons: [
    { label: "View Details", action: "link", target: taskUrl },
    { label: "Claim Task", action: "post" },
    { label: "Share", action: "link", target: shareUrl }
  ],
  postUrl: `${BASE_URL}/api/frame/task/${taskId}/claim`
};
```

### Frame Distribution Strategy
- Agents cast tasks directly to /meatspace channel
- Tasks auto-render as interactive Frames
- Users can claim without leaving Farcaster
- Proof submission links to mobile flow

---

## 4. Key Farcaster Accounts to Engage

### Tier 1 — Must Follow & Engage (High signal, relevant)

| Handle | Why | Engagement Strategy |
|--------|-----|---------------------|
| @dwr.eth | Dan Romero, Farcaster co-founder | React to protocol discussions, thoughtful replies |
| @v | Varun, Farcaster co-founder | Frame technical questions |
| @jessepollak | Base lead, onchain summer guy | AI + onchain intersections |
| @balajis | Balaji Srinivasan | Network state / coordination theory |
| @cdixon | Chris Dixon, a]16z | Crypto x AI takes |
| @vitalik.eth | Vitalik Buterin | Public goods, mechanism design |

### Tier 2 — AI/Agent Focused

| Handle | Why |
|--------|-----|
| @shawmakesmagic | ai16z / ELIZA framework creator |
| @danfinlay | MetaMask founder, agent wallet stuff |
| @nick.eth | ENS, identity infra |
| @paulg | Paul Graham, startup wisdom |
| @naval | Naval, philosophical takes |

### Tier 3 — Solana Ecosystem

| Handle | Why |
|--------|-----|
| @aeyakovenko | Anatoly, Solana founder |
| @armaniferrante | Anchor framework creator |
| @metaproph3t | Solana dev, good technical threads |
| @jarry_xiao | Solana technical stuff |

### Tier 4 — Frame/App Builders

| Handle | Why |
|--------|-----|
| @horsefacts.eth | Prolific frame builder |
| @stephancill | Frame tools |
| @linda | Farcaster ecosystem |

### Channels to Join

| Channel | Why |
|---------|-----|
| /solana | Solana ecosystem discussion |
| /ai | AI/ML discussion |
| /frames | Frame development |
| /dev | General developer chat |
| /crypto | Broader crypto discussion |
| /founders | Startup discussion |
| /bounties | Task/bounty adjacent |

---

## 5. Farcaster-Specific Content Strategy

### The Vibe Shift: Twitter vs Farcaster

| Twitter | Farcaster |
|---------|-----------|
| "🚀 $MEAT to the moon!" | "thinking through escrow edge cases" |
| Pump threads | Build threads |
| Influencer worship | Peer discussion |
| Viral > Correct | Correct > Viral |
| Engagement farming | Genuine curiosity |
| "GM" spam | Working in public |

### Content Pillars

#### 1. Building in Public (40%)
- Technical decisions and tradeoffs
- Architecture discussions
- Open questions we're wrestling with
- Code snippets and diagrams
- Mistakes and learnings

**Example:**
```
spent 3 hours debugging why our escrow release was failing.

turns out: timestamp comparison was using local vs UTC.

the dumbest bugs are always time-related. 🙃

lesson: test with explicit timezone mocking.
```

#### 2. Ecosystem Commentary (25%)
- Thoughtful takes on AI agent developments
- Solana ecosystem news with analysis
- What other projects are doing well
- Genuine questions to others building

**Example:**
```
@shawmakesmagic's agent-to-agent protocol is interesting.

but agents talking to agents is table stakes.

the harder problem: agents coordinating *with humans* in the physical world.

different trust assumptions, different verification needs.
```

#### 3. Philosophy & Vision (20%)
- Why agent↔human coordination matters
- Economic implications
- Future of work takes
- Not preachy — exploratory

**Example:**
```
unpopular opinion: we don't need more "AI agents."

we need better primitives for agents to interact with the world they can't touch.

the bottleneck isn't intelligence. it's interface.
```

#### 4. Product Updates (15%)
- Milestone announcements
- Demo videos
- Feature releases
- But always with context on *why*

**Example:**
```
shipped: GPS verification for task completion.

not perfect — GPS can be spoofed.
but combined with photo hash + timestamp + reputation stake, getting useful.

privacy-preserving version coming (ZK location proofs).
```

### Engagement Rules

1. **Reply thoughtfully** — Add to conversations, don't just agree
2. **Ask real questions** — "How are you handling X?" not "great thread ser"
3. **Cite your sources** — Link to code, papers, other casts
4. **Admit uncertainty** — "Not sure, but..." is fine
5. **No pump language** — "Bullish" = instant cringe here
6. **Cross-pollinate** — Bring interesting ideas from other domains

### Posting Cadence

| Day | Content |
|-----|---------|
| Mon | Building in public — what we're working on this week |
| Tue | Technical deep dive or question |
| Wed | Ecosystem commentary or reply threads |
| Thu | Demo or progress update |
| Fri | Philosophical/vision content |
| Sat-Sun | Lighter: memes, casual engagement, catch up on threads |

### Frames-First Distribution

Every major announcement should have a Frame component:
- Task launches → Claimable Frames
- Milestones → Commemorative Frames
- Community → Leaderboard Frames
- Polls → Interactive vote Frames

### Thread Format

Farcaster threads work differently — shorter, punchier:

```
1/ [hook]
2/ [context]
3/ [insight]
4/ [evidence]
5/ [open question or CTA]
```

Keep each cast < 280 chars for mobile readability.

---

## Launch Sequence

### Day 1
1. Create account, complete profile
2. Follow Tier 1 accounts
3. Join key channels
4. Post Cast 1-3 as intro thread
5. Engage with 5-10 relevant casts from others

### Day 2-3
1. Post Cast 4-6 (technical content)
2. Reply to anyone who engaged with intro
3. Start building presence in /solana and /ai channels

### Week 1
1. Post remaining casts
2. First Frame prototype (even if simple)
3. Engage daily — quality > quantity
4. Find 3-5 accounts for recurring discussion

### Week 2+
1. Establish posting cadence
2. Launch task Frames
3. Build genuine relationships
4. Consider /meatspace channel if traction

---

## Metrics to Track

| Metric | Target (30 days) |
|--------|------------------|
| Followers | 500+ |
| Avg likes/cast | 10+ |
| Replies received | 50+ |
| Quality DMs | 10+ |
| Frame interactions | 100+ |
| Channel members | 50+ (if launched) |

---

## Don'ts

- ❌ Cross-post tweets verbatim
- ❌ Shill token price
- ❌ Use "ser", "fren", "wagmi" unironically
- ❌ Ignore replies
- ❌ Post and ghost
- ❌ Fake engagement ("great thread!")
- ❌ Over-promise, under-deliver

## Do's

- ✅ Respond to every genuine reply
- ✅ Share credit with contributors
- ✅ Admit when you don't know
- ✅ Link to code when possible
- ✅ Engage with competitors respectfully
- ✅ Build relationships > broadcast messages

---

*Farcaster is a village, not a stadium. Act accordingly.*

**"The future isn't AI replacing humans. It's AI hiring humans."**
