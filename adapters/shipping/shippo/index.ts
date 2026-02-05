/**
 * Shippo Shipping Adapter
 * Integrates with Shippo API for 85+ carrier access
 * 
 * Docs: https://docs.goshippo.com
 */

import type {
  Address,
  ValidatedAddress,
  ShippingRequest,
  ShippingRate,
  ShippingLabel,
  ShippingAdapter,
  TrackingEvent,
} from '../../../core/types';

const SHIPPO_BASE_URL = 'https://api.goshippo.com';

export interface ShippoConfig {
  apiKey: string;
  testMode?: boolean;
}

export class ShippoAdapter implements ShippingAdapter {
  name = 'shippo';
  type = 'shipping' as const;
  
  private apiKey: string;
  private testMode: boolean;

  constructor(config: ShippoConfig) {
    this.apiKey = config.apiKey;
    this.testMode = config.testMode ?? false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${SHIPPO_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `ShippoToken ${this.apiKey}`,
        'Content-Type': 'application/json',
        'SHIPPO-API-VERSION': '2018-02-08',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Shippo API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/addresses/?results=1');
      return true;
    } catch {
      return false;
    }
  }

  // ============================================
  // ADDRESS VALIDATION
  // ============================================

  async validateAddress(address: Address): Promise<ValidatedAddress> {
    interface ShippoAddressResponse {
      object_id: string;
      is_complete: boolean;
      validation_results: {
        is_valid: boolean;
        messages: Array<{
          code: string;
          text: string;
          type: string;
        }>;
      };
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      latitude?: number;
      longitude?: number;
    }

    const shippoAddress = await this.request<ShippoAddressResponse>('/addresses/', {
      method: 'POST',
      body: JSON.stringify({
        name: address.name,
        company: address.company,
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        phone: address.phone,
        email: address.email,
        is_residential: address.is_residential,
        validate: true,
      }),
    });

    return {
      ...address,
      street1: shippoAddress.street1,
      city: shippoAddress.city,
      state: shippoAddress.state,
      zip: shippoAddress.zip,
      validated: shippoAddress.validation_results?.is_valid ?? shippoAddress.is_complete,
      latitude: shippoAddress.latitude,
      longitude: shippoAddress.longitude,
    };
  }

  // ============================================
  // RATES
  // ============================================

  async getRates(request: ShippingRequest): Promise<ShippingRate[]> {
    interface ShippoShipmentResponse {
      object_id: string;
      status: string;
      rates: Array<{
        object_id: string;
        provider: string;
        servicelevel: {
          name: string;
          token: string;
        };
        amount: string;
        currency: string;
        estimated_days: number;
        arrives_by?: string;
        duration_terms?: string;
      }>;
    }

    // Create shipment to get rates
    const shipment = await this.request<ShippoShipmentResponse>('/shipments/', {
      method: 'POST',
      body: JSON.stringify({
        address_from: this.toShippoAddress(request.from),
        address_to: this.toShippoAddress(request.to),
        parcels: [this.toShippoParcel(request.parcel)],
        async: false,  // Wait for rates
        carrier_accounts: request.carrier_preference,
        extra: {
          signature_confirmation: request.signature_required ? 'STANDARD' : undefined,
          insurance: request.insurance ? {
            amount: request.parcel.value?.amount,
            currency: request.parcel.value?.currency || 'USD',
          } : undefined,
        },
      }),
    });

    // Convert Shippo rates to our format
    return shipment.rates.map(rate => ({
      rate_id: rate.object_id,
      provider: 'shippo',
      carrier: rate.provider.toLowerCase(),
      service: rate.servicelevel.name,
      amount: {
        amount: rate.amount,
        currency: 'USD' as const,
      },
      estimated_days: rate.estimated_days,
      arrives_by: rate.arrives_by,
      guaranteed: rate.duration_terms?.includes('guaranteed') ?? false,
    }));
  }

  // ============================================
  // PURCHASE LABEL
  // ============================================

  async purchaseLabel(rate_id: string): Promise<ShippingLabel> {
    interface ShippoTransactionResponse {
      object_id: string;
      status: string;
      tracking_number: string;
      tracking_url_provider: string;
      label_url: string;
      rate: {
        provider: string;
        servicelevel: {
          name: string;
        };
      };
    }

    const transaction = await this.request<ShippoTransactionResponse>('/transactions/', {
      method: 'POST',
      body: JSON.stringify({
        rate: rate_id,
        label_file_type: 'PDF',
        async: false,
      }),
    });

    if (transaction.status !== 'SUCCESS') {
      throw new Error(`Label purchase failed: ${transaction.status}`);
    }

    return {
      label_id: transaction.object_id,
      tracking_number: transaction.tracking_number,
      tracking_url: transaction.tracking_url_provider,
      label_url: transaction.label_url,
      label_format: 'PDF',
      carrier: transaction.rate.provider.toLowerCase(),
      service: transaction.rate.servicelevel.name,
    };
  }

  // ============================================
  // TRACKING
  // ============================================

  async trackShipment(tracking_number: string, carrier?: string): Promise<TrackingEvent[]> {
    interface ShippoTrackingResponse {
      tracking_status: {
        status: string;
        status_details: string;
        status_date: string;
        location?: {
          city: string;
          state: string;
          country: string;
        };
      };
      tracking_history: Array<{
        status: string;
        status_details: string;
        status_date: string;
        location?: {
          city: string;
          state: string;
          country: string;
        };
      }>;
    }

    const tracking = await this.request<ShippoTrackingResponse>(
      `/tracks/${carrier || 'usps'}/${tracking_number}`
    );

    return tracking.tracking_history.map(event => ({
      status: this.mapTrackingStatus(event.status),
      status_detail: event.status_details,
      timestamp: event.status_date,
      location: event.location 
        ? `${event.location.city}, ${event.location.state}` 
        : undefined,
      carrier_status: event.status,
    }));
  }

  // ============================================
  // REFUND
  // ============================================

  async refundLabel(label_id: string): Promise<boolean> {
    interface ShippoRefundResponse {
      object_id: string;
      status: string;
    }

    const refund = await this.request<ShippoRefundResponse>('/refunds/', {
      method: 'POST',
      body: JSON.stringify({
        transaction: label_id,
      }),
    });

    return refund.status === 'QUEUED' || refund.status === 'SUCCESS';
  }

  // ============================================
  // HELPERS
  // ============================================

  private toShippoAddress(address: Address) {
    return {
      name: address.name,
      company: address.company,
      street1: address.street1,
      street2: address.street2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
      email: address.email,
      is_residential: address.is_residential,
    };
  }

  private toShippoParcel(parcel: any) {
    return {
      length: String(parcel.length),
      width: String(parcel.width),
      height: String(parcel.height),
      distance_unit: parcel.distance_unit || 'in',
      weight: String(parcel.weight),
      mass_unit: parcel.mass_unit || 'lb',
    };
  }

  private mapTrackingStatus(shippoStatus: string): string {
    const statusMap: Record<string, string> = {
      'PRE_TRANSIT': 'pre_transit',
      'TRANSIT': 'in_transit',
      'DELIVERED': 'delivered',
      'RETURNED': 'returned',
      'FAILURE': 'failed',
      'UNKNOWN': 'unknown',
    };
    return statusMap[shippoStatus] || 'unknown';
  }
}

// Factory function
export function createShippoAdapter(config: ShippoConfig): ShippoAdapter {
  return new ShippoAdapter(config);
}
