# Meatspace Architecture

**The Decentralized Exchange for Physical-World Services**

---

## Vision

> AI agents can do anything digital. But atoms still require humans.  
> Meatspace is the API that gives agents hands — and wheels, and wings.

**Meatspace routes physical-world tasks to the best available service provider.**

Like 1inch aggregates DEXes for best-price swaps, Meatspace aggregates gig economy and logistics services for best-execution physical tasks.

---

## Service Categories

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MEATSPACE PROTOCOL                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  SHIPPING   │  │  DELIVERY   │  │    RIDES    │  │  GIG WORK   │     │
│  │             │  │             │  │             │  │             │     │
│  │ Letters     │  │ Same-day    │  │ Transport   │  │ Handyman    │     │
│  │ Packages    │  │ Food        │  │ Autonomous  │  │ Cleaning    │     │
│  │ Freight     │  │ Groceries   │  │             │  │ Photography │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                                   │                                      │
│                          ┌────────┴────────┐                            │
│                          │     ROUTER      │                            │
│                          │  Best Price     │                            │
│                          │  Best Speed     │                            │
│                          │  Best Value     │                            │
│                          └────────┬────────┘                            │
│                                   │                                      │
│         ┌─────────────────────────┼─────────────────────────┐           │
│         │                         │                         │           │
│    ┌────┴────┐             ┌──────┴─────┐            ┌──────┴─────┐    │
│    │ Shippo  │             │  DoorDash  │            │   Uber     │    │
│    │ USPS    │             │  Uber Eats │            │   Lyft     │    │
│    │ FedEx   │             │  GoPuff    │            │   Waymo    │    │
│    │ UPS     │             │  Instacart │            │            │    │
│    │ DHL     │             │  Dolly     │            │            │    │
│    │Freightos│             │            │            │            │    │
│    └─────────┘             └────────────┘            └────────────┘    │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                        SETTLEMENT LAYER                                  │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Solana     │  │    Fiat      │  │   Escrow     │                  │
│  │   Payments   │  │   Bridge     │  │   Contract   │                  │
│  │  USDC/SOL    │  │ Crypto→Card  │  │  Guarantees  │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Adapter Registry

### Shipping (Letters → Freight)

| Adapter | Provider | Capabilities | API Status |
|---------|----------|--------------|------------|
| `shippo` | Shippo (85+ carriers) | Parcels, labels, tracking | ✅ Ready |
| `usps` | USPS Direct | Letters, certified mail | ✅ Ready |
| `freightos` | Freightos | LTL, FTL, Ocean, Air | ✅ Available |
| `uship` | uShip | Heavy items, vehicles | ✅ Available |

### Delivery (Same-Day Local)

| Adapter | Provider | Capabilities | API Status |
|---------|----------|--------------|------------|
| `doordash` | DoorDash Drive | Local delivery, food | ✅ Available |
| `uber_direct` | Uber Direct | Local delivery | ✅ Available |
| `dolly` | TaskRabbit/Dolly | Delivery + moving | ✅ Available |
| `gopuff` | GoPuff | Convenience items | ⚠️ Partnership |
| `instacart` | Instacart | Grocery delivery | ⚠️ Partnership |

### Rides

| Adapter | Provider | Capabilities | API Status |
|---------|----------|--------------|------------|
| `uber` | Uber Business | Rides, transport | ✅ Business API |
| `lyft` | Lyft Business | Rides, transport | ✅ Business API |
| `waymo` | Waymo | Autonomous rides | 🔜 Emerging |

### Gig Work

| Adapter | Provider | Capabilities | API Status |
|---------|----------|--------------|------------|
| `taskrabbit` | TaskRabbit | Home services | 🔜 Coming Soon |
| `mturk` | Amazon MTurk | Digital micro-tasks | ✅ Full API |
| `handy` | Handy | Cleaning, handyman | ⚠️ Partnership |

---

## Agent Interface

### Unified SDK

```typescript
import { Meatspace } from '@meatspace/sdk';

const meat = new Meatspace({ apiKey: '...', wallet: '0x...' });

// SHIPPING: Letter to freight
await meat.ship({
  from: '123 Main St, NYC',
  to: '456 Oak Ave, LA',
  parcel: { weight: '5lb', dimensions: '12x8x6in' },
  routing: 'cheapest'
});

// DELIVERY: Same-day local
await meat.deliver({
  from: '123 Main St',
  to: '789 Pine St',  
  item: 'Legal documents',
  deadline: '2 hours'
});

// RIDES: Get someone somewhere
await meat.ride({
  pickup: '123 Main St',
  dropoff: 'JFK Airport',
  passengers: 2
});

// GIG WORK: Human task
await meat.task({
  type: 'photography',
  location: '123 Main St',
  description: 'Take 10 photos of storefront',
  deadline: 'tomorrow'
});
```

### Natural Language Interface

For agent-to-Meatspace communication:

```
Agent: "Ship a 5 pound package from my warehouse to John Doe at 456 Oak Ave, Los Angeles 90001. Cheapest option."

Meatspace: {
  "action": "ship",
  "from": "Agent Warehouse",  // resolved from agent profile
  "to": "456 Oak Ave, Los Angeles, CA 90001",
  "parcel": { "weight": "5lb" },
  "routing": "cheapest",
  "result": {
    "carrier": "USPS Priority",
    "cost": "$12.45",
    "tracking": "9400111899223456789012",
    "eta": "Feb 8, 2026"
  }
}
```

---

## Routing Engine

### Decision Tree

