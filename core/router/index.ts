/**
 * Meatspace Router
 * Routes requests to the best adapter based on routing strategy
 */

import type {
  ShippingRate,
  DeliveryQuote,
  RideQuote,
  GigQuote,
  RoutingStrategy,
  RouteResult,
  Priority,
} from '../types';

// ============================================
// ROUTING WEIGHTS
// ============================================

interface RoutingWeights {
  cost: number;
  speed: number;
  reliability: number;
}

const STRATEGY_WEIGHTS: Record<RoutingStrategy, RoutingWeights> = {
  cheapest: { cost: 0.8, speed: 0.1, reliability: 0.1 },
  fastest: { cost: 0.1, speed: 0.8, reliability: 0.1 },
  best_value: { cost: 0.4, speed: 0.3, reliability: 0.3 },
  most_reliable: { cost: 0.1, speed: 0.2, reliability: 0.7 },
};

// Carrier reliability scores (0-1, higher is better)
const CARRIER_RELIABILITY: Record<string, number> = {
  usps: 0.85,
  fedex: 0.95,
  ups: 0.93,
  dhl: 0.90,
  // Delivery
  doordash: 0.88,
  uber: 0.90,
  dolly: 0.85,
  // Rides
  waymo: 0.98,  // Autonomous
  lyft: 0.89,
};

// ============================================
// SHIPPING ROUTER
// ============================================

export function routeShipping(
  rates: ShippingRate[],
  strategy: RoutingStrategy = 'best_value',
  priority?: Priority
): RouteResult<ShippingRate> {
  if (rates.length === 0) {
    throw new Error('No shipping rates available');
  }

  // Filter by priority if specified
  let filtered = rates;
  if (priority) {
    filtered = filterByPriority(rates, priority);
    if (filtered.length === 0) {
      // Fall back to all rates if none match priority
      filtered = rates;
    }
  }

  // Score each rate
  const scored = filtered.map(rate => ({
    rate,
    score: scoreShippingRate(rate, strategy, filtered),
  }));

  // Sort by score (lower is better)
  scored.sort((a, b) => a.score - b.score);

  const selected = scored[0].rate;
  const alternatives = scored.slice(1, 4).map(s => s.rate);

  return {
    selected,
    alternatives,
    routing_strategy: strategy,
    reason: generateShippingReason(selected, strategy),
  };
}

function filterByPriority(rates: ShippingRate[], priority: Priority): ShippingRate[] {
  const maxDays: Record<Priority, number> = {
    economy: 999,
    standard: 7,
    express: 3,
    overnight: 1,
    same_day: 0,
  };

  return rates.filter(r => r.estimated_days <= maxDays[priority]);
}

function scoreShippingRate(
  rate: ShippingRate,
  strategy: RoutingStrategy,
  allRates: ShippingRate[]
): number {
  const weights = STRATEGY_WEIGHTS[strategy];

  // Normalize values to 0-1 scale
  const maxCost = Math.max(...allRates.map(r => parseFloat(r.amount.amount)));
  const maxDays = Math.max(...allRates.map(r => r.estimated_days));

  const costScore = parseFloat(rate.amount.amount) / maxCost;
  const speedScore = rate.estimated_days / maxDays;
  const reliabilityScore = 1 - (CARRIER_RELIABILITY[rate.carrier] || 0.8);

  return (
    costScore * weights.cost +
    speedScore * weights.speed +
    reliabilityScore * weights.reliability
  );
}

function generateShippingReason(rate: ShippingRate, strategy: RoutingStrategy): string {
  switch (strategy) {
    case 'cheapest':
      return `Lowest cost at $${rate.amount.amount} via ${rate.carrier.toUpperCase()} ${rate.service}`;
    case 'fastest':
      return `Fastest delivery in ${rate.estimated_days} day(s) via ${rate.carrier.toUpperCase()} ${rate.service}`;
    case 'best_value':
      return `Best value: $${rate.amount.amount} in ${rate.estimated_days} day(s) via ${rate.carrier.toUpperCase()}`;
    case 'most_reliable':
      return `Most reliable carrier: ${rate.carrier.toUpperCase()} ${rate.service}`;
    default:
      return `Selected ${rate.carrier.toUpperCase()} ${rate.service}`;
  }
}

