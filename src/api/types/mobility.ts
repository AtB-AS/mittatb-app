import {z} from 'zod';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Feature, Point} from 'geojson';

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

const longitude = z
  .number()
  .min(-180, {message: 'longitude must be greater than or equal to -180'})
  .max(180, {message: 'longitude must be less than or equal to 180'});
const latitude = z
  .number()
  .min(-90, {message: 'latitude must be greater than or equal to -90'})
  .max(90, {message: 'latitude must be less than or equal to 90'});

const ShmoCoordinatesSchema = z.object({
  longitude,
  latitude,
  altitude: z.number().optional().nullable(),
});

const InitShmoOneStopBookingRequestBodySchema = z.object({
  recurringPaymentId: z.number().int(),
  coordinates: ShmoCoordinatesSchema,
  assetId: z
    .string()
    .optional()
    .describe('This is the same id as vehicleId from the mobility API'),
});

export type InitShmoOneStopBookingRequestBody = z.infer<
  typeof InitShmoOneStopBookingRequestBodySchema
>;

export enum ShmoBookingEventType {
  START_FINISHING = 'START_FINISHING',
  FINISH = 'FINISH',
}

const ShmoImageFileSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileData: z.string().describe('base64 encoded image data'),
});

type StartFinishingEvent = {event: ShmoBookingEventType.START_FINISHING};
type FinishEvent = {
  event: ShmoBookingEventType.FINISH;
} & z.infer<typeof ShmoImageFileSchema>;

export type ShmoBookingEvent = StartFinishingEvent | FinishEvent;

const FormFactorSchema = z.enum(
  Object.values(FormFactor) as [FormFactor, ...FormFactor[]],
);

export const IdsFromQrCodeResponseSchema = z.object({
  operatorId: z.string(),
  vehicleId: z.string().nullable().optional(),
  stationId: z.string().nullable().optional(),
  formFactor: FormFactorSchema.nullable().optional(),
});

export type IdsFromQrCodeResponse = z.infer<typeof IdsFromQrCodeResponseSchema>;

export const IdsFromQrCodeQuerySchema = z.object({
  qrCodeUrl: z
    .string()
    .min(1, {message: 'qrCodeUrl must be at least 1 character long'}),
  longitude,
  latitude,
});

export type IdsFromQrCodeQuery = z.infer<typeof IdsFromQrCodeQuerySchema>;

const GeoJsonCoordinatesSchema = z.union([
  z.tuple([longitude, latitude]), // lon, lat
  z.tuple([longitude, latitude, z.number()]), // lon, lat, altitude
]);

const GeoJsonFeatureWithPointGeometrySchema = z.object({
  type: z.literal('Feature'),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: GeoJsonCoordinatesSchema,
  }),
  // properties placeholder — empty object by default
  properties: z.object({}).passthrough(),
}) satisfies z.ZodType<Feature<Point>>;

// See martin.yaml -> stations, in the tile server
export const StationFeatureSchema =
  GeoJsonFeatureWithPointGeometrySchema.extend({
    properties: z.object({
      id: z.string(),
      system_id: z.string(),
      vehicle_type_form_factor: FormFactorSchema,
      num_vehicles_available: z.number(),
      capacity: z.number(),
      is_virtual_station: z.boolean(),
    }),
  }) satisfies z.ZodType<Feature<Point>>;
export type StationFeature = z.infer<typeof StationFeatureSchema>;

export const ClusterOfVehiclesPropertiesSchema = z
  .object({
    count: z.number(),
    vehicle_type_form_factor: FormFactorSchema,
  })
  .strict(); // don't allow any other props, in order to avoid matching with VehiclePropertiesSchema
export type ClusterOfVehiclesProperties = z.infer<
  typeof ClusterOfVehiclesPropertiesSchema
>;

export const VehiclePropertiesSchema = z.object({
  id: z.string(),
  system_id: z.string(),
  count: z.number(),
  vehicle_type_form_factor: FormFactorSchema,
});

export const VehicleFeatureSchema =
  GeoJsonFeatureWithPointGeometrySchema.extend({
    properties: VehiclePropertiesSchema,
  }) satisfies z.ZodType<Feature<Point>>;
export type VehicleFeature = z.infer<typeof VehicleFeatureSchema>;

// This should match the output of the vehicles_clustered postgres function,
// which can be found in schema.sql in the mobility service.
export const VehiclesClusteredFeatureSchema =
  GeoJsonFeatureWithPointGeometrySchema.extend({
    properties: z.union([
      VehiclePropertiesSchema,
      ClusterOfVehiclesPropertiesSchema,
    ]),
  }) satisfies z.ZodType<Feature<Point>>;
export type VehiclesClusteredFeature = z.infer<
  typeof VehiclesClusteredFeatureSchema
>;
