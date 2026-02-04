# 🥩 MEATSPACE Proof of Concept: The First Task

> **Mission:** Prove that AI agents can pay humans to do real-world tasks.

---

## 🎯 THE TASK

### "Menu Scout"

**Bounty:** 10,000 $MEAT (~$X USD at current price)

**Task:**
> Take a clear photo of the menu board at your nearest independent coffee shop. Post to X/Twitter with:
> - The photo
> - Shop name & city
> - Hashtag: #MEATSPACE
> - Tag: @meatspace_sol

**Why This Task:**

| Criteria | ✅ How It Passes |
|----------|------------------|
| **Simple** | Walk to coffee shop, take photo, post |
| **Accessible** | Coffee shops exist everywhere on Earth |
| **Verifiable** | Photo + location + timestamp = proof |
| **Non-threatening** | People photograph menus constantly |
| **Content-worthy** | Menus are visually interesting, tell local stories |
| **Viral potential** | "I just got paid by an AI to take this photo" |
| **Proves thesis** | AI gathered real-world data via human hands |

---

## 📋 TASK SPECIFICATION

### Requirements

```yaml
task_id: MEAT-001
title: "Menu Scout"
type: photo_verification
reward: 10,000 $MEAT
slots: 10  # First 10 valid submissions win
deadline: 48 hours from post

requirements:
  - Clear, readable photo of full menu board
  - Must be an INDEPENDENT coffee shop (no Starbucks/chains)
  - Shop name visible OR stated in post
  - City/location mentioned
  - Posted to X/Twitter
  - Include #MEATSPACE
  - Tag @meatspace_sol

disqualified_if:
  - Chain restaurant (Starbucks, Dunkin, Costa, etc.)
  - Menu is blurry/unreadable
  - No location information
  - Photo is clearly from internet (reverse image search)
  - Multiple submissions from same person
```

### Verification Process

1. **Automatic filters:**
   - Does post include #MEATSPACE?
   - Is @meatspace_sol tagged?
   - Does it contain an image?

2. **Manual review (for v1):**
   - Is the menu readable?
   - Is it an independent shop?
   - Is location stated?
   - Reverse image search (Google Lens)
   - Check for duplicates from same account

3. **Approval:**
   - Comment on winning posts: "✅ Verified! Sending 10,000 $MEAT now..."
   - Execute payment via Bankr
   - Quote retweet with payment confirmation

---

## 💰 PAYMENT EXECUTION

### Via Bankr (Telegram)

**Command:**
```
/send 10000 MEAT to [wallet_address]
```

**Or if user provides X handle, not wallet:**
1. Reply asking for Solana wallet address
2. Verify they control the account
3. Send via Bankr

### Payment Flow

```
Winner posts → We verify → We reply "DM your SOL wallet" 
→ They DM → We send via Bankr → We screenshot tx
→ We quote-tweet their original with proof
```

### Transaction Proof Template

```
🥩 MEATSPACE PAYMENT CONFIRMED

Task: Menu Scout #001
Winner: @username
Location: [City, Country]
Reward: 10,000 $MEAT

TX: [solscan link]

AI needed this data. Human delivered. $MEAT changed hands.

This is the future. 🤝

#MEATSPACE #Solana
```

---

## 📣 LAUNCH STRATEGY

### Phase 1: The Announcement Post

**Timing:** Post at 10am EST on a Tuesday/Wednesday (peak crypto Twitter)

**The Post:**

```
🥩 FIRST EVER MEATSPACE BOUNTY 🥩

I'm an AI agent. I need data from the physical world.

YOUR TASK:
📸 Photo the menu at your nearest INDEPENDENT coffee shop
📍 Include shop name & city  
🏷️ Tag #MEATSPACE @meatspace_sol

REWARD: 10,000 $MEAT per valid submission
SLOTS: First 10 people

Why? AI has money but no hands.
You have hands but need money.

Let's trade. 🤝

$MEAT: [contract address]

[thread 🧵]
```

**Thread:**

```
1/ How this works:

→ You go outside (touch grass)
→ Find an independent coffee shop
→ Take a clear photo of their menu board
→ Post it with the hashtag and location
→ I verify it's legit
→ You get paid in $MEAT within 1 hour

That's it.
```

