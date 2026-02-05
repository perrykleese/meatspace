# Meatspace Roadmap

## Vision
Meatspace becomes the universal routing layer for physical-world services. Any AI agent can ship packages, request deliveries, book rides, and hire humans through one unified API.

---

## Phase 1: Shipping Foundation ✅ (Week 1)

### Completed
- [x] Core type system (`core/types/index.ts`)
- [x] Routing engine (`core/router/index.ts`)
- [x] Shippo adapter (`adapters/shipping/shippo/index.ts`)
- [x] Main API (`api/meatspace.ts`)
- [x] CLI tool (`skill/cli.ts`)
- [x] OpenClaw skill (`skill/SKILL.md`)
- [x] Architecture docs (`docs/ARCHITECTURE.md`)
- [x] Shipping spec (`docs/SHIPPING-ADAPTER-SPEC.md`)

### Next Steps
- [ ] Get Shippo API key (goshippo.com/signup)
- [ ] Test shipping flow end-to-end
- [ ] Deploy skill to clawhub.com

---

## Phase 2: Delivery Layer (Week 2)

### DoorDash Drive Integration
- [ ] Apply for API access
- [ ] Build adapter (`adapters/delivery/doordash/`)
- [ ] Implement quote/create/track methods
- [ ] Add to router

### Uber Direct Integration
- [ ] Apply for API access
- [ ] Build adapter (`adapters/delivery/uber-direct/`)
- [ ] Implement quote/create/track methods
- [ ] Add to router

### Dolly/TaskRabbit Delivery
- [ ] Apply for API access
- [ ] Build adapter (`adapters/delivery/dolly/`)

---

## Phase 3: Rides Layer (Week 3-4)

### Uber Business API
- [ ] Register for Uber for Business
- [ ] Build adapter (`adapters/rides/uber/`)
- [ ] Implement quote/request/track methods

### Lyft Business API
- [ ] Register for Lyft Business
- [ ] Build adapter (`adapters/rides/lyft/`)

### Waymo Integration
- [ ] Monitor Waymo developer program
- [ ] Prepare adapter interface

---

## Phase 4: Gig Work Layer (Week 5-6)

### Amazon Mechanical Turk
- [ ] AWS MTurk account setup
- [ ] Build adapter (`adapters/gig/mturk/`)
- [ ] HIT creation/management

### TaskRabbit Home Services
- [ ] Monitor API launch
- [ ] Build adapter when available

---

## Phase 5: Settlement Layer (Week 7-8)

### Crypto Payment Rails
- [ ] Escrow contract on Solana
- [ ] USDC payment integration
- [ ] Fiat bridge for provider payments

### Agent Reputation System
- [ ] Track completed tasks
- [ ] Reputation scoring algorithm
- [ ] On-chain reputation NFT

---

## Phase 6: Scale & Optimize (Ongoing)

### Additional Carriers
- [ ] Freightos (freight)
- [ ] uShip (specialty shipping)
- [ ] Regional carriers

### Analytics & Optimization
- [ ] Cost optimization ML
- [ ] Route prediction
- [ ] Demand forecasting

### Enterprise Features
- [ ] Multi-agent support
- [ ] Volume discounts
- [ ] Custom SLAs

---

## API Access Applications

### Shipping
- [x] Shippo - goshippo.com (ready to sign up)

### Delivery
- [ ] DoorDash Drive - developer.doordash.com
- [ ] Uber Direct - developer.uber.com
- [ ] TaskRabbit/Dolly - developer.taskrabbit.com

### Rides
- [ ] Uber Business - uber.com/business
- [ ] Lyft Business - lyft.com/business

### Gig Work
- [ ] Amazon MTurk - mturk.com (AWS account)

---

## Metrics to Track

### Usage
- Total tasks routed
- Tasks by type (shipping/delivery/rides/gig)
- Unique agents using Meatspace

### Economics
- GMV (Gross Merchandise Value)
- Revenue (fees collected)
- Average task value

### Performance
- Routing accuracy
- Carrier reliability scores
- Task completion rate

---

## Open Questions

1. **Fiat Bridge** - How to efficiently convert USDC to fiat for providers?
2. **International** - Customs handling for international shipping?
3. **Returns** - How to handle refunds and returns elegantly?
4. **Insurance** - Built-in shipping insurance offering?
5. **Workers** - Eventually build native worker network?

---

## Success Criteria

### Short-term (1 month)
- 100 shipments processed
- 3 adapters live (Shippo, DoorDash, Uber)
- 10 agents actively using

### Medium-term (3 months)
- $100K GMV
- Full task type coverage
- On-chain settlement live

### Long-term (1 year)
- $10M+ GMV
- Become the default physical services API for AI agents
- Network effects kicking in