```
REQUEST RECEIVED
      │
      ▼
┌─────────────────┐
│ CLASSIFY TASK   │
└────────┬────────┘
         │
    ┌────┴────┬────────────┬────────────┐
    ▼         ▼            ▼            ▼
 SHIPPING  DELIVERY     RIDES       GIG WORK
    │         │            │            │
    ▼         ▼            ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Weight? │ │Urgent? │ │People? │ │Skill?  │
│Distance│ │Local?  │ │Items?  │ │Physical│
│Speed?  │ │Food?   │ │Auto?   │ │Digital?│
└────┬───┘ └───┬────┘ └───┬────┘ └───┬────┘
     │         │          │          │
     ▼         ▼          ▼          ▼
  SHIPPO   DOORDASH    UBER     TASKRABBIT
  FEDEX    UBER EATS   LYFT     MTURK
  UPS      DOLLY       WAYMO    HANDY
```

### Scoring Algorithm

```python
def score_option(option, preferences):
    """
    Score each service option based on user preferences.
    Lower score = better.
    """
    
    # Weights
    COST_WEIGHT = preferences.get('cost_weight', 0.4)
    SPEED_WEIGHT = preferences.get('speed_weight', 0.3)
    RELIABILITY_WEIGHT = preferences.get('reliability_weight', 0.2)
    RATING_WEIGHT = preferences.get('rating_weight', 0.1)
    
    # Normalize values (0-1 scale)
    cost_score = option.price / max_price
    speed_score = option.delivery_hours / max_hours
    reliability_score = 1 - option.success_rate
    rating_score = 1 - (option.rating / 5)
    
    return (
        cost_score * COST_WEIGHT +
        speed_score * SPEED_WEIGHT +
        reliability_score * RELIABILITY_WEIGHT +
        rating_score * RATING_WEIGHT
    )
```

---

## Settlement Layer

### Payment Flow

```
1. Agent initiates task
2. Meatspace quotes price (service + fee)
3. Agent signs transaction (USDC/SOL)
4. Funds held in escrow contract
5. Meatspace executes via provider API
6. On completion: escrow releases to Meatspace
7. Meatspace settles with provider (fiat)
```

### Fee Structure

| Service Category | Meatspace Take Rate |
|------------------|---------------------|
| Shipping < $50 | 3% |
| Shipping $50-500 | 2% |
| Shipping $500+ | 1.5% |
| Delivery | 5% |
| Rides | 3% |
| Gig Work | 8% |

Minimum fee: $0.25

---

## Data Model

### Core Entities

```typescript
interface Task {
  id: string;
  type: 'shipping' | 'delivery' | 'ride' | 'gig';
  status: 'pending' | 'routed' | 'in_progress' | 'completed' | 'failed';
  agent_id: string;
  request: TaskRequest;
  provider: string;
  provider_id: string;
  cost: Money;
  created_at: Date;
  completed_at?: Date;
}

interface TaskRequest {
  from?: Address;
  to?: Address;
  parcel?: Parcel;
  deadline?: Date;
  priority?: 'economy' | 'standard' | 'express' | 'overnight';
  routing?: 'cheapest' | 'fastest' | 'best_value';
}

interface Agent {
  id: string;
  wallet_address: string;
  default_address?: Address;
  completed_tasks: number;
  total_spent: Money;
  reputation_score: number;
}
```

---

## OpenClaw Skill

```markdown
# meatspace

## ship
Ship a package from origin to destination.

Usage: meatspace ship [options]

Options:
  --from <address>      Origin address
  --to <address>        Destination address  
  --weight <weight>     Package weight (e.g., "5lb", "2kg")
  --dimensions <dims>   Package dimensions (e.g., "12x8x6in")
  --priority <level>    economy|standard|express|overnight
  --routing <strategy>  cheapest|fastest|best_value

## deliver
Request same-day local delivery.

Usage: meatspace deliver [options]

Options:
  --from <address>      Pickup address
  --to <address>        Delivery address
  --item <description>  What's being delivered
  --deadline <time>     When it needs to arrive

## track
Track a shipment or delivery.

Usage: meatspace track <task_id>

## rates
Get rate quotes without purchasing.

Usage: meatspace rates [options]
```

---

## Implementation Roadmap

### Phase 1: Shipping MVP (Week 1-2)
- [ ] Shippo integration
- [ ] Core API (rates, ship, track)
- [ ] TypeScript SDK
- [ ] OpenClaw skill
- [ ] Manual settlement

### Phase 2: Delivery (Week 3-4)
- [ ] DoorDash Drive integration
- [ ] Uber Direct integration
- [ ] Same-day routing logic
- [ ] Unified tracking

### Phase 3: Full DEX (Week 5-8)
- [ ] Rides integration
- [ ] Gig work (TaskRabbit when available)
- [ ] On-chain settlement contract
- [ ] Agent reputation system

### Phase 4: Scale (Ongoing)
- [ ] Additional carriers/providers
- [ ] Freight integration
- [ ] International expansion
- [ ] Analytics & optimization

---

## Security & Compliance

- API authentication required for all requests
- PII handling per carrier requirements
- Rate limiting: 100 req/min per API key
- Webhook signature verification
- Audit logging for all transactions

---

## The Pitch

> **"Need something done in the physical world?**
> 
> **Tell Meatspace what, where, and when.**
> 
> **We find the best price, fastest route, and most reliable service.**
> 
> **From a letter to a shipping container.**  
> **From food delivery to furniture moving.**  
> **From a ride to the airport to a photographer for your event.**
> 
> **One API. Every service. Crypto settlement."**