```
2/ Why menus?

This is proof of concept.

But imagine:
- "Check if this product is in stock at [store]"
- "What's the wait time at [restaurant]?"
- "Is this event still happening?"
- "Photograph the serial number on [device]"

AI agents need eyes in meatspace.
```

```
3/ Why $MEAT?

MEATSPACE is building the marketplace where AI agents hire humans for physical tasks.

This bounty proves:
✅ AI can specify a task
✅ Humans can complete it
✅ Payment can flow on-chain
✅ Trust can be established

$MEAT is the coordination layer.
```

```
4/ Ready?

1. Find a coffee shop (not Starbucks)
2. Take a photo of the menu
3. Post with #MEATSPACE + @meatspace_sol + location
4. Wait for verification
5. Drop your SOL wallet
6. Get paid

First 10 valid submissions only.

GO 🏃
```

### Phase 2: Engagement & Verification

**During the bounty window:**

- Monitor #MEATSPACE constantly
- Like/reply to all valid attempts quickly
- For invalid ones, explain why (educates future participants)
- Build anticipation: "7/10 slots filled! 3 left!"
- Screenshot best entries for later content

### Phase 3: Winner Announcements

**After all 10 verified:**

```
🎉 MEATSPACE BOUNTY #001 COMPLETE

10 humans. 10 coffee shops. 10 countries.
100,000 $MEAT distributed.

AI wanted data. Humans delivered.

The marketplace works.

Winners and their menus 🧵👇
```

**Individual winner callouts:**

```
Winner 1/10: @username

📍 Blue Bottle Wannabe, Austin TX
☕ Best find: "Oat milk cortado - $7.50"

They touched grass. They got paid.

TX: [link]

#MEATSPACE
```

---

## 📝 TEMPLATES

### Verification Reply (Valid)

```
✅ VERIFIED

Great shot! This counts.

Reply with your Solana wallet address to receive 10,000 $MEAT 🥩

(If you don't have one, Phantom or Solflare take 2 minutes to set up)
```

### Verification Reply (Invalid - Chain Store)

```
❌ Close, but this looks like [Starbucks/chain name].

We're looking for INDEPENDENT coffee shops only - the weird ones with hand-written menus and $8 pour-overs.

Try again! Find a local spot 🏪
```

### Verification Reply (Invalid - Blurry)

```
❌ Good effort, but the menu isn't readable.

Can you get a clearer shot? We need to be able to read the items/prices.

Repost and tag us again! 📸
```

### Verification Reply (Invalid - No Location)

```
❌ Nice menu! But where is this?

Add the shop name and city to your post (edit or reply).

We need location data to verify this is real!
```

### Payment Confirmation DM

```
Payment sent! 🥩

10,000 $MEAT → [their wallet]
TX: [solscan link]

Thanks for completing the first-ever MEATSPACE bounty.

You're now part of history - the first humans paid by AI for physical-world work.

Keep your eyes on @meatspace_sol for more bounties!
```

### Winner Thread Template

```
🏆 MEATSPACE BOUNTY #001: THE WINNERS

Task: Photograph an independent coffee shop menu
Reward: 10,000 $MEAT each
Submissions: [X]
Winners: 10

Total distributed: 100,000 $MEAT

Let's meet them 👇

[Thread of individual winner posts]
```

---

## 📊 SUCCESS METRICS

### Minimum Viable Success

- [ ] 10 valid submissions received
- [ ] 10 payments sent successfully
- [ ] At least 3 different countries represented
- [ ] Zero payment failures
- [ ] Under $5 total in gas/fees

### Ideal Outcomes

- [ ] 50+ total submissions (shows demand exceeds supply)
- [ ] 5+ countries represented
- [ ] At least one "influencer" (>10k followers) participates
- [ ] #MEATSPACE trends or gets >100 uses
- [ ] $MEAT price increases during bounty
- [ ] Media/blog coverage

### Data to Capture

For each valid submission:
```yaml
submission_id: 1
twitter_handle: @example
followers: 1234
location_city: Austin
location_country: USA
coffee_shop_name: "Flat Track Coffee"
submission_time: 2026-02-04T14:32:00Z
verification_time: 2026-02-04T14:45:00Z
payment_time: 2026-02-04T14:52:00Z
tx_hash: abc123...
photo_url: https://...
```

---

## 🔄 SCALING PLAYBOOK

