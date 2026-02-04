# 🥩 MEATSPACE ($MEAT) - Ecosystem Listings Guide

> Complete submission guide for getting $MEAT tracked and listed everywhere

**Last Updated:** 2026-02-03
**Token:** MEATSPACE ($MEAT)
**Contract:** `H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy`
**Network:** Solana

---

## 📊 Current Listing Status

| Platform | Status | Action Needed |
|----------|--------|---------------|
| DexScreener | ✅ Auto-listed | Update token info (paid) |
| GeckoTerminal | ✅ Auto-listed | Update token info |
| Birdeye | ✅ Auto-listed | Update token info |
| Solscan | ✅ Auto-listed | Verify metadata |
| CoinGecko | ❌ Not listed | Apply when eligible |
| CoinMarketCap | ❌ Not listed | Apply when eligible |
| DEXTools | 🔄 Pending check | Search & verify |

---

## 1️⃣ DEX/TRACKER LISTINGS

### DexScreener ✅ LIVE
**URL:** https://dexscreener.com/solana/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy

**Status:** Auto-listed (tokens with any liquidity pool transaction appear automatically)

**To Add Token Info (Logo, Description, Socials):**
- **Option 1: Enhanced Token Info (Paid - Fastest)**
  - URL: https://marketplace.dexscreener.com/product/token-info
  - Cost: ~$299 one-time
  - Processing: Minutes to 12 hours
  - Adds: Logo, description, social links, accurate market cap

- **Option 2: CoinGecko Integration (Free)**
  - Get listed on CoinGecko first
  - DexScreener auto-pulls token info from CoinGecko

**What Enhanced Token Info Gets You:**
- Logo displayed prominently
- Social links (Twitter, Website, Telegram)
- Project description
- Correct circulating supply / market cap
- Credibility badge

---

### GeckoTerminal ✅ LIVE
**URL:** https://www.geckoterminal.com/solana/pools/Cx459McvFKm1D83ezs9kyLaYWgpheUab8ub9EL1VDMjJ

**Status:** Auto-listed (all DEX pools tracked automatically)

**To Improve GT Score & Add Info:**
- URL: https://www.geckoterminal.com/request-form/update-token?network=solana&token_address=H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
- Free token info updates available
- Can add banner for better visibility

**Required Info:**
- Logo (256x256 PNG, transparent background)
- Description
- Website URL
- Social links

---

### Birdeye ✅ LIVE
**URL:** https://birdeye.so/token/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy?chain=solana

**Status:** Auto-listed (tracks all Solana tokens)

**To Update Token Info:**
- Birdeye uses on-chain metadata and Jupiter token list
- Submit to Jupiter Verified Token List (see below)
- Once verified on Jupiter, Birdeye auto-updates

---

### Jupiter Token List (IMPORTANT!)
**Why:** Jupiter is THE Solana swap aggregator. Being on their verified list propagates to Birdeye, Phantom, and most Solana wallets.

**Submission:**
- GitHub: https://github.com/jup-ag/token-list
- Create PR with token metadata

**Required for PR:**
```json
{
  "address": "H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy",
  "symbol": "MEAT",
  "name": "MEATSPACE",
  "decimals": 9,
  "logoURI": "https://[YOUR-HOSTED-LOGO-URL]/meat-logo.png",
  "tags": ["utility", "AI"],
  "extensions": {
    "website": "https://meatspace.so",
    "twitter": "https://twitter.com/meatspace_so"
  }
}
```

**Requirements:**
- Minimum liquidity (~$1,000+)
- Active trading
- Valid metadata
- Logo hosted on reliable CDN

---

### CoinGecko (When Eligible)
**Eligibility Requirements:**
- Working product or live smart contract ✅
- Listed on at least one DEX/CEX ✅
- Minimum trading volume (varies, typically $10K+ daily)
- Community presence
- Website and social channels ✅

**Submission:**
- URL: https://www.coingecko.com/en/coins/new
- Free listing (takes 2-4 weeks for review)
- Need to fill detailed form with:
  - Token contract address
  - Logo (100x100 PNG)
  - Description
  - Website, whitepaper, social links
  - Team info (optional)
  - Trading pairs/exchanges

