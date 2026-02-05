/**
 * Meatspace Core Types
 * The type system for the physical world DEX
 */

// ============================================
// ADDRESS
// ============================================

export interface Address {
  name?: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
  is_residential?: boolean;
}

export interface ValidatedAddress extends Address {
  validated: boolean;
  latitude?: number;
  longitude?: number;
}

// ============================================
// PARCEL
// ============================================

export interface Parcel {
  length: number;
  width: number;
  height: number;
  distance_unit: 'in' | 'cm';
  weight: number;
  mass_unit: 'lb' | 'kg' | 'oz' | 'g';
  description?: string;
  value?: Money;
}

// ============================================
// MONEY
// ============================================

export interface Money {
  amount: string;
  currency: 'USD' | 'USDC' | 'SOL';
}

// ============================================
// TASK TYPES
// ============================================

export type TaskType = 'shipping' | 'delivery' | 'ride' | 'gig';

export type TaskStatus = 
  | 'pending'      // Created, not yet routed
  | 'quoted'       // Rates received, awaiting selection
  | 'purchased'    // Paid, executing
  | 'in_progress'  // Being fulfilled
  | 'completed'    // Successfully done
  | 'failed'       // Failed
  | 'cancelled';   // Cancelled by agent

export type Priority = 'economy' | 'standard' | 'express' | 'overnight' | 'same_day';

export type RoutingStrategy = 'cheapest' | 'fastest' | 'best_value' | 'most_reliable';

// ============================================
// SHIPPING
// ============================================

export interface ShippingRequest {
  from: Address;
  to: Address;
  parcel: Parcel;
  priority?: Priority;
  routing?: RoutingStrategy;
  carrier_preference?: string[];
  insurance?: boolean;
  signature_required?: boolean;
  metadata?: Record<string, string>;
}

export interface ShippingRate {
  rate_id: string;
  provider: string;
  carrier: string;
  service: string;
  amount: Money;
  estimated_days: number;
  arrives_by?: string;
  guaranteed?: boolean;
}

export interface ShippingLabel {
  label_id: string;
  tracking_number: string;
  tracking_url: string;
  label_url: string;
  label_format: 'PDF' | 'PNG' | 'ZPL';
  carrier: string;
  service: string;
}

export interface Shipment {
  id: string;
  type: 'shipping';
  status: TaskStatus;
  request: ShippingRequest;
  rates?: ShippingRate[];
  selected_rate?: ShippingRate;
  label?: ShippingLabel;
  tracking?: TrackingEvent[];
  cost?: TaskCost;
  created_at: string;
  updated_at: string;
}

// ============================================
// DELIVERY (Same-Day Local)
// ============================================

export interface DeliveryRequest {
  from: Address;
  to: Address;
  item_description: string;
  item_value?: Money;
  deadline?: string;  // ISO timestamp
  priority?: Priority;
  routing?: RoutingStrategy;
  special_instructions?: string;
}

export interface DeliveryQuote {
  quote_id: string;
  provider: string;
  service: string;
  amount: Money;
  pickup_eta: string;
  delivery_eta: string;
  distance_miles: number;
}

export interface Delivery {
  id: string;
  type: 'delivery';
  status: TaskStatus;
  request: DeliveryRequest;
  quotes?: DeliveryQuote[];
  selected_quote?: DeliveryQuote;
  tracking?: TrackingEvent[];
  cost?: TaskCost;
  created_at: string;
  updated_at: string;
}

// ============================================
// RIDES
// ============================================

export interface RideRequest {
  pickup: Address;
  dropoff: Address;
  passengers: number;
  scheduled_time?: string;  // ISO timestamp, or null for ASAP
  ride_type?: 'standard' | 'premium' | 'xl' | 'autonomous';
  routing?: RoutingStrategy;
}

export interface RideQuote {
  quote_id: string;
  provider: string;
  service: string;
  amount: Money;
  pickup_eta: string;
  trip_duration_minutes: number;
  distance_miles: number;
  surge_multiplier?: number;
}