// ============================================
// DELIVERY ROUTER
// ============================================

export function routeDelivery(
  quotes: DeliveryQuote[],
  strategy: RoutingStrategy = 'best_value',
  deadline?: Date
): RouteResult<DeliveryQuote> {
  if (quotes.length === 0) {
    throw new Error('No delivery quotes available');
  }

  // Filter by deadline if specified
  let filtered = quotes;
  if (deadline) {
    filtered = quotes.filter(q => new Date(q.delivery_eta) <= deadline);
    if (filtered.length === 0) {
      filtered = quotes;
    }
  }

  // Score each quote
  const scored = filtered.map(quote => ({
    quote,
    score: scoreDeliveryQuote(quote, strategy, filtered),
  }));

  scored.sort((a, b) => a.score - b.score);

  const selected = scored[0].quote;
  const alternatives = scored.slice(1, 4).map(s => s.quote);

  return {
    selected,
    alternatives,
    routing_strategy: strategy,
    reason: generateDeliveryReason(selected, strategy),
  };
}

function scoreDeliveryQuote(
  quote: DeliveryQuote,
  strategy: RoutingStrategy,
  allQuotes: DeliveryQuote[]
): number {
  const weights = STRATEGY_WEIGHTS[strategy];

  const maxCost = Math.max(...allQuotes.map(q => parseFloat(q.amount.amount)));
  
  // Calculate minutes until delivery
  const etaMinutes = (new Date(quote.delivery_eta).getTime() - Date.now()) / 60000;
  const maxEta = Math.max(...allQuotes.map(q => 
    (new Date(q.delivery_eta).getTime() - Date.now()) / 60000
  ));

  const costScore = parseFloat(quote.amount.amount) / maxCost;
  const speedScore = etaMinutes / maxEta;
  const reliabilityScore = 1 - (CARRIER_RELIABILITY[quote.provider] || 0.8);

  return (
    costScore * weights.cost +
    speedScore * weights.speed +
    reliabilityScore * weights.reliability
  );
}

function generateDeliveryReason(quote: DeliveryQuote, strategy: RoutingStrategy): string {
  const eta = new Date(quote.delivery_eta);
  const etaStr = eta.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  switch (strategy) {
    case 'cheapest':
      return `Lowest cost at $${quote.amount.amount} via ${quote.provider}`;
    case 'fastest':
      return `Fastest delivery by ${etaStr} via ${quote.provider}`;
    case 'best_value':
      return `Best value: $${quote.amount.amount}, arrives by ${etaStr} via ${quote.provider}`;
    case 'most_reliable':
      return `Most reliable: ${quote.provider}`;
    default:
      return `Selected ${quote.provider}`;
  }
}

// ============================================
// RIDE ROUTER
// ============================================

export function routeRide(
  quotes: RideQuote[],
  strategy: RoutingStrategy = 'best_value'
): RouteResult<RideQuote> {
  if (quotes.length === 0) {
    throw new Error('No ride quotes available');
  }

  const scored = quotes.map(quote => ({
    quote,
    score: scoreRideQuote(quote, strategy, quotes),
  }));

  scored.sort((a, b) => a.score - b.score);

  const selected = scored[0].quote;
  const alternatives = scored.slice(1, 4).map(s => s.quote);

  return {
    selected,
    alternatives,
    routing_strategy: strategy,
    reason: generateRideReason(selected, strategy),
  };
}

function scoreRideQuote(
  quote: RideQuote,
  strategy: RoutingStrategy,
  allQuotes: RideQuote[]
): number {
  const weights = STRATEGY_WEIGHTS[strategy];

  const maxCost = Math.max(...allQuotes.map(q => parseFloat(q.amount.amount)));
  const maxEta = Math.max(...allQuotes.map(q => 
    (new Date(q.pickup_eta).getTime() - Date.now()) / 60000
  ));

  const costScore = parseFloat(quote.amount.amount) / maxCost;
  const pickupMinutes = (new Date(quote.pickup_eta).getTime() - Date.now()) / 60000;
  const speedScore = pickupMinutes / maxEta;
  
  // Autonomous vehicles get reliability boost
  const isAutonomous = quote.provider === 'waymo';
  const reliabilityScore = 1 - (isAutonomous ? 0.98 : (CARRIER_RELIABILITY[quote.provider] || 0.85));

  return (
    costScore * weights.cost +
    speedScore * weights.speed +
    reliabilityScore * weights.reliability
  );
}

