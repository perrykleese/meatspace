/**
 * Meatspace API
 * The unified interface for physical-world services
 */

import type {
  Address,
  Parcel,
  ShippingRequest,
  ShippingRate,
  Shipment,
  DeliveryRequest,
  Delivery,
  RideRequest,
  Ride,
  GigRequest,
  GigTask,
  RoutingStrategy,
  Priority,
  TaskCost,
  Money,
} from '../core/types';

import { ShippoAdapter, createShippoAdapter } from '../adapters/shipping/shippo';
import { routeShipping, routeDelivery, routeRide, routeGig } from '../core/router';

// ============================================
// CONFIGURATION
// ============================================

export interface MeatspaceConfig {
  // API Keys
  shippoApiKey?: string;
  doordashApiKey?: string;
  uberApiKey?: string;
  
  // Wallet for payments
  walletAddress?: string;
  
  // Default settings
  defaultRouting?: RoutingStrategy;
  testMode?: boolean;
}

// ============================================
// FEE CALCULATION
// ============================================

function calculateFee(serviceCost: number): TaskCost {
  // Fee tiers
  let feePercent: number;
  if (serviceCost < 50) {
    feePercent = 0.03;
  } else if (serviceCost < 500) {
    feePercent = 0.02;
  } else {
    feePercent = 0.015;
  }

  const fee = Math.max(serviceCost * feePercent, 0.25); // Min $0.25
  const total = serviceCost + fee;

  return {
    service_cost: { amount: serviceCost.toFixed(2), currency: 'USD' },
    meatspace_fee: { amount: fee.toFixed(2), currency: 'USD' },
    total: { amount: total.toFixed(2), currency: 'USD' },
    crypto_amount: total.toFixed(2),
    crypto_currency: 'USDC',
  };
}

// ============================================
// MEATSPACE CLIENT
// ============================================

export class Meatspace {
  private config: MeatspaceConfig;
  private shippoAdapter?: ShippoAdapter;

  constructor(config: MeatspaceConfig) {
    this.config = {
      defaultRouting: 'best_value',
      testMode: false,
      ...config,
    };

    // Initialize adapters
    if (config.shippoApiKey) {
      this.shippoAdapter = createShippoAdapter({
        apiKey: config.shippoApiKey,
        testMode: config.testMode,
      });
    }
  }

  // ============================================
  // SHIPPING
  // ============================================

  /**
   * Get shipping rates for a package
   */
  async rates(request: ShippingRequest): Promise<{
    shipment_id: string;
    rates: ShippingRate[];
    recommended: {
      cheapest: string;
      fastest: string;
      best_value: string;
    };
  }> {
    if (!this.shippoAdapter) {
      throw new Error('Shipping not configured. Provide shippoApiKey.');
    }

    const rates = await this.shippoAdapter.getRates(request);

    // Find recommendations
    const cheapest = routeShipping(rates, 'cheapest');
    const fastest = routeShipping(rates, 'fastest');
    const bestValue = routeShipping(rates, 'best_value');

    return {
      shipment_id: `shp_${Date.now()}`,
      rates,
      recommended: {
        cheapest: cheapest.selected.rate_id,
        fastest: fastest.selected.rate_id,
        best_value: bestValue.selected.rate_id,
      },
    };
  }

