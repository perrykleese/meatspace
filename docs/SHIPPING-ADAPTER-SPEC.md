# Meatspace Shipping Adapter Specification

**Version:** 1.0  
**Date:** February 4, 2026  
**Status:** Draft

---

## Overview

The Shipping Adapter enables AI agents to ship physical items through Meatspace's unified API. It wraps **Shippo** as the primary backend (85+ carriers) and provides a simple, agent-friendly interface with crypto settlement.

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT REQUEST                           │
│  "Ship this 5lb package from NYC to LA, cheapest option"    │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────────┐
│                   MEATSPACE SHIPPING API                      │
├───────────────────────────────────────────────────────────────┤
│  • Parse request                                              │
│  • Validate addresses                                         │
│  • Get rates from all carriers                                │
│  • Apply routing logic (cheapest/fastest/best value)          │
│  • Return options or auto-select                              │
└───────────────────────────┬───────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────────┐
│                      SHIPPO API                               │
│  85+ carriers: USPS, FedEx, UPS, DHL, regional carriers       │
└───────────────────────────┬───────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────────┐
│                  SETTLEMENT LAYER                             │
│  Agent pays: USDC/SOL → Meatspace → Fiat → Shippo → Carrier   │
└───────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### 1. Shipment Types

| Type | Weight Range | Typical Use | Providers |
|------|--------------|-------------|-----------|
| **Letter** | < 1 oz | Documents, cards | USPS First Class |
| **Parcel** | 1 oz - 150 lbs | E-commerce, gifts | USPS, FedEx, UPS, DHL |
| **Freight** | 150+ lbs | Pallets, bulk | Freightos (future) |

### 2. Priority Levels

| Priority | Delivery Time | Cost | Use Case |
|----------|---------------|------|----------|
| `economy` | 5-10 days | Lowest | Non-urgent |
| `standard` | 3-5 days | Medium | Default |
| `express` | 1-2 days | Higher | Time-sensitive |
| `overnight` | Next day | Highest | Urgent |
| `same_day` | Hours | Variable | Local (uses delivery adapters) |

---

## API Specification

### Base URL
```
https://api.meatspace.so/v1/shipping
```

### Authentication
```
Authorization: Bearer <MEATSPACE_API_KEY>
```

---

### Endpoints

#### 1. Get Rates

Get shipping rates without purchasing.

```http
POST /rates
```

**Request:**
```json
{
  "from": {
    "name": "Agent Warehouse",
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "to": {
    "name": "John Doe",
    "street1": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90001",
    "country": "US"
  },
  "parcel": {
    "length": 12,
    "width": 8,
    "height": 6,
    "distance_unit": "in",
    "weight": 5,
    "mass_unit": "lb"
  }
}
```

**Response:**
```json
{
  "shipment_id": "shp_abc123",
  "rates": [
    {
      "rate_id": "rate_001",
      "carrier": "usps",
      "service": "Priority Mail",
      "amount": "12.45",
      "currency": "USD",
      "estimated_days": 3,
      "arrives_by": "2026-02-08"
    },
    {
      "rate_id": "rate_002",
      "carrier": "fedex",
      "service": "Ground",
      "amount": "15.20",
      "currency": "USD",
      "estimated_days": 5,
      "arrives_by": "2026-02-10"
    },
    {
      "rate_id": "rate_003",
      "carrier": "ups",
      "service": "2nd Day Air",
      "amount": "28.50",
      "currency": "USD",
      "estimated_days": 2,
      "arrives_by": "2026-02-07"
    }
  ],
  "recommended": {
    "cheapest": "rate_001",
    "fastest": "rate_003",
    "best_value": "rate_001"
  }
}
```

---

#### 2. Ship (Rate + Purchase in One Call)

For agents that want auto-routing without manual rate selection.

```http
POST /ship
```

**Request:**
```json
{
  "from": {
    "name": "Agent Warehouse",
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "to": {
    "name": "John Doe",
    "street1": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90001",
    "country": "US"
  },
  "parcel": {
    "length": 12,
    "width": 8,
    "height": 6,
    "distance_unit": "in",
    "weight": 5,
    "mass_unit": "lb"
  },
  "priority": "standard",
  "routing": "cheapest",
  "payment": {
    "method": "wallet",
    "wallet_address": "0x..."
  }
}
```

**Response:**
```json
{
  "shipment_id": "shp_abc123",
  "status": "purchased",
  "tracking_number": "9400111899223456789012",
  "tracking_url": "https://meatspace.so/track/shp_abc123",
  "carrier": "usps",
  "service": "Priority Mail",
  "cost": {
    "shipping": "12.45",
    "meatspace_fee": "0.37",
    "total": "12.82",
    "currency": "USD",
    "crypto_amount": "12.82",
    "crypto_currency": "USDC"
  },
  "label": {
    "url": "https://api.meatspace.so/labels/shp_abc123.pdf",
    "format": "PDF"
  },
  "estimated_delivery": "2026-02-08"
}
```