function generateRideReason(quote: RideQuote, strategy: RoutingStrategy): string {
  const pickupStr = new Date(quote.pickup_eta).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  switch (strategy) {
    case 'cheapest':
      return `Lowest fare at $${quote.amount.amount} via ${quote.provider}`;
    case 'fastest':
      return `Fastest pickup at ${pickupStr} via ${quote.provider}`;
    case 'best_value':
      return `Best value: $${quote.amount.amount}, pickup at ${pickupStr} via ${quote.provider}`;
    case 'most_reliable':
      return `Most reliable: ${quote.provider} ${quote.service}`;
    default:
      return `Selected ${quote.provider}`;
  }
}

// ============================================
// GIG WORK ROUTER
// ============================================

export function routeGig(
  quotes: GigQuote[],
  strategy: RoutingStrategy = 'best_value'
): RouteResult<GigQuote> {
  if (quotes.length === 0) {
    throw new Error('No gig quotes available');
  }

  const scored = quotes.map(quote => ({
    quote,
    score: scoreGigQuote(quote, strategy, quotes),
  }));

  scored.sort((a, b) => a.score - b.score);

  const selected = scored[0].quote;
  const alternatives = scored.slice(1, 4).map(s => s.quote);

  return {
    selected,
    alternatives,
    routing_strategy: strategy,
    reason: `Selected ${selected.provider} for ${selected.estimated_duration}`,
  };
}

function scoreGigQuote(
  quote: GigQuote,
  strategy: RoutingStrategy,
  allQuotes: GigQuote[]
): number {
  const weights = STRATEGY_WEIGHTS[strategy];

  const maxCost = Math.max(...allQuotes.map(q => parseFloat(q.amount.amount)));
  const costScore = parseFloat(quote.amount.amount) / maxCost;

  // Parse duration (e.g., "2 hours" -> 120 minutes)
  const durationMatch = quote.estimated_duration.match(/(\d+)\s*(hour|minute|day)/i);
  let minutes = 60; // default
  if (durationMatch) {
    const [, num, unit] = durationMatch;
    const multiplier = unit.toLowerCase().startsWith('hour') ? 60 
      : unit.toLowerCase().startsWith('day') ? 1440 
      : 1;
    minutes = parseInt(num) * multiplier;
  }

  const maxDuration = Math.max(...allQuotes.map(q => {
    const m = q.estimated_duration.match(/(\d+)\s*(hour|minute|day)/i);
    if (!m) return 60;
    const mult = m[2].toLowerCase().startsWith('hour') ? 60 
      : m[2].toLowerCase().startsWith('day') ? 1440 
      : 1;
    return parseInt(m[1]) * mult;
  }));

  const speedScore = minutes / maxDuration;
  const reliabilityScore = 1 - (quote.worker_rating || 0.8);

  return (
    costScore * weights.cost +
    speedScore * weights.speed +
    reliabilityScore * weights.reliability
  );
}

// ============================================
// UNIFIED ROUTER
// ============================================

export type AnyQuote = ShippingRate | DeliveryQuote | RideQuote | GigQuote;

export function route<T extends AnyQuote>(
  quotes: T[],
  strategy: RoutingStrategy = 'best_value',
  type: 'shipping' | 'delivery' | 'ride' | 'gig'
): RouteResult<T> {
  switch (type) {
    case 'shipping':
      return routeShipping(quotes as ShippingRate[], strategy) as RouteResult<T>;
    case 'delivery':
      return routeDelivery(quotes as DeliveryQuote[], strategy) as RouteResult<T>;
    case 'ride':
      return routeRide(quotes as RideQuote[], strategy) as RouteResult<T>;
    case 'gig':
      return routeGig(quotes as GigQuote[], strategy) as RouteResult<T>;
    default:
      throw new Error(`Unknown task type: ${type}`);
  }
}