export interface Ride {
  id: string;
  type: 'ride';
  status: TaskStatus;
  request: RideRequest;
  quotes?: RideQuote[];
  selected_quote?: RideQuote;
  driver?: {
    name: string;
    rating: number;
    vehicle: string;
    license_plate: string;
  };
  tracking?: TrackingEvent[];
  cost?: TaskCost;
  created_at: string;
  updated_at: string;
}

// ============================================
// GIG WORK
// ============================================

export interface GigRequest {
  task_type: string;  // 'photography', 'cleaning', 'handyman', 'data_entry', etc.
  location?: Address;
  description: string;
  deadline?: string;
  budget_max?: Money;
  requirements?: string[];
  deliverables?: string[];
}

export interface GigQuote {
  quote_id: string;
  provider: string;
  worker_type: 'human' | 'crowd';  // Individual vs MTurk-style
  amount: Money;
  estimated_duration: string;
  worker_rating?: number;
}

export interface GigTask {
  id: string;
  type: 'gig';
  status: TaskStatus;
  request: GigRequest;
  quotes?: GigQuote[];
  selected_quote?: GigQuote;
  result?: {
    completed_at: string;
    deliverables: string[];
    notes?: string;
  };
  cost?: TaskCost;
  created_at: string;
  updated_at: string;
}

// ============================================
// TRACKING
// ============================================

export interface TrackingEvent {
  status: string;
  status_detail: string;
  timestamp: string;
  location?: string;
  carrier_status?: string;
}

// ============================================
// COST
// ============================================

export interface TaskCost {
  service_cost: Money;
  meatspace_fee: Money;
  total: Money;
  crypto_amount?: string;
  crypto_currency?: 'USDC' | 'SOL';
  tx_signature?: string;
}

// ============================================
// AGENT
// ============================================

export interface Agent {
  id: string;
  wallet_address: string;
  name?: string;
  default_from_address?: Address;
  created_at: string;
  stats: {
    total_tasks: number;
    completed_tasks: number;
    total_spent: Money;
    reputation_score: number;
  };
}

// ============================================
// ADAPTER INTERFACE
// ============================================

export interface Adapter {
  name: string;
  type: TaskType;
  
  // Health check
  healthCheck(): Promise<boolean>;
}

export interface ShippingAdapter extends Adapter {
  type: 'shipping';
  
  validateAddress(address: Address): Promise<ValidatedAddress>;
  getRates(request: ShippingRequest): Promise<ShippingRate[]>;
  purchaseLabel(rate_id: string): Promise<ShippingLabel>;
  trackShipment(tracking_number: string): Promise<TrackingEvent[]>;
  refundLabel?(label_id: string): Promise<boolean>;
}

export interface DeliveryAdapter extends Adapter {
  type: 'delivery';
  
  getQuotes(request: DeliveryRequest): Promise<DeliveryQuote[]>;
  createDelivery(quote_id: string): Promise<Delivery>;
  trackDelivery(delivery_id: string): Promise<TrackingEvent[]>;
  cancelDelivery?(delivery_id: string): Promise<boolean>;
}

export interface RideAdapter extends Adapter {
  type: 'ride';
  
  getQuotes(request: RideRequest): Promise<RideQuote[]>;
  requestRide(quote_id: string): Promise<Ride>;
  trackRide(ride_id: string): Promise<TrackingEvent[]>;
  cancelRide?(ride_id: string): Promise<boolean>;
}

export interface GigAdapter extends Adapter {
  type: 'gig';
  
  getQuotes(request: GigRequest): Promise<GigQuote[]>;
  createTask(quote_id: string): Promise<GigTask>;
  getTaskStatus(task_id: string): Promise<GigTask>;
  cancelTask?(task_id: string): Promise<boolean>;
}

// ============================================
// ROUTER
// ============================================

export interface RouterConfig {
  default_routing: RoutingStrategy;
  shipping_adapters: string[];
  delivery_adapters: string[];
  ride_adapters: string[];
  gig_adapters: string[];
}

export interface RouteResult<T> {
  selected: T;
  alternatives: T[];
  routing_strategy: RoutingStrategy;
  reason: string;
}
