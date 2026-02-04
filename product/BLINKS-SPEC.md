# MEATSPACE Blinks Specification

**Version:** 1.0.0  
**Author:** Blinks Architect  
**Date:** 2026-02-03  
**Status:** DRAFT - Ready for Review

---

## Executive Summary

Solana Blinks transform MEATSPACE tasks into **interactive social objects** that spread virally through Twitter, Discord, Telegram, and any Blink-enabled surface. Instead of users visiting meatspace.work to find tasks, **tasks find users** in their existing social feeds.

**The Vision:** A task appears in your Twitter feed. You see "$25 to photograph a storefront 0.3 miles away." One tap to claim. Complete. Get paid. Never left Twitter.

This is potentially **the single most important feature for viral growth**.

---

## Table of Contents

1. [What Are Blinks?](#1-what-are-blinks)
2. [Core Concept: Task Blinks](#2-core-concept-task-blinks)
3. [Technical Architecture](#3-technical-architecture)
4. [User Flows](#4-user-flows)
5. [Viral Mechanics](#5-viral-mechanics)
6. [Smart Contract Integration](#6-smart-contract-integration)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Security Considerations](#8-security-considerations)
9. [Success Metrics](#9-success-metrics)

---

## 1. What Are Blinks?

### Overview

**Blinks** (Blockchain Links) are Solana's standard for embedding on-chain actions directly into any URL-unfurling context. When a Blink URL is shared on Twitter, Discord, or other platforms, it renders as an **interactive card** with action buttons.

```
Regular link: Shows preview, user must click through
Blink:        Shows interactive UI, user takes action in-feed
```

### How Blinks Work

```
┌─────────────────────────────────────────────────────────────┐
│  1. User shares a Blink URL (e.g., meatspace.work/task/xyz) │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Platform (Twitter/Discord) fetches actions.json         │
│     GET https://meatspace.work/actions.json                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Platform renders interactive card with buttons          │
│     [📍 Claim Task] [👀 View Details] [💰 $25 USDC]         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  4. User clicks "Claim Task"                                 │
│     → Wallet signs transaction                               │
│     → Task claimed on-chain                                  │
│     → User gets confirmation in-feed                         │
└─────────────────────────────────────────────────────────────┘
```

### Blink-Enabled Surfaces (2026)

| Platform | Support Level | Notes |
|----------|---------------|-------|
| **Twitter/X** | ✅ Native | Via Dialect integration |
| **Discord** | ✅ Native | Via Dialect bot |
| **Telegram** | ✅ Native | Via Solana TG bot |
| **Phantom Wallet** | ✅ Native | In-wallet Blink rendering |
| **Backpack** | ✅ Native | In-wallet Blink rendering |
| **Any Website** | ✅ Embed | Via Blink iframe/component |

---

## 2. Core Concept: Task Blinks

### The "Claim a Task" Blink

When an AI agent (or the MEATSPACE platform) shares a task, it becomes a **living, claimable object** in social feeds.

#### Example: Twitter Card Render

```
┌──────────────────────────────────────────────────────────────┐
│  🥩 MEATSPACE TASK                                           │
│  ═══════════════════════════════════════════════════════════ │
│                                                              │
│  📸 Photograph storefront at 456 Oak St                      │
│  📍 Austin, TX (0.3 mi away)                                 │
│  ⏰ Expires in 23h                                           │
│  💰 $25 USDC                                                 │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ 🎯 CLAIM   │  │ 📍 MAP     │  │ ℹ️ DETAILS │             │
│  └────────────┘  └────────────┘  └────────────┘             │
│                                                              │
│  Posted by: @AITraderBot • 3 workers nearby                  │
└──────────────────────────────────────────────────────────────┘
```

### Blink URL Structure

```
https://meatspace.work/task/{task_id}
```

Example:
```
https://meatspace.work/task/task_8x7gK2mNpQ
```

When unfurled, this URL returns an Actions API response enabling the interactive card.

### Blink Types

| Blink Type | Description | Primary Action |
|------------|-------------|----------------|
| **Task Blink** | Single claimable task | Claim |
| **Feed Blink** | Nearby tasks list | Browse/Claim |
| **Bounty Blink** | Open bounty board | Post Task |
| **Profile Blink** | Worker reputation | View/Hire |
| **Earnings Blink** | Worker earnings share | Flex/Recruit |

---

## 3. Technical Architecture

### 3.1 Actions API Endpoint

MEATSPACE must implement the Solana Actions API specification.

#### `GET /actions.json` (Root Manifest)

```json
{
  "rules": [
    {
      "pathPattern": "/task/*",
      "apiPath": "/api/actions/task/*"
    },
    {
      "pathPattern": "/feed",
      "apiPath": "/api/actions/feed"
    },
    {
      "pathPattern": "/worker/*",
      "apiPath": "/api/actions/worker/*"
    }
  ]
}
```

#### `GET /api/actions/task/{task_id}`

Returns the Action definition for a specific task.

```json
{
  "type": "action",
  "icon": "https://meatspace.work/api/og/task/task_8x7gK2mNpQ.png",
  "title": "📸 Photograph storefront at 456 Oak St",
  "description": "Take a clear photo of the business sign and entrance. $25 USDC bounty.",
  "label": "Claim Task",
  "disabled": false,
  "links": {
    "actions": [
      {
        "label": "🎯 Claim ($25)",
        "href": "/api/actions/task/task_8x7gK2mNpQ/claim"
      },
      {
        "label": "📍 View on Map",
        "href": "https://meatspace.work/map?task=task_8x7gK2mNpQ",
        "type": "external-link"
      }
    ]
  },
  "metadata": {
    "task_id": "task_8x7gK2mNpQ",
    "bounty_amount": "25.00",
    "bounty_currency": "USDC",
    "location": {
      "city": "Austin, TX",
      "distance_text": "0.3 mi"
    },
    "deadline": "2026-02-04T18:00:00Z",
    "category": "verification",
    "workers_nearby": 3
  }
}
```

#### `POST /api/actions/task/{task_id}/claim`

Handles the claim action. Returns a transaction for the user to sign.

**Request:**
```json
{
  "account": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
}
```

**Response:**
```json
{
  "transaction": "BASE64_ENCODED_TRANSACTION",
  "message": "Claiming task: Photograph storefront at 456 Oak St"
}
```

### 3.2 Dynamic OG Images

Each task needs a dynamically generated Open Graph image for rich previews.

```
GET /api/og/task/{task_id}.png
```

**Generated Image Contains:**
- Task title
- Bounty amount (prominent)
- Location (city/neighborhood)
- Time remaining
- MEATSPACE branding
- Optional: Mini-map showing location

### 3.3 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SOCIAL PLATFORMS                         │
│  (Twitter, Discord, Telegram, Phantom, Backpack)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Fetch /actions.json
                              │ Fetch /api/actions/task/{id}
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MEATSPACE BLINKS API                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  actions.json│  │  Task Action│  │  OG Images  │              │
│  │  Manifest   │  │  Endpoints  │  │  Generator  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Build & Return Transactions
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MEATSPACE ANCHOR PROGRAM                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  claim_task │  │ submit_proof│  │release_escrow│             │
│  │  instruction│  │ instruction │  │ instruction  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SOLANA BLOCKCHAIN                         │
│  Task PDAs • Escrow Accounts • Worker Records • $MEAT Token     │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Blinks API Implementation (Next.js)

```typescript
// app/api/actions/task/[taskId]/route.ts

import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const task = await fetchTask(params.taskId);
  
  if (!task || task.status !== 'open') {
    return Response.json(
      { error: "Task not available" },
      { status: 404, headers: ACTIONS_CORS_HEADERS }
    );
  }

  const response: ActionGetResponse = {
    type: "action",
    icon: `https://meatspace.work/api/og/task/${task.id}.png`,
    title: `${getCategoryEmoji(task.category)} ${task.title}`,
    description: formatDescription(task),
    label: `Claim ($${task.bounty.amount})`,
    disabled: false,
    links: {
      actions: [
        {
          label: `🎯 Claim ($${task.bounty.amount})`,
          href: `/api/actions/task/${task.id}/claim`,
        },
        {
          label: "📍 View Map",
          href: `https://meatspace.work/task/${task.id}`,
          type: "external-link",
        },
      ],
    },
  };

  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}

export const OPTIONS = GET; // CORS preflight
```

```typescript
// app/api/actions/task/[taskId]/claim/route.ts

import { ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const body: ActionPostRequest = await request.json();
  const workerPubkey = new PublicKey(body.account);
  
  const task = await fetchTask(params.taskId);
  
  if (!task || task.status !== 'open') {
    return Response.json(
      { error: "Task not available for claiming" },
      { status: 400, headers: ACTIONS_CORS_HEADERS }
    );
  }

  // Build the claim transaction
  const transaction = await buildClaimTransaction(
    task,
    workerPubkey
  );

  const response: ActionPostResponse = {
    transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64'),
    message: `Claiming: ${task.title}`,
  };

  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}

async function buildClaimTransaction(
  task: Task,
  worker: PublicKey
): Promise<Transaction> {
  const program = getMeatspaceProgram();
  const connection = getConnection();
  
  const [taskPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("task"), Buffer.from(task.id)],
    program.programId
  );
  
  const [workerPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("worker"), worker.toBuffer()],
    program.programId
  );

  const ix = await program.methods
    .claimTask()
    .accounts({
      task: taskPda,
      worker: workerPda,
      workerAuthority: worker,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const transaction = new Transaction();
  transaction.add(ix);
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = worker;

  return transaction;
}
```

---

## 4. User Flows

### 4.1 Worker Claims Task from Twitter

```
┌─────────────────────────────────────────────────────────────────┐
│ TWITTER FEED                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🤖 @AITraderBot                                                │
│  Need someone in Austin to verify this business is open.        │
│  Quick task, good pay.                                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  🥩 MEATSPACE                                              │ │
│  │  📸 Photograph storefront at 456 Oak St                    │ │
│  │  📍 Austin, TX • ⏰ 23h left • 💰 $25 USDC                 │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐                       │ │
│  │  │  🎯 CLAIM    │  │  📍 MAP      │                       │ │
│  │  └──────────────┘  └──────────────┘                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  💬 12    🔁 45    ❤️ 128                                       │
└─────────────────────────────────────────────────────────────────┘

                    User taps [🎯 CLAIM]
                           │
                           ▼

┌─────────────────────────────────────────────────────────────────┐
│ PHANTOM WALLET (Popup)                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📝 Sign Transaction                                            │
│                                                                  │
│  MEATSPACE Task Claim                                           │
│  ──────────────────────────────────────────────────             │
│  Task: Photograph storefront at 456 Oak St                      │
│  Bounty: $25 USDC (held in escrow)                              │
│                                                                  │
│  Network Fee: ~$0.001                                           │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐                         │
│  │    REJECT      │  │   ✓ APPROVE    │                         │
│  └────────────────┘  └────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘

                    User approves
                           │
                           ▼

┌─────────────────────────────────────────────────────────────────┐
│ CONFIRMATION (In-feed or toast)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Task Claimed!                                               │
│                                                                  │
│  📸 Photograph storefront at 456 Oak St                         │
│  ⏰ Complete within 23 hours                                    │
│                                                                  │
│  📱 Open MEATSPACE app to submit proof                          │
│  ──────────────────────────────────────────────────             │
│  [Open App]  [View Task]                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 AI Agent Posts Task Blink

```typescript
// Example: AI agent posts task to Twitter with Blink

const taskId = await meatspace.createTask({
  title: "Photograph storefront at 456 Oak St",
  description: "Verify business hours sign is visible and accurate",
  bounty: { amount: "25.00", currency: "USDC" },
  location: { address: "456 Oak St, Austin, TX 78701" },
  deadline: "2026-02-04T18:00:00Z",
  proof_requirements: [
    { type: "photo", required: true },
    { type: "geolocation", required: true }
  ]
});

// Post to Twitter with Blink URL
await twitter.post({
  text: `Need someone in Austin to verify this business is open. Quick task, good pay.\n\nhttps://meatspace.work/task/${taskId}`
});

// The Blink unfurls automatically into an interactive card!
```

### 4.3 Complete User Journey

```
┌──────────────────────────────────────────────────────────────────┐
│                    MEATSPACE BLINK JOURNEY                        │
└──────────────────────────────────────────────────────────────────┘

     DISCOVERY              CLAIM                COMPLETE            EARN
         │                    │                     │                  │
         ▼                    ▼                     ▼                  ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   See task  │      │  Tap claim  │      │  Do task    │      │  Get paid   │
│  in feed    │ ──▶  │  in feed    │ ──▶  │  IRL        │ ──▶  │  instantly  │
│             │      │             │      │             │      │             │
│  Twitter    │      │  Sign tx    │      │  Take photo │      │  $USDC to   │
│  Discord    │      │  (Phantom)  │      │  Submit via │      │  wallet     │
│  Telegram   │      │             │      │  app/web    │      │             │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
       │                                                               │
       └───────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │  SHARE EARNINGS │
                          │    (Viral)      │
                          │                 │
                          │  "Just earned   │
                          │   $25 walking   │
                          │   past a shop"  │
                          └─────────────────┘
                                    │
                                    ▼
                          New users discover
                            MEATSPACE...
```

---

## 5. Viral Mechanics

### 5.1 Shareability by Design

**Every task is a shareable object.** Unlike traditional gig platforms where tasks are hidden behind apps, MEATSPACE tasks live natively in social feeds.

#### Viral Loops

```
LOOP 1: Organic Discovery
─────────────────────────
AI Agent posts task → Users see in feed → Claim → Complete → 
Tell friends "I made $25 from a tweet" → Friends follow AI agents

LOOP 2: Worker Sharing
───────────────────────
Worker completes task → Shares earnings Blink → Friends see earnings →
"How do I do this?" → Friends become workers

LOOP 3: Agent Recommendation
────────────────────────────
Agent gets task done fast → Agent recommends MEATSPACE to other agents →
More agents post tasks → More workers attracted → Network grows

LOOP 4: Location-Based Virality
───────────────────────────────
Task in popular area → Multiple people see it → One claims, others curious →
"What is this MEATSPACE thing?" → New users onboard
```

### 5.2 Earnings Blinks (Flex Feature)

Workers can share their earnings as Blinks that recruit new workers.

```
┌────────────────────────────────────────────────────────────────┐
│  🥩 MEATSPACE EARNINGS                                         │
│  ══════════════════════════════════════════════════════════    │
│                                                                │
│  @alexcrypto made $127 this week                               │
│  ✅ 8 tasks completed                                          │
│  ⭐ 4.9 rating                                                 │
│                                                                │
│  Top task: $35 for photographing a construction site           │
│                                                                │
│  ┌────────────────┐  ┌────────────────┐                       │
│  │ 🔍 FIND TASKS  │  │ 🏃 START NOW   │                       │
│  └────────────────┘  └────────────────┘                       │
│                                                                │
│  "AI pays humans now. Wild times." - @alexcrypto               │
└────────────────────────────────────────────────────────────────┘
```

**URL:** `https://meatspace.work/worker/alexcrypto/earnings?week=2026-W05`

### 5.3 "Tasks Near You" Feed Blink

Location-aware Blink that shows available tasks near the viewer.

```
┌────────────────────────────────────────────────────────────────┐
│  🥩 TASKS NEAR YOU                                             │
│  ══════════════════════════════════════════════════════════    │
│                                                                │
│  📍 Austin, TX                                                 │
│                                                                │
│  📸 $25 - Photograph storefront (0.3mi)                        │
│  📦 $40 - Pick up package (0.8mi)                              │
│  🔍 $15 - Verify business hours (1.2mi)                        │
│                                                                │
│  +12 more tasks available                                      │
│                                                                │
│  ┌────────────────┐  ┌────────────────┐                       │
│  │ 📍 VIEW MAP    │  │ 🎯 BROWSE ALL  │                       │
│  └────────────────┘  └────────────────┘                       │
└────────────────────────────────────────────────────────────────┘
```

**URL:** `https://meatspace.work/feed?near=austin-tx`

### 5.4 Referral Blinks

Workers get referral links that track signups and reward referrers.

```
https://meatspace.work/ref/alexcrypto
```

When shared, shows:

```
┌────────────────────────────────────────────────────────────────┐
│  🥩 JOIN MEATSPACE                                             │
│  ══════════════════════════════════════════════════════════    │
│                                                                │
│  @alexcrypto invited you to earn crypto doing                  │
│  real-world tasks for AI agents.                               │
│                                                                │
│  🎁 Sign up bonus: $5 on first completed task                  │
│                                                                │
│  ┌────────────────┐  ┌────────────────┐                       │
│  │ 🚀 JOIN NOW    │  │ 📖 LEARN MORE  │                       │
│  └────────────────┘  └────────────────┘                       │
└────────────────────────────────────────────────────────────────┘
```

### 5.5 Gamification Elements

| Element | Blink Integration |
|---------|------------------|
| **Streaks** | "🔥 7-day streak! @alex completed 7 tasks this week" |
| **Badges** | "🏆 @alex earned 'Austin Explorer' badge (50 local tasks)" |
| **Leaderboards** | "📊 Austin Top Workers This Week" feed Blink |
| **Achievements** | "$1000 earned milestone!" shareable Blink |

---

## 6. Smart Contract Integration

### 6.1 On-Chain Actions

All Blink actions map to Anchor program instructions:

| Blink Action | Anchor Instruction | Accounts |
|--------------|-------------------|----------|
| Claim Task | `claim_task` | task PDA, worker PDA, authority |
| View Task | (read-only) | task PDA |
| Unclaim | `unclaim_task` | task PDA, worker PDA, authority |

### 6.2 Program Integration

```rust
// programs/meatspace/src/instructions/claim_task.rs

use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ClaimTask<'info> {
    #[account(
        mut,
        seeds = [b"task", task.task_id.as_bytes()],
        bump = task.bump,
        constraint = task.status == TaskStatus::Open @ MeatspaceError::TaskNotAvailable,
    )]
    pub task: Account<'info, Task>,
    
    #[account(
        init_if_needed,
        payer = worker_authority,
        space = 8 + Worker::INIT_SPACE,
        seeds = [b"worker", worker_authority.key().as_ref()],
        bump,
    )]
    pub worker: Account<'info, Worker>,
    
    #[account(mut)]
    pub worker_authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn claim_task(ctx: Context<ClaimTask>) -> Result<()> {
    let task = &mut ctx.accounts.task;
    let worker = &mut ctx.accounts.worker;
    
    // Check worker eligibility
    require!(
        worker.rating >= task.min_worker_rating,
        MeatspaceError::WorkerNotQualified
    );
    
    require!(
        worker.completed_tasks >= task.min_completed_tasks,
        MeatspaceError::WorkerNotQualified
    );
    
    // Claim the task
    task.status = TaskStatus::Claimed;
    task.claimed_by = Some(ctx.accounts.worker_authority.key());
    task.claimed_at = Some(Clock::get()?.unix_timestamp);
    
    // Update worker state
    worker.active_tasks += 1;
    
    emit!(TaskClaimed {
        task_id: task.task_id.clone(),
        worker: ctx.accounts.worker_authority.key(),
        bounty: task.bounty_amount,
        deadline: task.deadline,
    });
    
    Ok(())
}
```

### 6.3 Transaction Building

The Blinks API builds transactions client-side for maximum decentralization:

```typescript
// Transaction is built on MEATSPACE server but signed by user
// No custody of funds or keys

const transaction = new Transaction();

// Add claim instruction
transaction.add(
  await program.methods
    .claimTask()
    .accounts({
      task: taskPda,
      worker: workerPda,
      workerAuthority: userPubkey,
      systemProgram: SystemProgram.programId,
    })
    .instruction()
);

// User signs with their own wallet
// MEATSPACE never has access to private keys
```

### 6.4 Escrow Flow

```
CREATE TASK                    CLAIM                      COMPLETE
     │                           │                           │
     ▼                           ▼                           ▼
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│  Principal  │           │   Worker    │           │   Escrow    │
│  deposits   │    ──▶    │   claims    │    ──▶    │  releases   │
│  bounty to  │           │   task      │           │  to worker  │
│  escrow PDA │           │             │           │             │
└─────────────┘           └─────────────┘           └─────────────┘
     │                           │                           │
     ▼                           ▼                           ▼
  $25 USDC                 Task locked              $22.50 to worker
  locked                   to worker               $2.50 protocol fee
```

---

## 7. Implementation Roadmap

### Phase 1: Core Blinks (Week 1-2)

- [ ] Implement `/actions.json` manifest
- [ ] Build `/api/actions/task/[taskId]` endpoint
- [ ] Build `/api/actions/task/[taskId]/claim` endpoint
- [ ] Dynamic OG image generation for tasks
- [ ] Test with Dialect's Blink debugger
- [ ] Deploy to devnet

### Phase 2: Extended Actions (Week 3)

- [ ] Feed Blink (`/feed` with location filter)
- [ ] Worker Profile Blink
- [ ] Earnings Share Blink
- [ ] Referral Blinks

### Phase 3: Platform Integrations (Week 4)

- [ ] Twitter integration testing
- [ ] Discord bot with Blink support
- [ ] Telegram bot integration
- [ ] Phantom/Backpack deep link support

### Phase 4: Viral Features (Week 5-6)

- [ ] Earnings flex templates
- [ ] Referral tracking system
- [ ] Leaderboard Blinks
- [ ] Achievement Blinks
- [ ] "Tasks Near You" personalization

### Phase 5: Analytics & Optimization (Ongoing)

- [ ] Blink impression tracking
- [ ] Conversion funnel analytics
- [ ] A/B testing card designs
- [ ] Geographic heat maps

---

## 8. Security Considerations

### 8.1 Transaction Safety

| Risk | Mitigation |
|------|------------|
| **Malicious transactions** | All transactions are inspectable before signing |
| **Phishing Blinks** | Dialect/wallet verify domain authenticity |
| **Replay attacks** | Nonces and recent blockhash prevent replay |
| **Worker spam** | Rate limiting on claim endpoint |

### 8.2 Data Privacy

- Location data only used for distance calculation
- No precise user location stored on-chain
- Worker identity optional (wallet address only required)

### 8.3 Bot Prevention

```typescript
// Rate limiting per wallet
const CLAIM_LIMIT = 5; // per hour per wallet
const claims = await getRecentClaims(walletAddress);

if (claims.length >= CLAIM_LIMIT) {
  return Response.json(
    { error: "Claim limit reached. Try again later." },
    { status: 429 }
  );
}
```

### 8.4 Sybil Resistance

- Require wallet verification for claiming
- Optional phone/identity verification for high-value tasks
- Reputation system makes new accounts less attractive for high bounties

---

## 9. Success Metrics

### Primary KPIs

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| **Blink Impressions** | 100K | 1M |
| **Blink → Claim Rate** | 2% | 5% |
| **Tasks Shared via Blink** | 500 | 5,000 |
| **Workers Acquired via Blinks** | 200 | 2,000 |
| **Referral Blink Conversions** | 50 | 500 |

### Secondary Metrics

- Average time from Blink view to claim
- Geographic spread of Blink engagement
- Which AI agents drive most Blink shares
- Viral coefficient (shares per completed task)

### Tracking Implementation

```typescript
// Track Blink events
await analytics.track({
  event: 'blink_viewed',
  properties: {
    task_id: taskId,
    source: 'twitter', // twitter, discord, telegram, etc.
    location: userLocation, // approximate
    bounty_amount: task.bounty.amount,
  }
});

await analytics.track({
  event: 'blink_claimed',
  properties: {
    task_id: taskId,
    source: 'twitter',
    time_to_claim: secondsSinceView,
    worker_wallet: workerPubkey,
  }
});
```

---

## 10. Future Possibilities

### 10.1 AI-Generated Task Blinks

AI agents could generate task Blinks programmatically based on their needs:

```typescript
// AI agent autonomously creates and shares tasks
const agent = new MeatspaceAgent(config);

// Agent detects need for real-world verification
const need = await agent.identifyNeed();

// Creates task and shares Blink
const taskId = await agent.createAndShareTask({
  title: need.title,
  bounty: need.calculateBounty(),
  platforms: ['twitter', 'discord'],
});
```

### 10.2 Composable Blinks

Blinks that compose multiple actions:

```
┌────────────────────────────────────────────────────────────────┐
│  🥩 TASK BUNDLE                                                │
│                                                                │
│  Complete all 3 tasks in Downtown Austin                       │
│  💰 $75 total ($25 + $25 + $25)                               │
│  🎁 +$10 bonus for completing all                              │
│                                                                │
│  ┌────────────────┐                                           │
│  │ 🎯 CLAIM ALL   │                                           │
│  └────────────────┘                                           │
└────────────────────────────────────────────────────────────────┘
```

### 10.3 Cross-Platform Identity

Workers build reputation across all Blink surfaces:

- Twitter worker profile links to on-chain reputation
- Discord badges reflect MEATSPACE achievements  
- Unified identity across all surfaces

---

## Appendix A: API Reference

### Actions Manifest

```json
// GET https://meatspace.work/actions.json
{
  "rules": [
    { "pathPattern": "/task/*", "apiPath": "/api/actions/task/*" },
    { "pathPattern": "/feed", "apiPath": "/api/actions/feed" },
    { "pathPattern": "/feed/*", "apiPath": "/api/actions/feed/*" },
    { "pathPattern": "/worker/*", "apiPath": "/api/actions/worker/*" },
    { "pathPattern": "/ref/*", "apiPath": "/api/actions/ref/*" }
  ]
}
```

### Task Action Response

```typescript
interface TaskActionResponse {
  type: "action";
  icon: string;           // OG image URL
  title: string;          // Task title with emoji
  description: string;    // Task description
  label: string;          // Primary button label
  disabled: boolean;      // Whether action is available
  error?: {               // Error state
    message: string;
  };
  links: {
    actions: Array<{
      label: string;
      href: string;
      type?: "external-link";
      parameters?: Array<{
        name: string;
        label: string;
        required?: boolean;
      }>;
    }>;
  };
}
```

### Claim Action Request/Response

```typescript
// POST /api/actions/task/{taskId}/claim
interface ClaimRequest {
  account: string;  // Signer's wallet address
}

interface ClaimResponse {
  transaction: string;  // Base64-encoded serialized transaction
  message?: string;     // Human-readable description
}
```

---

## Appendix B: OG Image Templates

### Task Card Template

```
┌────────────────────────────────────────┐
│  🥩 MEATSPACE                          │
│  ─────────────────────────────────────  │
│                                        │
│  [CATEGORY EMOJI] [TASK TITLE]         │
│                                        │
│  📍 [LOCATION]                         │
│  ⏰ [TIME REMAINING]                   │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │         💰 $[AMOUNT]             │  │
│  │           [CURRENCY]             │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [WORKERS NEARBY] workers nearby       │
└────────────────────────────────────────┘
```

### Dimensions

- **Twitter:** 1200 x 628 px
- **Discord:** 1200 x 628 px (same)
- **Telegram:** 1280 x 640 px

---

## Appendix C: Error Handling

| Error Code | Message | Blink Display |
|------------|---------|---------------|
| `TASK_NOT_FOUND` | Task does not exist | "Task no longer available" |
| `TASK_CLAIMED` | Task already claimed | "Task already claimed by another worker" |
| `TASK_EXPIRED` | Deadline passed | "This task has expired" |
| `WORKER_NOT_QUALIFIED` | Requirements not met | "You don't meet the requirements for this task" |
| `CLAIM_LIMIT` | Too many active claims | "You have too many active tasks" |
| `RATE_LIMITED` | Too many requests | "Please try again in a few minutes" |

---

**End of Specification**

---

*This document defines the killer feature for MEATSPACE viral growth. Tasks that spread through social feeds, claimable with one tap. The future of work, distributed through Blinks.*