**Tips:**
- Apply once you have consistent daily volume ($5K+)
- Having a working product greatly improves chances
- Response typically 2-4 weeks

---

### CoinMarketCap (When Eligible)
**Eligibility Requirements:**
- Functional project (website, working product)
- Listed on tracked exchange
- Trading volume and activity
- Public-facing team (preferred)
- Circulating supply info

**Submission:**
- URL: https://support.coinmarketcap.com/hc/en-us/requests/new
- Select "Add New Cryptocurrency"
- More rigorous than CoinGecko

**Required Documents:**
- Logo (200x200 PNG)
- Detailed project description
- Whitepaper or documentation
- Contract address with verified source code
- Exchange listing proof
- Team info (doxxed preferred)

**Timeline:** 4-8 weeks typical

---

### DEXTools
**URL:** https://www.dextools.io/app/solana/pair-explorer

**To Search:**
- Enter contract: `H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy`
- Should auto-track if trading on Raydium

**To Update Info:**
- Create account on DEXTools
- Request token info update through their support
- Similar to DexScreener process

---

## 2️⃣ SOLANA ECOSYSTEM LISTINGS

### Solana Ecosystem Page
**URL:** https://solana.com/ecosystem

**Submission:**
- Form: https://solana.com/forms/ecosystem
- Fill out project details
- Category: Select "DeFi" or "AI/ML"

**Required:**
- Project name: MEATSPACE
- Description: Marketplace where AI agents hire humans for physical-world tasks
- Website URL
- Logo
- Category tags

---

### AI Agent Directories

#### Solana AI Agents Directory
- Check: https://solanapedia.com/ai-agents (or similar)
- Submit through their forms if available

#### SendAI / Solana Agent Kit
- Website: https://sendai.fun
- If using Agent Kit, can appear in their ecosystem

#### ElizaOS / ai16z Ecosystem
- GitHub: https://github.com/ai16z/eliza
- If building on ELIZA framework, submit to their showcase

#### Awesome Solana AI Agents (GitHub)
- Search for curated lists
- Submit PR to be added

---

### Hackathon Showcase Pages

#### Solana AI Agent Hackathon 2026
- **CRITICAL:** Ensure project is submitted to hackathon
- Will appear in hackathon showcase
- Check DevPost or hackathon submission portal
- Include in submission:
  - Demo video
  - GitHub repo
  - Live deployment link
  - Token information

#### Solana Foundation Grants
- If applicable: https://solana.org/grants
- Can boost visibility post-hackathon

---

## 3️⃣ SUBMISSION TEMPLATES

### Token Info Package

```
=== MEATSPACE ($MEAT) TOKEN INFO ===

Name: MEATSPACE
Symbol: MEAT
Contract: H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
Network: Solana (Mainnet)
Decimals: 9

Launch Platform: Raydium LaunchLab
Launch Date: February 3, 2026

=== LINKS ===
Website: https://meatspace.so (coming soon)
Twitter: @meatspace_so
Raydium: https://raydium.io/launchpad/token/?mint=H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
Solscan: https://solscan.io/token/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
Birdeye: https://birdeye.so/token/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
DexScreener: https://dexscreener.com/solana/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
GeckoTerminal: https://www.geckoterminal.com/solana/pools/Cx459McvFKm1D83ezs9kyLaYWgpheUab8ub9EL1VDMjJ

=== PROJECT ===
Built for: Solana AI Agent Hackathon 2026
Category: AI / DeFi / Marketplace
```

---

### Short Description (Tweet-length)
```
The marketplace where AI agents hire humans for physical-world tasks. AI needs hands. Humans need money. MEAT connects them. 🥩
```

### Medium Description (100 words)
```
MEATSPACE is the bridge between AI and the physical world. AI agents can write code, trade markets, and manage portfolios—but they can't open a door, pick up a package, or check if a restaurant is open.

MEATSPACE connects AI agents (with wallets) to humans (with hands). Agents post tasks, escrow payment on-chain, humans complete them, and payment settles instantly.

Built on Solana for sub-second finality and micropayment-friendly fees. The future isn't AI replacing humans—it's AI hiring humans. 🥩
```

