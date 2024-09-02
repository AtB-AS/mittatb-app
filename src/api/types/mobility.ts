import {z} from 'zod';

export type ViolationsReportingInitQuery = {
  lng: string;
  lat: string;
};

export type ViolationsReportingProvider = {
  id?: number;
  name: string;
  image?: {
    type: string;
    base64: string;
  };
};

export type ParkingViolationType = {
  code: string;
  icon: string;
};

export type ViolationsReportingInitQueryResult = {
  providers: ViolationsReportingProvider[];
  violations: ParkingViolationType[];
};

export type ViolationsVehicleLookupQuery = {
  qr: string;
};

export type ViolationsVehicleLookupQueryResult = {
  provider_id: number;
  vehicle_id: string;
};

export type ViolationsReportQuery = {
  providerId: ViolationsReportingProvider['id'];
  longitude: number;
  latitude: number;
  image?: string; //base64 encoded image blob
  imageType?: string; // file name suffix;
  qr?: string;
  appId?: string; // Unique id identifying the customer
  violations?: ParkingViolationType['code'][];
  timestamp: string;
};

export type ViolationsReportQueryResult = {
  status: 'OK';
};

/** Note: The shared mobility types below come from the `mobility` and `entur-client` crates in the mobility service. */

const ShmoPricingSegmentSchema = z.object({
  start: z
    .number()
    .int()
    .describe(
      'The minute at which this segment rate starts being charged (inclusive)',
    ),
  end: z
    .number()
    .int()
    .optional()
    .nullable()
    .describe(
      'The minute at which the rate will no longer apply (exclusive). If not provided, the rate applies until the trip ends.',
    ),
  interval: z
    .number()
    .int()
    .describe(
      'Interval in minutes at which the rate of this segment is reapplied. An interval of 0 indicates the rate is only charged once.',
    ),
  rate: z
    .number()
    .describe(
      'Rate that is charged for each minute interval after the start. Can be a negative number, indicating a discount.',
    ),
});

const ShmoPricingPlanSchema = z.object({
  currency: z.string().describe('Currency in ISO 4217 code'),
  price: z.number().describe('Fare price in the specified currency'),
  perMinPricing: z
    .array(ShmoPricingSegmentSchema)
    .optional()
    .nullable()
    .describe('Array of pricing segments, optional'),
});

export enum ShmoBookingState {
  NOT_STARTED = 'NOT_STARTED',
  IN_USE = 'IN_USE',
  PAUSED = 'PAUSED',
  FINISHING = 'FINISHING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

// Inferring schema from enum instead of the other way around
// this allows the enums to be used directly
const ShmoBookingStateSchema = z.enum(
  Object.values(ShmoBookingState) as [ShmoBookingState, ...ShmoBookingState[]],
);

const ShmoPricingSchema = z.object({
  currentAmount: z.number(),
  finalAmount: z.number().optional().nullable(),
});

const ShmoOperatorSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ShmoBookingSchema = z.object({
  bookingId: z.string().uuid(),
  state: ShmoBookingStateSchema,
  orderId: z.string(),
  pricingPlan: ShmoPricingPlanSchema,
  departureTime: z.coerce.date().optional().nullable(),
  arrivalTime: z.coerce.date().optional().nullable(),
  operator: ShmoOperatorSchema,
  stateOfCharge: z.number().int().optional().nullable(),
  currentRangeKm: z.number().int().optional().nullable(),
  pricing: ShmoPricingSchema,
});

export type ShmoBooking = z.infer<typeof ShmoBookingSchema>;