  /**
   * Ship a package with auto-routing
   */
  async ship(options: {
    from: Address | string;
    to: Address | string;
    parcel: Parcel | { weight: string; dimensions?: string };
    priority?: Priority;
    routing?: RoutingStrategy;
  }): Promise<{
    shipment_id: string;
    status: string;
    tracking_number: string;
    tracking_url: string;
    carrier: string;
    service: string;
    cost: TaskCost;
    label: {
      url: string;
      format: string;
    };
    estimated_delivery: string;
  }> {
    if (!this.shippoAdapter) {
      throw new Error('Shipping not configured. Provide shippoApiKey.');
    }

    // Parse addresses if strings
    const fromAddress = typeof options.from === 'string' 
      ? this.parseAddress(options.from)
      : options.from;
    
    const toAddress = typeof options.to === 'string'
      ? this.parseAddress(options.to)
      : options.to;

    // Parse parcel if shorthand
    const parcel = this.parseParcel(options.parcel);

    // Build request
    const request: ShippingRequest = {
      from: fromAddress,
      to: toAddress,
      parcel,
      priority: options.priority,
      routing: options.routing || this.config.defaultRouting,
    };

    // Get rates
    const rates = await this.shippoAdapter.getRates(request);

    if (rates.length === 0) {
      throw new Error('No shipping rates available for this route');
    }

    // Route to best option
    const routing = options.routing || this.config.defaultRouting || 'best_value';
    const result = routeShipping(rates, routing, options.priority);
    const selected = result.selected;

    // Purchase label
    const label = await this.shippoAdapter.purchaseLabel(selected.rate_id);

    // Calculate costs
    const cost = calculateFee(parseFloat(selected.amount.amount));

    // Calculate estimated delivery
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + selected.estimated_days);