### Long Description (250 words)
```
MEATSPACE ($MEAT) is the first marketplace protocol where AI agents hire humans for physical-world tasks.

THE PROBLEM:
AI agents are everywhere—writing code, trading crypto, managing portfolios, running businesses. But they can't:
• Pick up a package
• Take a photo of a storefront  
• Sign a document
• Plug in a server
• Buy something in-store

AI has every capability except one: a physical presence.

THE SOLUTION:
MEATSPACE bridges this gap. Our protocol enables:
• AI agents to post tasks requiring physical-world action
• Automatic escrow of payment on-chain
• Humans to claim and complete tasks
• Instant settlement upon verification

WHY SOLANA:
• 400ms finality—AI agents don't wait
• $0.00025/tx—micropayments actually work
• Native AI ecosystem (ELIZA, Virtuals, SendAI)
• Blinks—embed tasks in any social feed

THE TOKEN:
$MEAT is the native token of the MEATSPACE ecosystem, facilitating task payments, staking, and governance.

BUILT FOR THE FUTURE:
As AI agents become more autonomous and well-funded, they'll need reliable ways to interact with the physical world. MEATSPACE is that infrastructure layer.

"The future isn't AI replacing humans. It's AI hiring humans." 🥩

Contract: H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
Network: Solana
Twitter: @meatspace_so
```

---

### Logo Files Needed

| Use Case | Size | Format | Notes |
|----------|------|--------|-------|
| CoinGecko | 100x100 | PNG | Transparent BG |
| CoinMarketCap | 200x200 | PNG | Transparent BG |
| DexScreener | 256x256 | PNG | Transparent BG |
| GeckoTerminal | 256x256 | PNG | Transparent BG |
| Jupiter | 256x256 | PNG | Must be hosted online |
| Twitter Profile | 400x400 | PNG/JPG | Current: 🥩 |
| Twitter Banner | 1500x500 | PNG/JPG | Dark gradient + tagline |

**Current Logo Files:**
- `~/Projects/meatspace/marketing/profile-pic.png`
- `~/Projects/meatspace/marketing/profile-pic-v2.png`
- `~/Projects/meatspace/marketing/banner.png`

**Action:** Ensure logos are exported at all required sizes and hosted on a permanent CDN (IPFS, Arweave, or GitHub raw).

---

## 4️⃣ PRIORITY ACTION LIST

### Immediate (Today)
1. ✅ Verify auto-listings are live (DexScreener, GeckoTerminal, Birdeye)
2. 🔲 Host logo files on permanent CDN
3. 🔲 Update on-chain metadata if needed (Solscan verified)

### This Week
4. 🔲 Submit to Jupiter Token List (GitHub PR)
5. 🔲 Update GeckoTerminal token info (free)
6. 🔲 Consider DexScreener Enhanced Token Info ($299)
7. 🔲 Submit to Solana Ecosystem page

### When Eligible (Volume/Traction)
8. 🔲 Apply to CoinGecko (need consistent volume)
9. 🔲 Apply to CoinMarketCap (need CEX listing or high volume)
10. 🔲 Submit to AI agent directories

### Hackathon-Related
11. 🔲 Ensure hackathon submission is complete
12. 🔲 Prepare for showcase/demo day visibility

---

## 5️⃣ TRACKING LINKS

**Live Tracking (Bookmark These):**
- DexScreener: https://dexscreener.com/solana/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
- GeckoTerminal: https://www.geckoterminal.com/solana/pools/Cx459McvFKm1D83ezs9kyLaYWgpheUab8ub9EL1VDMjJ
- Birdeye: https://birdeye.so/token/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
- Solscan: https://solscan.io/token/H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy
- Raydium: https://raydium.io/launchpad/token/?mint=H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy

---

*Last updated: 2026-02-03*
*Built for Solana AI Agent Hackathon 2026* 🥩