---

#### 3. Purchase Label (From Existing Rate)

```http
POST /purchase
```

**Request:**
```json
{
  "rate_id": "rate_001",
  "payment": {
    "method": "wallet",
    "wallet_address": "0x..."
  }
}
```

**Response:** Same as `/ship`

---

#### 4. Track Shipment

```http
GET /track/{shipment_id}
```

**Response:**
```json
{
  "shipment_id": "shp_abc123",
  "tracking_number": "9400111899223456789012",
  "carrier": "usps",
  "status": "in_transit",
  "status_detail": "Departed USPS Regional Facility",
  "estimated_delivery": "2026-02-08",
  "tracking_history": [
    {
      "status": "pre_transit",
      "message": "Label created",
      "timestamp": "2026-02-04T14:30:00Z",
      "location": "New York, NY"
    },
    {
      "status": "in_transit",
      "message": "Accepted at USPS Origin Facility",
      "timestamp": "2026-02-04T18:45:00Z",
      "location": "New York, NY"
    },
    {
      "status": "in_transit",
      "message": "Departed USPS Regional Facility",
      "timestamp": "2026-02-05T02:30:00Z",
      "location": "Newark, NJ"
    }
  ]
}
```

---

#### 5. Validate Address

```http
POST /validate-address
```

**Request:**
```json
{
  "street1": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "US"
}
```

**Response:**
```json
{
  "valid": true,
  "suggested": {
    "street1": "123 MAIN ST",
    "city": "NEW YORK",
    "state": "NY",
    "zip": "10001-1234",
    "country": "US"
  },
  "messages": []
}
```

---

#### 6. Get Carrier Services

```http
GET /carriers
```

**Response:**
```json
{
  "carriers": [
    {
      "carrier": "usps",
      "name": "USPS",
      "services": [
        {"code": "usps_priority", "name": "Priority Mail", "estimated_days": "1-3"},
        {"code": "usps_first", "name": "First Class", "estimated_days": "2-5"},
        {"code": "usps_ground_advantage", "name": "Ground Advantage", "estimated_days": "2-5"},
        {"code": "usps_express", "name": "Priority Mail Express", "estimated_days": "1-2"}
      ]
    },
    {
      "carrier": "fedex",
      "name": "FedEx",
      "services": [
        {"code": "fedex_ground", "name": "Ground", "estimated_days": "1-7"},
        {"code": "fedex_express_saver", "name": "Express Saver", "estimated_days": "3"},
        {"code": "fedex_2day", "name": "2Day", "estimated_days": "2"},
        {"code": "fedex_overnight", "name": "Standard Overnight", "estimated_days": "1"}
      ]
    },
    {
      "carrier": "ups",
      "name": "UPS",
      "services": [
        {"code": "ups_ground", "name": "Ground", "estimated_days": "1-5"},
        {"code": "ups_3day", "name": "3 Day Select", "estimated_days": "3"},
        {"code": "ups_2day", "name": "2nd Day Air", "estimated_days": "2"},
        {"code": "ups_next_day", "name": "Next Day Air", "estimated_days": "1"}
      ]
    }
  ]
}
```

---

## SDK Design

### TypeScript/JavaScript

```typescript
import { Meatspace } from '@meatspace/sdk';

const meatspace = new Meatspace({
  apiKey: process.env.MEATSPACE_API_KEY,
  walletAddress: '0x...'
});

// Simple one-liner
const shipment = await meatspace.ship({
  from: '123 Main St, NYC 10001',
  to: '456 Oak Ave, LA 90001',
  parcel: { weight: '5lb', dimensions: '12x8x6in' },
  priority: 'cheapest'
});

console.log(shipment.tracking_url);
// https://meatspace.so/track/shp_abc123

// Get rates first
const rates = await meatspace.rates({
  from: { street1: '123 Main St', city: 'NYC', state: 'NY', zip: '10001' },
  to: { street1: '456 Oak Ave', city: 'LA', state: 'CA', zip: '90001' },
  parcel: { length: 12, width: 8, height: 6, weight: 5 }
});

// Pick cheapest
const label = await meatspace.purchase(rates.recommended.cheapest);

// Track
const status = await meatspace.track(shipment.shipment_id);
```

### Python

```python
from meatspace import Meatspace

meatspace = Meatspace(
    api_key=os.environ["MEATSPACE_API_KEY"],
    wallet_address="0x..."
)

# Simple one-liner
shipment = meatspace.ship(
    from_address="123 Main St, NYC 10001",
    to_address="456 Oak Ave, LA 90001",
    parcel={"weight": "5lb", "dimensions": "12x8x6in"},
    priority="cheapest"
)

print(shipment.tracking_url)
```

### OpenClaw Skill

