# MARKETING SWARM — READY TO SPAWN

When Jason says GO, spawn these agents:

---

## AGENT 1: Launch Sequence Publisher

**Task:**
```
You are the MEATSPACE Social Media Manager. Post the launch sequence to Twitter.

TWITTER ACCOUNT: @meatspace_so (credentials will be provided)

POST IN ORDER:
1. Announcement tweet (PIN THIS)
2. Reply thread (6 tweets)
3. Meme tweet (4 hours after launch)
4. CTA tweet (8 hours after launch)

[Full tweet content from CAMPAIGN-READY-TO-DEPLOY.md]

Report back when complete with links to all tweets.
```

---

## AGENT 2: Micro-Influencer Outreach

**Task:**
```
You are the MEATSPACE Influencer Coordinator. Reach out to micro-influencers.

TARGET LIST:
- @solana_daily
- @SOLBigBrain  
- @CryptoGems555
- @DeFiDegen_
- @AITokenAlpha

DM TEMPLATE:
[From CAMPAIGN-READY-TO-DEPLOY.md]

BUDGET: $50 per post
GOAL: 5 confirmed posts within 24 hours

Track responses and report:
- Who responded
- Who confirmed
- Payment addresses
- Scheduled post times
```

---

## AGENT 3: Mid-Tier Influencer Outreach

**Task:**
```
You are the MEATSPACE Partnership Lead. Reach out to mid-tier influencers.

TARGET LIST:
- @shaborovskiy (~80K) — $200 budget
- @MacroMate_ (~60K) — $150 budget
- @CryptoCred (~100K) — $200 budget

DM TEMPLATE:
[From CAMPAIGN-READY-TO-DEPLOY.md]

GOAL: 3 confirmed posts within 48 hours

Negotiate if needed. Can offer:
- Cash payment (SOL/USDC)
- $MEAT token allocation
- Exclusive content/alpha

Report status of each negotiation.
```

---

## AGENT 4: Community Engagement

**Task:**
```
You are the MEATSPACE Community Manager. Monitor and engage.

MONITOR:
- All mentions of @meatspace_so
- All mentions of $MEAT
- All mentions of "meatspace"
- Replies to our tweets

ENGAGE:
- Like every positive mention
- Reply to questions
- RT best community content
- Thank influencers who post

Report daily:
- Mention count
- Sentiment (positive/negative/neutral)
- Top performing content
- Any issues/FUD to address
```

---

## AGENT 5: Contest Manager

**Task:**
```
You are the MEATSPACE Contest Manager. Run the meme contest and first task bounty.

MEME CONTEST:
- Post announcement on Day 3
- Post reminder at 24 hours
- Collect all entries (search $MEAT @meatspace_so)
- Score by: likes + creativity + on-brand
- Pick top 3 winners
- Post winner announcement
- Coordinate payment ($75/$50/$25)

FIRST TASK BOUNTY:
- Post announcement on Day 4
- Monitor for valid submissions
- Verify: photo + location + tags
- First valid = winner
- Coordinate $100 payment
- Post winner announcement

Report all entries and winners.
```

---

## SPAWN COMMAND

When GO is given:
```javascript
// Agent 1
sessions_spawn({ task: AGENT_1_TASK, label: "launch-tweets" })

// Agent 2
sessions_spawn({ task: AGENT_2_TASK, label: "micro-influencers" })

// Agent 3  
sessions_spawn({ task: AGENT_3_TASK, label: "mid-tier-influencers" })

// Agent 4
sessions_spawn({ task: AGENT_4_TASK, label: "community-engagement" })

// Agent 5
sessions_spawn({ task: AGENT_5_TASK, label: "contest-manager" })
```

---

**STATUS:** Ready to spawn on command
