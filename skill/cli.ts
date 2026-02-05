#!/usr/bin/env npx ts-node
/**
 * Meatspace CLI
 * Command-line interface for physical-world services
 */

import { Meatspace } from '../api/meatspace';

// ============================================
// CLI SETUP
// ============================================

const args = process.argv.slice(2);
const command = args[0];

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : 'true';
      result[key] = value;
    }
  }
  return result;
}

function getEnvConfig() {
  return {
    shippoApiKey: process.env.SHIPPO_API_KEY,
    walletAddress: process.env.MEATSPACE_WALLET,
    defaultRouting: (process.env.MEATSPACE_DEFAULT_ROUTING as any) || 'best_value',
    testMode: process.env.MEATSPACE_TEST_MODE === 'true',
  };
}

// ============================================
// COMMANDS
// ============================================

async function ship(opts: Record<string, string>) {
  const config = getEnvConfig();
  
  if (!config.shippoApiKey) {
    console.error('Error: SHIPPO_API_KEY not set');
    process.exit(1);
  }

  const meatspace = new Meatspace(config);

  try {
    const result = await meatspace.ship({
      from: opts.from,
      to: opts.to,
      parcel: {
        weight: opts.weight,
        dimensions: opts.dimensions,
      },
      priority: opts.priority as any,
      routing: opts.routing as any,
    });

    console.log('\n✅ SHIPMENT CREATED\n');
    console.log(`Tracking:  ${result.tracking_number}`);
    console.log(`Carrier:   ${result.carrier.toUpperCase()} ${result.service}`);
    console.log(`Cost:      $${result.cost.total.amount}`);
    console.log(`Est. Del:  ${result.estimated_delivery}`);
    console.log(`Label:     ${result.label.url}`);
    console.log(`Track URL: ${result.tracking_url}`);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function rates(opts: Record<string, string>) {
  const config = getEnvConfig();

  if (!config.shippoApiKey) {
    console.error('Error: SHIPPO_API_KEY not set');
    process.exit(1);
  }

  const meatspace = new Meatspace(config);

  try {
    const result = await meatspace.rates({
      from: meatspace['parseAddress'](opts.from),
      to: meatspace['parseAddress'](opts.to),
      parcel: meatspace['parseParcel']({
        weight: opts.weight,
        dimensions: opts.dimensions,
      }),
    });

    console.log('\n📦 SHIPPING RATES\n');
    console.log('CARRIER'.padEnd(15) + 'SERVICE'.padEnd(22) + 'PRICE'.padEnd(10) + 'DAYS');
    console.log('-'.repeat(55));

    for (const rate of result.rates) {
      const isRecommended = rate.rate_id === result.recommended.best_value;
      const marker = isRecommended ? ' ⭐' : '';
      console.log(
        rate.carrier.padEnd(15) +
        rate.service.padEnd(22) +
        ('$' + rate.amount.amount).padEnd(10) +
        rate.estimated_days +
        marker
      );
    }

    console.log('\n⭐ = Best Value Recommendation');
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function track(trackingNumber: string) {
  const config = getEnvConfig();

  if (!config.shippoApiKey) {
    console.error('Error: SHIPPO_API_KEY not set');
    process.exit(1);
  }

  const meatspace = new Meatspace(config);

  try {
    const result = await meatspace.track(trackingNumber);

    console.log('\n📍 TRACKING STATUS\n');
    console.log(`Status:   ${result.status.toUpperCase()}`);
    console.log(`Details:  ${result.status_detail}`);
    console.log(`Tracking: ${result.tracking_number}`);

    if (result.tracking_history.length > 0) {
      console.log('\nHISTORY:');
      for (const event of result.tracking_history.slice(-5)) {
        const date = new Date(event.timestamp).toLocaleString();
        const location = event.location ? ` (${event.location})` : '';
        console.log(`  ${date} - ${event.message}${location}`);
      }
    }
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function validate(opts: Record<string, string>) {
  const config = getEnvConfig();

  if (!config.shippoApiKey) {
    console.error('Error: SHIPPO_API_KEY not set');
    process.exit(1);
  }

  const meatspace = new Meatspace(config);
  const address = args.slice(1).filter(a => !a.startsWith('--')).join(' ') || opts.address;

  try {
    const result = await meatspace.validateAddress(address);

    console.log('\n🏠 ADDRESS VALIDATION\n');
    console.log(`Valid: ${result.valid ? '✅ Yes' : '❌ No'}`);

    if (result.suggested) {
      console.log('\nStandardized:');
      console.log(`  ${result.suggested.street1}`);
      if (result.suggested.street2) console.log(`  ${result.suggested.street2}`);
      console.log(`  ${result.suggested.city}, ${result.suggested.state} ${result.suggested.zip}`);
    }
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🥩 MEATSPACE - The Physical World DEX

USAGE:
  meatspace <command> [options]

COMMANDS:
  ship       Ship a package
  rates      Get shipping rate quotes
  track      Track a shipment
  validate   Validate an address
  deliver    Request same-day delivery (coming soon)
  ride       Book a ride (coming soon)
  task       Hire for physical task (coming soon)

EXAMPLES:
  meatspace ship --from "NYC 10001" --to "LA 90001" --weight "5lb"
  meatspace rates --from "NYC" --to "LA" --weight "5lb"
  meatspace track 9400111899223456789012
  meatspace validate "123 main st, new york ny 10001"

OPTIONS:
  --from         Origin address
  --to           Destination address
  --weight       Package weight (e.g., "5lb", "2kg")
  --dimensions   Package dimensions (e.g., "12x8x6in")
  --priority     economy|standard|express|overnight
  --routing      cheapest|fastest|best_value

ENVIRONMENT:
  SHIPPO_API_KEY         Shippo API key (required for shipping)
  MEATSPACE_WALLET       Wallet address for payments
  MEATSPACE_TEST_MODE    Set to "true" for test mode
`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const opts = parseArgs(args.slice(1));

  switch (command) {
    case 'ship':
      await ship(opts);
      break;
    case 'rates':
      await rates(opts);
      break;
    case 'track':
      await track(args[1]);
      break;
    case 'validate':
      await validate(opts);
      break;
    case 'deliver':
    case 'ride':
    case 'task':
      console.log(`\n🚧 ${command} command coming soon!`);
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch(console.error);
