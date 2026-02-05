# meatspace

Ship packages, request deliveries, book rides, and hire humans for physical-world tasks. Meatspace is the DEX for physical services.

## Setup

Requires API keys configured in environment:
- `SHIPPO_API_KEY` - For shipping (get at goshippo.com)
- `DOORDASH_API_KEY` - For same-day delivery (coming soon)
- `MEATSPACE_WALLET` - Solana wallet for payments

## Commands

### ship

Ship a package from origin to destination.

```bash
meatspace ship \
  --from "123 Main St, New York, NY 10001" \
  --to "456 Oak Ave, Los Angeles, CA 90001" \
  --weight "5lb" \
  --dimensions "12x8x6in" \
  --routing cheapest
```

**Options:**
- `--from` - Origin address (required)
- `--to` - Destination address (required)
- `--weight` - Package weight, e.g., "5lb", "2kg" (required)
- `--dimensions` - Package dimensions, e.g., "12x8x6in" (optional, defaults to standard box)
- `--priority` - economy|standard|express|overnight (default: standard)
- `--routing` - cheapest|fastest|best_value (default: best_value)
- `--insurance` - Add shipping insurance
- `--signature` - Require signature on delivery

**Output:**
```json
{
  "tracking_number": "9400111899223456789012",
  "carrier": "USPS",
  "service": "Priority Mail",
  "cost": "$12.82",
  "estimated_delivery": "2026-02-08",
  "label_url": "https://api.meatspace.so/labels/shp_123.pdf"
}
```

### rates

Get shipping rate quotes without purchasing.

```bash
meatspace rates \
  --from "123 Main St, NYC 10001" \
  --to "456 Oak Ave, LA 90001" \
  --weight "5lb"
```

**Output:**
```
CARRIER          SERVICE              PRICE    DAYS
usps             Priority Mail        $12.45   3
usps             Ground Advantage     $8.20    5
fedex            Ground               $15.20   5
fedex            2Day                 $28.50   2
ups              Ground               $14.80   4
ups              2nd Day Air          $32.00   2
```

### track

Track a shipment by ID or tracking number.

```bash
meatspace track 9400111899223456789012
```

**Output:**
```
STATUS: In Transit
CARRIER: USPS
LAST UPDATE: Feb 5, 2026 2:30 AM - Departed Newark, NJ

TRACKING HISTORY:
  Feb 4, 6:45 PM - Accepted at USPS Origin Facility (New York, NY)
  Feb 4, 2:30 PM - Label Created
```

### validate

Validate and standardize an address.

```bash
meatspace validate "123 main street, new york ny 10001"
```

**Output:**
```
VALID: Yes
STANDARDIZED:
  123 MAIN ST
  NEW YORK, NY 10001-1234
```

### deliver (coming soon)

Request same-day local delivery.

```bash
meatspace deliver \
  --from "123 Main St" \
  --to "789 Pine St" \
  --item "Legal documents" \
  --deadline "2 hours"
```

### ride (coming soon)

Book a ride.

```bash
meatspace ride \
  --pickup "123 Main St" \
  --dropoff "JFK Airport" \
  --passengers 2
```

### task (coming soon)

Hire a human for a physical task.

```bash
meatspace task \
  --type "photography" \
  --location "123 Main St" \
  --description "Take 10 photos of storefront" \
  --deadline "tomorrow"
```

## Routing Strategies

- **cheapest** - Lowest price, may be slower
- **fastest** - Fastest delivery, may cost more
- **best_value** - Balanced price/speed (default)
- **most_reliable** - Prioritizes carriers with best track record

## Priority Levels

- **economy** - 5-10 days, cheapest option
- **standard** - 3-5 days, balanced (default)
- **express** - 1-2 days, faster
- **overnight** - Next business day
- **same_day** - Within hours (uses delivery adapters)

## Supported Carriers

### Shipping
- USPS (Priority, Ground Advantage, Express)
- FedEx (Ground, Express Saver, 2Day, Overnight)
- UPS (Ground, 3 Day, 2nd Day, Next Day)
- DHL (Express)
- 80+ regional carriers via Shippo

### Delivery (Coming Soon)
- DoorDash Drive
- Uber Direct
- Dolly

### Rides (Coming Soon)
- Uber
- Lyft
- Waymo (autonomous)

## Examples

### Ship the cheapest way
```bash
meatspace ship \
  --from "Warehouse, Newark NJ 07102" \
  --to "Customer, Austin TX 78701" \
  --weight "3lb" \
  --routing cheapest
```

### Ship overnight with insurance
```bash
meatspace ship \
  --from "Office, NYC 10001" \
  --to "Client, Chicago IL 60601" \
  --weight "1lb" \
  --priority overnight \
  --insurance
```

### Get all rate options
```bash
meatspace rates \
  --from "123 Main St, Seattle WA 98101" \
  --to "456 Oak Ave, Portland OR 97201" \
  --weight "10lb" \
  --dimensions "18x12x8in"
```

## Pricing

Meatspace adds a small fee on top of carrier rates:
- Shipments < $50: 3%
- Shipments $50-$500: 2%
- Shipments $500+: 1.5%
- Minimum fee: $0.25

Pay in USDC or SOL via your connected wallet.

## Error Handling

| Error | Meaning | Solution |
|-------|---------|----------|
| `invalid_address` | Address couldn't be validated | Check spelling, use `meatspace validate` |
| `no_rates` | No carriers service this route | Check addresses, parcel size |
| `insufficient_funds` | Wallet balance too low | Add USDC to wallet |
| `label_failed` | Carrier rejected label | Check address completeness |

## Environment Variables

```bash
# Required for shipping
export SHIPPO_API_KEY="shippo_live_xxx"

# Required for payments
export MEATSPACE_WALLET="0x..."

# Optional
export MEATSPACE_DEFAULT_ROUTING="best_value"
export MEATSPACE_TEST_MODE="false"
```