    return {
      shipment_id: `shp_${Date.now()}`,
      status: 'purchased',
      tracking_number: label.tracking_number,
      tracking_url: label.tracking_url,
      carrier: label.carrier,
      service: label.service,
      cost,
      label: {
        url: label.label_url,
        format: label.label_format,
      },
      estimated_delivery: deliveryDate.toISOString().split('T')[0],
    };
  }

  /**
   * Purchase a label from an existing rate
   */
  async purchase(rate_id: string): Promise<{
    label_id: string;
    tracking_number: string;
    tracking_url: string;
    label_url: string;
    cost: TaskCost;
  }> {
    if (!this.shippoAdapter) {
      throw new Error('Shipping not configured.');
    }

    const label = await this.shippoAdapter.purchaseLabel(rate_id);

    // We'd need to look up the rate amount here
    // For now, return without cost calculation
    return {
      label_id: label.label_id,
      tracking_number: label.tracking_number,
      tracking_url: label.tracking_url,
      label_url: label.label_url,
      cost: calculateFee(0), // Would need rate lookup
    };
  }

  /**
   * Track a shipment
   */
  async track(shipment_id_or_tracking: string): Promise<{
    shipment_id?: string;
    tracking_number: string;
    carrier: string;
    status: string;
    status_detail: string;
    estimated_delivery?: string;
    tracking_history: Array<{
      status: string;
      message: string;
      timestamp: string;
      location?: string;
    }>;
  }> {
    if (!this.shippoAdapter) {
      throw new Error('Shipping not configured.');
    }

    const events = await this.shippoAdapter.trackShipment(shipment_id_or_tracking);

    const latest = events[events.length - 1];

    return {
      tracking_number: shipment_id_or_tracking,
      carrier: 'unknown', // Would need lookup
      status: latest?.status || 'unknown',
      status_detail: latest?.status_detail || '',
      tracking_history: events.map(e => ({
        status: e.status,
        message: e.status_detail,
        timestamp: e.timestamp,
        location: e.location,
      })),
    };
  }

  /**
   * Validate an address
   */
  async validateAddress(address: Address | string): Promise<{
    valid: boolean;
    suggested?: Address;
    messages: string[];
  }> {
    if (!this.shippoAdapter) {
      throw new Error('Shipping not configured.');
    }

    const addr = typeof address === 'string' ? this.parseAddress(address) : address;
    const validated = await this.shippoAdapter.validateAddress(addr);

    return {
      valid: validated.validated,
      suggested: validated,
      messages: [],
    };
  }

  // ============================================
  // DELIVERY (Placeholder - needs adapters)
  // ============================================

  async deliver(options: {
    from: Address | string;
    to: Address | string;
    item: string;
    deadline?: string;
    routing?: RoutingStrategy;
  }): Promise<Delivery> {
    throw new Error('Delivery adapters not yet implemented. Coming soon: DoorDash, Uber Direct');
  }

  // ============================================
  // RIDES (Placeholder - needs adapters)
  // ============================================

  async ride(options: {
    pickup: Address | string;
    dropoff: Address | string;
    passengers?: number;
    scheduled?: string;
    routing?: RoutingStrategy;
  }): Promise<Ride> {
    throw new Error('Ride adapters not yet implemented. Coming soon: Uber, Lyft, Waymo');
  }

  // ============================================
  // GIG WORK (Placeholder - needs adapters)
  // ============================================

  async task(options: {
    type: string;
    location?: Address | string;
    description: string;
    deadline?: string;
    budget_max?: number;
    routing?: RoutingStrategy;
  }): Promise<GigTask> {
    throw new Error('Gig adapters not yet implemented. Coming soon: TaskRabbit, MTurk');
  }

  // ============================================
  // HELPERS
  // ============================================

  private parseAddress(addressStr: string): Address {
    // Simple address parser
    // Format: "123 Main St, City, ST 12345" or "123 Main St, City ST 12345"
    
    const parts = addressStr.split(',').map(p => p.trim());
    
    if (parts.length < 2) {
      throw new Error(`Invalid address format: ${addressStr}`);
    }

    const street1 = parts[0];
    
    // Parse city, state, zip from remaining parts
    let city = '';
    let state = '';
    let zip = '';

    if (parts.length >= 3) {
      city = parts[1];
      // Last part might be "ST 12345" or just "12345"
      const stateZip = parts[parts.length - 1];
      const szMatch = stateZip.match(/([A-Z]{2})?\s*(\d{5}(-\d{4})?)?/i);
      if (szMatch) {
        state = szMatch[1]?.toUpperCase() || '';
        zip = szMatch[2] || '';
      }
    } else {
      // "City ST 12345"
      const cityStateZip = parts[1];
      const match = cityStateZip.match(/(.+?)\s+([A-Z]{2})\s+(\d{5}(-\d{4})?)/i);
      if (match) {
        city = match[1];
        state = match[2].toUpperCase();
        zip = match[3];
      } else {
        city = cityStateZip;
      }
    }

    return {
      street1,
      city,
      state,
      zip,
      country: 'US',
    };
  }

  private parseParcel(parcel: any): Parcel {
    if (parcel.length !== undefined) {
      // Already a proper Parcel object
      return parcel as Parcel;
    }

    // Parse shorthand: { weight: "5lb", dimensions: "12x8x6in" }
    let weight = 0;
    let mass_unit: 'lb' | 'kg' | 'oz' | 'g' = 'lb';
    let length = 10;
    let width = 8;
    let height = 6;
    let distance_unit: 'in' | 'cm' = 'in';

    if (parcel.weight) {
      const weightMatch = parcel.weight.match(/(\d+(?:\.\d+)?)\s*(lb|kg|oz|g)/i);
      if (weightMatch) {
        weight = parseFloat(weightMatch[1]);
        mass_unit = weightMatch[2].toLowerCase() as any;
      }
    }

    if (parcel.dimensions) {
      const dimMatch = parcel.dimensions.match(/(\d+)x(\d+)x(\d+)\s*(in|cm)?/i);
      if (dimMatch) {
        length = parseInt(dimMatch[1]);
        width = parseInt(dimMatch[2]);
        height = parseInt(dimMatch[3]);
        distance_unit = (dimMatch[4]?.toLowerCase() || 'in') as any;
      }
    }

    return {
      length,
      width,
      height,
      distance_unit,
      weight,
      mass_unit,
    };
  }
}

// ============================================
// FACTORY
// ============================================

export function createMeatspace(config: MeatspaceConfig): Meatspace {
  return new Meatspace(config);
}

// Default export
export default Meatspace;
