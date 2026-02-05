# 🥩 MEATSPACE

**The Decentralized Exchange for Physical-World Services**

> AI agents can do anything digital. But atoms still require humans.  
> Meatspace is the API that gives agents hands — and wheels, and wings.

---

## What is Meatspace?

Meatspace routes physical-world tasks to the best available service provider. Like 1inch aggregates DEXes for best-price swaps, Meatspace aggregates gig economy and logistics services for best-execution physical tasks.

**One API. Every service. Crypto settlement.**

```
LETTER ($0.50) ←─────────────────────────────────────────→ CONTAINER ($50,000)
                              MEATSPACE
FOOD DELIVERY ($15) ←────────────────────────────────────→ MOVING TRUCK ($500)  
                              MEATSPACE
UBER RIDE ($25) ←────────────────────────────────────────→ WAYMO AUTONOMOUS ($?)
                              MEATSPACE
```

---

## Quick Start

```typescript
import { Meatspace } from '@meatspace/sdk';

const meat = new Meatspace({
  shippoApiKey: process.env.SHIPPO_API_KEY,
  walletAddress: '0x...'
});

// Ship a package
const shipment = await meat.ship({
  from: '123 Main St, NYC 10001',
  to: '456 Oak Ave, LA 90001',
  parcel: { weight: '5lb', dimensions: '12x8x6in' },
  routing: 'cheapest'
});

console.log(shipment.tracking_url);
// https://meatspace.so/track/shp_abc123
```

---

## Features

### 📦 Shipping (Live)
Ship anything from letters to freight. 85+ carriers via Shippo.

```bash
meatspace ship --from "NYC 10001" --to "LA 90001" --weight "5lb"
```

### 🚗 Delivery (Coming Soon)
Same-day local delivery via DoorDash, Uber Direct, Dolly.

```bash
meatspace deliver --from "123 Main St" --to "789 Pine St" --deadline "2 hours"
```

### 🚕 Rides (Coming Soon)
Book rides via Uber, Lyft, Waymo.

```bash
meatspace ride --pickup "123 Main St" --dropoff "JFK Airport"
```

### 👷 Gig Work (Coming Soon)
Hire humans for physical tasks via TaskRabbit, MTurk.

```bash
meatspace task --type "photography" --description "Take 10 photos"
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT REQUEST                           │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────────┐
│                   MEATSPACE ROUTER                            │
│  • Parse request    • Get quotes from all adapters            │
│  • Route to best    • Settlement in USDC/SOL                  │
└───────────────────────────┬───────────────────────────────────┘
                            ↓
┌──────────┬──────────┬──────────┬──────────┐
│  Shippo  │ DoorDash │   Uber   │TaskRabbit│
│  FedEx   │  Uber    │   Lyft   │  MTurk   │
│  UPS     │  Dolly   │  Waymo   │  Handy   │
└──────────┴──────────┴──────────┴──────────┘
```

---

## Routing Strategies

| Strategy | Description |
|----------|-------------|
| `cheapest` | Lowest cost, may be slower |
| `fastest` | Fastest delivery |
| `best_value` | Balanced price/speed (default) |
| `most_reliable` | Highest-rated carriers |

---

## Pricing

Meatspace charges a small routing fee:

| Service Cost | Fee |
|--------------|-----|
| < $50 | 3% |
| $50-$500 | 2% |
| $500+ | 1.5% |

Minimum fee: $0.25. Pay in USDC or SOL.

---

## Project Structure

```
meatspace/
├── api/                    # Main API layer
│   └── meatspace.ts        # Unified Meatspace client
├── core/
│   ├── types/              # TypeScript types
│   └── router/             # Routing engine
├── adapters/
│   ├── shipping/           # Shipping providers
│   │   ├── shippo/         # Shippo (85+ carriers)
│   │   ├── usps/           # USPS direct
│   │   └── freightos/      # Freight
│   ├── delivery/           # Same-day delivery
│   │   ├── doordash/
│   │   └── uber-direct/
│   ├── rides/              # Ride services
│   └── gig/                # Gig work
├── skill/                  # OpenClaw skill
│   ├── SKILL.md
│   └── cli.ts
├── programs/               # Solana programs (Anchor)
├── blinks-api/             # Solana Actions/Blinks
└── docs/                   # Documentation
```

---

## Environment Variables

```bash
# Shipping (required)
export SHIPPO_API_KEY="shippo_live_xxx"

# Payments (required)
export MEATSPACE_WALLET="0x..."

# Optional
export MEATSPACE_DEFAULT_ROUTING="best_value"
export MEATSPACE_TEST_MODE="false"
```

---

## Development

```bash
# Install dependencies
npm install

# Run CLI
npm run cli -- ship --from "NYC" --to "LA" --weight "5lb"

# Run tests
npm test

# Build
npm run build
```

---

## Roadmap

### Phase 1: Shipping ✅
- [x] Shippo integration
- [x] Core types & router
- [x] CLI tool
- [x] OpenClaw skill

### Phase 2: Delivery (Week 2)
- [ ] DoorDash Drive integration
- [ ] Uber Direct integration
- [ ] Same-day routing

### Phase 3: Rides (Week 3-4)
- [ ] Uber Business API
- [ ] Lyft Business API
- [ ] Waymo (when available)

### Phase 4: Gig Work (Week 5+)
- [ ] TaskRabbit Home Services (when API launches)
- [ ] Amazon MTurk
- [ ] Full settlement contracts

---

## Links

- **Website:** [meatspace.so](https://meatspace.so)
- **Docs:** [docs.meatspace.so](https://docs.meatspace.so)
- **GitHub:** [github.com/perrykleese/meatspace](https://github.com/perrykleese/meatspace)
- **Token:** `$MEAT` on Solana

---

## License

MIT

---

> *"Need something moved? Tell Meatspace what, where, and when."*
