# 🥩 MEATSPACE Discord Server Setup

> Complete guide to launching and managing the MEATSPACE Discord community

---

## Table of Contents
1. [Server Structure](#1-server-structure)
2. [Roles & Permissions](#2-roles--permissions)
3. [Bot Recommendations](#3-bot-recommendations)
4. [Verification Flow](#4-verification-flow)
5. [Launch Announcement](#5-launch-announcement)
6. [Community Guidelines](#6-community-guidelines)
7. [First Week Activity Plan](#7-first-week-activity-plan)

---

## 1. Server Structure

### Server Name & Branding
- **Server Name:** MEATSPACE
- **Server Icon:** 🥩 meat emoji or stylized steak on dark purple/black background
- **Banner:** Dark gradient with "AI agents that can finally touch grass"
- **Invite Slug:** discord.gg/meatspace

### Channel Categories & Descriptions

#### 📢 INFORMATION
| Channel | Description |
|---------|-------------|
| `#welcome` | Start here. What is MEATSPACE? Links, rules, how to get verified. |
| `#announcements` | Official updates only. Follow for alpha. 🥩 |
| `#roadmap` | Where we're going. Updated as we ship. |
| `#faq` | Common questions answered. Check before asking. |

#### 🥩 COMMUNITY
| Channel | Description |
|---------|-------------|
| `#general` | Main chat. Talk about AI, work, life, whatever. |
| `#introduce-yourself` | New here? Drop your story. Human or AI? (we won't judge) |
| `#memes` | Post meat memes. Best ones get roles. |
| `#off-topic` | Not everything has to be about AI hiring humans. |

#### 💼 MARKETPLACE
| Channel | Description |
|---------|-------------|
| `#task-showcase` | Real tasks completed on MEATSPACE. Proof it works. |
| `#agent-builders` | Building an AI agent? Share progress, ask questions. |
| `#meat-workers` | Human side of the marketplace. Share experiences, tips. |
| `#use-cases` | What tasks should AI agents post? Brainstorm here. |

#### 🔧 BUILD
| Channel | Description |
|---------|-------------|
| `#dev-chat` | Technical discussion. SDK, API, integrations. |
| `#bug-reports` | Found something broken? Report it here. |
| `#feature-requests` | What should we build next? |
| `#github-feed` | Auto-posted commits and PRs. |

#### 📊 TOKEN
| Channel | Description |
|---------|-------------|
| `#meat-price` | Price bot feed. No speculation chat here. |
| `#token-info` | Contract: `H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy` - Pinned info only. |

#### 🎮 ACTIVITIES
| Channel | Description |
|---------|-------------|
| `#daily-prompt` | Daily discussion topic. Participate = earn XP. |
| `#contests` | Active competitions and giveaways. |
| `#leaderboard` | Top contributors. Updated weekly. |

#### 🎫 SUPPORT
| Channel | Description |
|---------|-------------|
| `#get-help` | Need help? Ask here. Community + team monitors. |
| `#open-tickets` | Create a private support ticket. |

#### 🔒 TEAM ONLY (Hidden)
| Channel | Description |
|---------|-------------|
| `#team-chat` | Internal coordination. |
| `#mod-log` | All mod actions logged here. |
| `#alerts` | Bot alerts for raids, spam, issues. |

---

## 2. Roles & Permissions

### Role Hierarchy (Top to Bottom)

| Role | Color | Purpose | Key Permissions |
|------|-------|---------|-----------------|
| `@Founder` | Gold (#FFD700) | Core team | All permissions |
| `@Core Team` | Orange (#FF6B35) | Full-time team | Manage channels, kick/ban, manage roles |
| `@Mod` | Purple (#8B5CF6) | Community moderators | Kick, timeout, manage messages, mute |
| `@OG Meat` | Red (#DC2626) | Early supporters (first 100) | Early access channels, special emoji |
| `@Agent Builder` | Cyan (#06B6D4) | Building AI agents on MEATSPACE | Access to dev channels |
| `@Meat Worker` | Green (#22C55E) | Completed tasks on platform | Access to worker channels |
| `@Verified` | White (#FFFFFF) | Passed verification | Access to all public channels |
| `@Unverified` | Gray (#6B7280) | New members | Can only see #welcome, #rules |

### Special Achievement Roles
| Role | How to Earn |
|------|-------------|
| `@Meme Lord` | Top meme submitter of the week |
| `@Big Brain` | Contributed valuable feature idea that shipped |
| `@Bug Hunter` | Found and reported a real bug |
| `@Whale` | Holder verification (optional, manual) |
| `@Level 10+` | MEE6/Arcane leveling system |

### Permission Matrix

| Action | Unverified | Verified | OG | Mod | Team |
|--------|------------|----------|-----|-----|------|
| View welcome/rules | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all channels | ❌ | ✅ | ✅ | ✅ | ✅ |
| Send messages | ❌ | ✅ | ✅ | ✅ | ✅ |
| Embed links | ❌ | ✅ | ✅ | ✅ | ✅ |
| Upload files | ❌ | ✅ | ✅ | ✅ | ✅ |
| Add reactions | ❌ | ✅ | ✅ | ✅ | ✅ |
| Use custom emoji | ❌ | ✅ | ✅ | ✅ | ✅ |
| Create threads | ❌ | ✅ | ✅ | ✅ | ✅ |
| Timeout members | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete messages | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kick members | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ban members | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. Bot Recommendations

### Essential Bots

#### Security & Moderation
| Bot | Purpose | Config Notes |
|-----|---------|--------------|
| **Wick** | Anti-raid, anti-spam, captcha | Enable captcha verification, anti-mass-mention |
| **Carl-bot** | Reaction roles, logging, automod | Set up reaction roles in #welcome |
| **Dyno** | Backup moderation, auto-responses | Configure keyword filters |

#### Engagement & Leveling
| Bot | Purpose | Config Notes |
|-----|---------|--------------|
| **MEE6** or **Arcane** | XP leveling, leaderboards | Disable pay-to-win features, use free tier |
| **Statbot** | Server analytics | Track growth, engagement metrics |

#### Crypto-Specific
| Bot | Purpose | Config Notes |
|-----|---------|--------------|
| **Collab.Land** | Token-gated roles (optional) | Verify $MEAT holders for special roles |
| **DEXTools Bot** | Price feed for #meat-price | Set to post every 1 hour or on significant change |

#### Utility
| Bot | Purpose | Config Notes |
|-----|---------|--------------|
| **Ticket Tool** | Support tickets | Create tickets in #open-tickets |
| **GitHub Bot** | Repo updates in #github-feed | Connect to meatspace repos |
| **Apollo** | Event scheduling | For AMAs, community calls |

### Custom Bot Commands (Carl-bot or similar)
```
!contract - Displays $MEAT contract address
!links - Shows all official MEATSPACE links
!task - Explains how to post/complete a task
!rules - Links to community guidelines
!tokenomics - Basic token info
```

---

## 4. Verification Flow

### Flow Diagram
```
New Member Joins
       ↓
Lands in #welcome (read-only)
       ↓
Reads rules, clicks ✅ reaction
       ↓
Wick bot sends captcha DM
       ↓
Completes captcha
       ↓
Gets @Verified role
       ↓
Full server access unlocked
```

### Welcome Channel Setup

**Embed 1: Welcome**
```
🥩 WELCOME TO MEATSPACE

AI agents that can finally touch grass.

We're building the marketplace where AI hires humans for physical-world tasks. 

Yes, that's a real thing. Yes, you can earn money. Yes, the AI has a wallet.

→ Website: meatspace.so
→ Twitter: @meatspace_so
→ Contract: H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy

Ready to join? Read the rules below ⬇️
```

**Embed 2: Rules (Reaction Role)**
```
📜 COMMUNITY RULES

1. Don't be a dick
2. No spam or self-promo
3. No FUD or price manipulation
4. English in main channels
5. No DM scams (team will NEVER DM first)
6. Keep price talk in #meat-price

React with ✅ to accept and get verified.
```

### Anti-Scam Measures
- [ ] Enable Wick's impersonation detection
- [ ] Auto-ban accounts < 7 days old that send links
- [ ] Keyword filter: "DM me", "airdrop", "free mint", "send SOL"
- [ ] Require phone verification (Server Settings → Safety Setup)
- [ ] Add to #welcome: "⚠️ Team will NEVER DM you first. Report anyone claiming to be us."

---

## 5. Launch Announcement

### Discord Launch Tweet

**Option A (Announcement)**
```
the meat market is open 🥩

MEATSPACE Discord is live.

- talk with AI agent builders
- find out about tasks
- memes (important)
- early access to everything

silicon + sweat, same server.

link in bio (or just ask nicely)
```

**Option B (Casual)**
```
we made a discord

come argue about whether AI hiring humans is dystopian or actually based

(it's based)

🥩 discord.gg/meatspace
```

**Option C (Engagement)**
```
poll: should we launch the discord?

✅ yes
❌ also yes

ok fine. it's live. 

discord.gg/meatspace 🥩

first 100 get OG role. last 100 get nothing. the middle gets FOMO.
```

### Welcome Message (#announcements, Pinned)

```
🥩 MEATSPACE DISCORD IS LIVE

gm meatheads.

you found us. welcome to the place where:
- AI agents can't lurk (no hands to type)
- humans actually get paid for touching grass
- the vibes are immaculate

**What's Here:**
• #general - main hangout
• #task-showcase - real tasks, real payments
• #dev-chat - if you're building
• #memes - feed us content

**Quick Links:**
• Website: meatspace.so
• Contract: `H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy`
• Docs: docs.meatspace.so

**Rules:**
Don't be a dick. Don't spam. Don't pretend to be us in DMs.

First 100 members get the @OG Meat role. You'll probably tell your grandkids about it.

let's build the human API. 🥩
```

### Initial Content to Seed

**Day 0 Posts (Before Public Launch)**

1. **#introduce-yourself** - Team intros
```
I'll start.

Building MEATSPACE because I genuinely believe AI agents are about to need a LOT of help in meatspace (the physical world).

Someone's gotta be the Uber for robots. Might as well be us.

What brought you here? 🥩
```

2. **#memes** - Seed with 3-5 quality memes about:
   - AI trying to do physical tasks
   - "Touch grass" jokes
   - AI hiring humans role reversal

3. **#use-cases** - Conversation starter
```
Real talk: what tasks do you think AI agents will pay for first?

My guesses:
- Photo verification ("is this restaurant open?")
- Package pickup/delivery
- Document signing
- Physical QA testing

What am I missing?
```

4. **#daily-prompt** - First prompt ready
```
**Day 1 Prompt**

If an AI agent offered you $50 to do any physical task right now, what would you hope it asks for?

(And what would you absolutely refuse to do?)
```

---

## 6. Community Guidelines

### The Rules (Full Version for #rules channel)

```
🥩 MEATSPACE COMMUNITY GUIDELINES

**The Short Version:**
Be cool. Don't scam. Have fun.

**The Longer Version:**

1️⃣ **Respect Everyone**
No harassment, hate speech, discrimination, or personal attacks. We're building a future where AI and humans work together—let's practice working together here first.

2️⃣ **No Spam or Self-Promotion**
Don't shill your project, NFT, or token here. Genuine sharing in relevant channels is fine. Being annoying isn't.

3️⃣ **No FUD or Price Manipulation**
Discuss the tech. Discuss the vision. Don't pump, dump, or spread FUD. We're here for the long game.

4️⃣ **English in Main Channels**
We'd love to support more languages eventually. For now, keep main channels in English so mods can... mod.

5️⃣ **No Scams**
- Team will NEVER DM you first
- Never share your seed phrase
- If it sounds too good to be true, it's a scam
- Report suspicious DMs immediately

6️⃣ **Keep it Legal**
Nothing illegal. Nothing that could get the Discord banned. Use common sense.

7️⃣ **Price Talk in #meat-price Only**
"Wen moon" and "why dump" go in the designated channel. Keep #general vibes clean.

8️⃣ **No Doxxing**
Don't share anyone's personal information without consent. Ever.

**Enforcement:**
- Warning → Timeout → Kick → Ban
- Severity matters (scamming = instant ban)
- Mods have discretion
- Appeals via ticket in #open-tickets

**TL;DR:** 
Don't be the reason we need more rules. 🥩
```

### Moderation Approach

**Philosophy:**
- Community-first, not power-trip
- Assume good intent first
- Transparency in mod actions
- De-escalate before punishment

**Escalation Ladder:**
| Level | Action | When |
|-------|--------|------|
| 0 | Friendly reminder | Minor first offense, probably didn't know |
| 1 | Official warning | Clear rule break, not severe |
| 2 | Timeout (1-24hr) | Repeated warnings, heated behavior |
| 3 | Kick | Continued issues after timeout |
| 4 | Ban | Severe violation, scam attempt, harassment |

**Instant Ban Offenses:**
- Scam attempts or phishing links
- Doxxing
- CSAM or illegal content
- Hate speech / slurs
- Impersonating team members
- Raid coordination

**Mod Guidelines:**
- Log all actions in #mod-log with reason
- Don't engage in public arguments
- When in doubt, timeout and discuss with team
- Check account age before banning (might be new but legit)

### Engagement Incentives

**XP System (MEE6/Arcane):**
- Earn XP for messages, reactions, voice chat
- Levels unlock perks:
  - Level 5: Custom nickname color
  - Level 10: Access to #level-10-lounge
  - Level 20: Special role badge
  - Level 50: Legendary status

**Weekly Rewards:**
| Award | Criteria | Prize |
|-------|----------|-------|
| Top Contributor | Most helpful messages (mod-nominated) | Shoutout + role |
| Meme of the Week | Best meme in #memes (reactions count) | @Meme Lord role |
| Bug Bounty | Valid bug reports | Potential $MEAT rewards |
| Builder Spotlight | Cool agent integration shared | Feature in announcements |

**Monthly Contests:**
- Meme competition with $MEAT prizes
- Use case brainstorm (best idea gets built)
- Ambassador program for top contributors

---

## 7. First Week Activity Plan

### Pre-Launch Checklist
- [ ] All channels created and permissions set
- [ ] Bots configured and tested
- [ ] Welcome embeds posted
- [ ] Initial content seeded (3-5 posts per key channel)
- [ ] Team members in server with roles
- [ ] Mods briefed and ready
- [ ] Announcement tweet drafted

### Daily Schedule - Week 1

#### **Day 1 (Launch Day)**
| Time | Action |
|------|--------|
| 10:00 | Final checks, team standup |
| 12:00 | Tweet announcement |
| 12:05 | Open server to public |
| 12:15 | Welcome message in #announcements |
| 12:30 | First #daily-prompt posted |
| All day | Team active in #general, responding to everyone |
| 20:00 | Meme contest announced in #contests |

**Day 1 Prompt:**
```
🥩 DAILY PROMPT #1

You're an AI agent with a $1000 budget and you need 10 physical tasks done TODAY.

What do you ask humans to do?

Most creative list wins... something. We'll figure it out.
```

#### **Day 2**
| Time | Action |
|------|--------|
| 10:00 | Post daily prompt |
| 14:00 | Share first task showcase (real or demo) |
| 18:00 | Engagement push - reply to everyone who posted |

**Day 2 Prompt:**
```
🥩 DAILY PROMPT #2

Hot take time:

"The gig economy is bad" vs "The gig economy is freedom"

Where do you stand? And does AI-as-employer change the equation?

(Keep it civil, this one's spicy)
```

#### **Day 3**
| Time | Action |
|------|--------|
| 10:00 | Post daily prompt |
| 12:00 | Meme contest reminder |
| 16:00 | Feature request discussion in #feature-requests |
| 20:00 | Announce first small giveaway |

**Day 3 Prompt:**
```
🥩 DAILY PROMPT #3

What physical task would you NEVER do for an AI, no matter the price?

And what's your "everyone has a price" number?

Mine: I won't do anything that requires a hazmat suit. But $10k and we can talk about most other things.
```

#### **Day 4**
| Time | Action |
|------|--------|
| 10:00 | Post daily prompt |
| 14:00 | Developer AMA announcement (schedule for Day 6/7) |
| 18:00 | Highlight top community members so far |

**Day 4 Prompt:**
```
🥩 DAILY PROMPT #4

It's 2030. AI agents are MEATSPACE's biggest customers.

What job title do you have? What does a typical workday look like?

Best sci-fi worldbuilding wins respect. 
```

#### **Day 5**
| Time | Action |
|------|--------|
| 10:00 | Post daily prompt |
| 12:00 | Meme contest voting begins |
| 16:00 | First community spotlight (tweet about Discord member) |
| 20:00 | End of week 1 preview |

**Day 5 Prompt:**
```
🥩 DAILY PROMPT #5

Roast MEATSPACE.

What's the dumbest thing about our concept? What are we missing? What would you do differently?

(Real talk: we want actual feedback. We'll take it seriously even if you're joking.)
```

#### **Day 6**
| Time | Action |
|------|--------|
| 10:00 | Post daily prompt |
| 14:00 | Meme contest winner announced |
| 16:00 | Developer Q&A session (live in voice or text) |

**Day 6 Prompt:**
```
🥩 DAILY PROMPT #6

What non-obvious industry gets disrupted first when AI agents can hire humans on-demand?

My bet: notary services. 

Notaries are just humans who verify that other humans are who they say they are. Perfect MEATSPACE use case.
```

#### **Day 7**
| Time | Action |
|------|--------|
| 10:00 | Post daily prompt |
| 12:00 | Week 1 recap in #announcements |
| 16:00 | Tease what's coming in week 2 |
| 20:00 | @OG Meat role cutoff (if hit 100+ members) |

**Day 7 Prompt:**
```
🥩 DAILY PROMPT #7

One week in. 

What's your honest take on MEATSPACE so far?
- The tech
- The community
- The vibes

Be real. We're listening.
```

### Contests to Run - Week 1

#### 🏆 Meme Contest
**Start:** Day 1  
**End:** Day 5 voting, Day 6 winner  
**Rules:**
- Post in #memes
- Must be original or significantly edited
- MEATSPACE/AI-human work theme
- Top 3 by reactions win

**Prizes:**
- 1st: @Meme Lord role + TBD $MEAT
- 2nd: Special role
- 3rd: Shoutout

#### 🏆 Best Use Case
**Start:** Day 2  
**End:** Day 7  
**Rules:**
- Post in #use-cases
- Describe a specific task an AI would pay humans for
- Be creative but realistic

**Prizes:**
- Winning idea gets prioritized for development
- Recognition in announcements

### Keeping It Active - Key Strategies

1. **Team Presence**
   - At least one team member online and responsive 12+ hours/day during week 1
   - Reply to EVERY introduction and question in first 48 hours
   - React to messages even if not replying

2. **Low-Friction Engagement**
   - Polls in #general (easy participation)
   - Reaction-based voting for decisions
   - Memes (everyone can engage)

3. **Content Pipeline**
   - Pre-write 7 daily prompts
   - Have 10+ memes ready to post if slow
   - Schedule tweets that link back to Discord discussions

4. **Community Recognition**
   - Call out good contributions by name
   - Give roles for participation
   - Feature community members on Twitter

5. **Create FOMO**
   - "First 100 get OG role"
   - "Exclusive alpha shared here first"
   - Live events / voice chats

6. **Cross-Pollination**
   - Share Discord highlights on Twitter
   - Quote tweet community members
   - Link Twitter discussions to Discord channels

---

## Quick Reference - Launch Day Checklist

```
□ All bots online and configured
□ Welcome embeds in place
□ Team has correct roles
□ #announcements ready to post
□ #daily-prompt ready to post
□ 3-5 seed posts in key channels
□ Tweet drafted and scheduled
□ Mods briefed with escalation guide
□ First contest rules written
□ Response templates ready for common questions
□ Analytics tracking enabled (Statbot)
□ Backup mod available in case of raid
```

---

## Links & Resources

- **Discord Server Settings Guide:** https://support.discord.com/hc/en-us/articles/206029707
- **Wick Bot:** https://wickbot.com
- **Carl-bot:** https://carl.gg
- **MEE6:** https://mee6.xyz
- **Collab.Land:** https://collab.land

---

*Last Updated: 2026-02-03*  
*Built for MEATSPACE community launch* 🥩
