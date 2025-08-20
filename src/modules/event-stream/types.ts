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
  FareContract = 'FARE_CONTRACT',
  Order = 'ORDER',
  Profile = 'PROFILE',
  Token = 'TOKEN',
  Vehicle = 'VEHICLE',
}

export const StreamEventSchema = z.discriminatedUnion('event', [
  z
    .object({
      event: z.literal(EventKind.FareContract),
    })
    .merge(FareContractSchema),

  z
    .object({
      event: z.literal(EventKind.Order),
    })
    .merge(OrderSchema),

  z.object({
    event: z.literal(EventKind.Profile),
  }),

  z
    .object({
      event: z.literal(EventKind.Token),
    })
    .merge(TokenSchema),

  z
    .object({
      event: z.literal(EventKind.Vehicle),
    })
    .merge(VehicleSchema),
]);

export type StreamEvent = z.infer<typeof StreamEventSchema>;
