import {z} from 'zod';

const FareContractSchema = z.object({
  fareContractId: z.string(),
});

const TokenSchema = z.object({
  tokenId: z.string(),
});

const OrderSchema = z.object({
  orderId: z.string(),
});

const VehicleSchema = z.object({
  vehicleId: z.number().int().nonnegative(),
  longitude: z.number(),
  latitude: z.number(),
});

export enum EventKind {
  FARE_CONTRACT = 'FARE_CONTRACT',
  ORDER = 'ORDER',
  PROFILE = 'PROFILE',
  TOKEN = 'TOKEN',
  VEHICLE = 'VEHICLE',
}

export const StreamEventSchema = z.discriminatedUnion('event', [
  z
    .object({
      event: z.literal(EventKind.FARE_CONTRACT),
    })
    .merge(FareContractSchema),

  z
    .object({
      event: z.literal(EventKind.ORDER),
    })
    .merge(OrderSchema),

  z.object({
    event: z.literal(EventKind.PROFILE),
  }),

  z
    .object({
      event: z.literal(EventKind.TOKEN),
    })
    .merge(TokenSchema),

  z
    .object({
      event: z.literal(EventKind.VEHICLE),
    })
    .merge(VehicleSchema),
]);

export type StreamEvent = z.infer<typeof StreamEventSchema>;