```markdown
# meatspace-shipping skill

## Commands

### Ship a package
meatspace ship --from "123 Main St, NYC 10001" --to "456 Oak Ave, LA 90001" --weight 5lb --dimensions 12x8x6in --priority cheapest

### Get rates
meatspace rates --from "123 Main St, NYC 10001" --to "456 Oak Ave, LA 90001" --weight 5lb

### Track
meatspace track shp_abc123
```

---

## Routing Logic

### Priority → Carrier Mapping

```python
def select_rate(rates: List[Rate], priority: str, routing: str) -> Rate:
    """
    Select the best rate based on priority and routing preference.
    """
    
    # Filter by delivery time
    if priority == "overnight":
        rates = [r for r in rates if r.estimated_days <= 1]
    elif priority == "express":
        rates = [r for r in rates if r.estimated_days <= 2]
    elif priority == "standard":
        rates = [r for r in rates if r.estimated_days <= 5]
    # economy = no filter, all rates
    
    if not rates:
        raise NoRatesAvailable("No rates match the requested priority")
    
    # Sort by routing preference
    if routing == "cheapest":
        return min(rates, key=lambda r: r.amount)
    elif routing == "fastest":
        return min(rates, key=lambda r: r.estimated_days)
    elif routing == "best_value":
        # Value score: lower is better
        # Balances cost and speed
        return min(rates, key=lambda r: r.amount * (1 + r.estimated_days * 0.1))
    
    return rates[0]
```

### Carrier Preferences

For certain shipment types, prefer specific carriers:

| Scenario | Preferred Carrier | Reason |
|----------|-------------------|--------|
| Lightweight (<1lb) | USPS | Cheapest for small packages |
| Heavy (50+ lbs) | FedEx/UPS | Better rates for heavy items |
| International | DHL | Best global network |
| Overnight | FedEx | Most reliable overnight |
| Tracking critical | UPS | Best tracking granularity |

---

## Payment & Settlement

### Flow

```
1. Agent requests shipment
2. Meatspace calculates total: shipping + 3% fee
3. Agent approves USDC transfer
4. Meatspace receives USDC
5. Meatspace calls Shippo API (prepaid account)
6. Label generated, returned to agent
7. Daily: Meatspace converts USDC → Fiat → Shippo account top-up
```

### Fee Structure

| Shipping Cost | Meatspace Fee |
|---------------|---------------|
| $0 - $50 | 3% |
| $50 - $500 | 2% |
| $500+ | 1.5% |

Minimum fee: $0.25

---

## Webhook Events

Agents can subscribe to tracking updates:

```http
POST /webhooks
{
  "url": "https://agent.example.com/shipping-updates",
  "events": ["tracking.updated", "tracking.delivered", "tracking.exception"]
}
```

**Event Payload:**
```json
{
  "event": "tracking.updated",
  "shipment_id": "shp_abc123",
  "tracking_number": "9400111899223456789012",
  "status": "out_for_delivery",
  "timestamp": "2026-02-08T08:30:00Z"
}
```

---

## Implementation Plan

### Phase 1: MVP (Week 1)
- [ ] Shippo account setup
- [ ] Core API endpoints (rates, ship, track)
- [ ] Basic TypeScript SDK
- [ ] Manual crypto settlement

### Phase 2: Automation (Week 2)
- [ ] Auto-routing logic
- [ ] Address validation
- [ ] Webhook system
- [ ] Python SDK

### Phase 3: OpenClaw Integration (Week 3)
- [ ] OpenClaw skill (SKILL.md + CLI)
- [ ] Blinks support for shipping
- [ ] On-chain settlement contract

### Phase 4: Scale (Week 4+)
- [ ] Freight integration (Freightos)
- [ ] International customs
- [ ] Returns/refunds
- [ ] Analytics dashboard

---

## Dependencies

- **Shippo API** - Primary shipping backend
  - API Key required
  - Test mode available
  - Docs: https://docs.goshippo.com

- **Solana/USDC** - Payment settlement
  - Agent wallet integration
  - Escrow contract for prepayment

---

## Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| `invalid_address` | Address validation failed | Provide corrected address |
| `no_rates` | No carriers service this route | Check address or parcel specs |
| `insufficient_funds` | Wallet balance too low | Fund wallet |
| `label_failed` | Carrier rejected label | Retry or contact support |
| `tracking_not_found` | Shipment not in carrier system | Wait or check tracking number |

---

## Security

- All API calls require authentication
- Webhook signatures for verification
- Rate limiting: 100 req/min per API key
- PII handling per carrier requirements

---

## Future Enhancements

1. **Multi-package shipments** - Ship multiple items as one order
2. **Scheduled pickups** - Carrier pickup scheduling
3. **Insurance** - Built-in shipping insurance
4. **Carbon offset** - Carbon-neutral shipping option
5. **Returns portal** - Easy returns flow