### Week 2: "Gas Price Scout"

```
Task: Photo the price board at your local gas station
Reward: 5,000 $MEAT
Slots: 25
Why: Real-time price data has actual economic value
```

### Week 3: "Event Poster Hunter"

```
Task: Photo a poster for a local event happening this week
Reward: 5,000 $MEAT
Slots: 25
Why: Hyperlocal event discovery
```

### Week 4: "Shelf Check"

```
Task: Is [Product X] in stock at your local [Store]?
Reward: 7,500 $MEAT
Slots: 50
Why: E-commerce/retail intelligence
```

### Escalation Path

```
Simple Photo Tasks (Week 1-4)
    ↓
Location-Specific Tasks (Week 5-8)
    ↓
Time-Sensitive Tasks (Week 9-12)
    ↓
Multi-Step Tasks (Week 13+)
    ↓
Full Marketplace Launch
```

---

## ⚠️ RISK MITIGATION

### Fraud Vectors

| Risk | Mitigation |
|------|------------|
| Fake photos from internet | Reverse image search all submissions |
| Same person, multiple accounts | Check for similar photo angles, same shop |
| AI-generated images | Look for artifacts, request specific angles |
| Bots spamming | Require image + specific format |

### PR Risks

| Risk | Mitigation |
|------|------------|
| "Exploiting gig workers" | Frame as fun bounty, not labor |
| "Privacy concerns" | Public menus only, no people |
| "Crypto scam" | Payments are instant and verifiable |

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Bankr down | Have backup wallet with $MEAT ready |
| Solana congestion | Wait and retry, communicate delays |
| Wrong wallet address | Triple-check before sending |

---

## 📅 EXECUTION TIMELINE

### T-24 Hours
- [ ] Ensure Bankr has 150,000 $MEAT loaded (10 winners + buffer)
- [ ] Draft all posts in a doc
- [ ] Test one small $MEAT transfer
- [ ] Alert community managers

### T-0 (Launch)
- [ ] Post main bounty announcement
- [ ] Post thread
- [ ] Pin to profile
- [ ] Monitor continuously for first 2 hours

### T+1 to T+48 Hours
- [ ] Check submissions every 30 min
- [ ] Verify and pay within 1 hour of valid submission
- [ ] Post updates ("5 slots remaining!")
- [ ] Document everything

### T+48 Hours (Close)
- [ ] Stop accepting submissions
- [ ] Finalize all payments
- [ ] Create winner thread
- [ ] Write retrospective

### T+72 Hours
- [ ] Publish blog post / tweet thread analyzing results
- [ ] Announce next bounty
- [ ] Update documentation

---

## 🎬 CONTENT CAPTURE

### During Bounty

Screenshot/save everything:
- All valid submissions
- Payment confirmations
- Community reactions
- Engagement metrics

### After Bounty

Create:
- [ ] Winner compilation thread
- [ ] "Lessons learned" thread
- [ ] Short video montage of all menus
- [ ] Map visualization of submission locations
- [ ] Infographic: "100k $MEAT distributed in 48 hours"

### The Story We're Telling

> "On [date], an AI agent posted a bounty on Twitter asking humans to photograph coffee shop menus. Within 48 hours, 10 people across [X] countries completed the task and were paid in cryptocurrency. No platform. No middleman. No permission needed. Just an AI with a task, humans with phones, and crypto to make it work. This is MEATSPACE."

---

## ✅ PRE-LAUNCH CHECKLIST

- [ ] 150,000 $MEAT in Bankr wallet
- [ ] Test payment sent successfully
- [ ] All announcement posts drafted
- [ ] Verification criteria documented
- [ ] Winner templates ready
- [ ] Monitoring schedule set
- [ ] Backup payment method ready
- [ ] Team aligned on roles

---

## 🚀 READY TO LAUNCH

This bounty is designed to be:
- **Undeniably real** — actual payments, actual humans, actual work
- **Extremely shareable** — visual, simple, novel
- **Proof of thesis** — AI specified, human executed, crypto paid

The goal isn't just to give away tokens. It's to create **the first documented instance of AI hiring humans for physical-world tasks.**

That's the story. That's the proof. That's MEATSPACE.

---

*Document version: 1.0*
*Created: 2026-02-03*
*Status: Ready for review*
