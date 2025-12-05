import {z} from 'zod';

export enum EventKind {
  FareContract = 'FARE_CONTRACT',
  Order = 'ORDER',
  Profile = 'PROFILE',
  Token = 'TOKEN',
  Vehicle = 'VEHICLE',
  ShmoBookingUpdate = 'SHMO_BOOKING_UPDATE',
}

export const StreamEventSchema = z.discriminatedUnion('event', [
  z.object({
    event: z.literal(EventKind.FareContract),
    fareContractId: z.string(),
  }),
  z.object({
    event: z.literal(EventKind.Order),
    orderId: z.string(),
  }),

  z.object({
    event: z.literal(EventKind.Profile),
  }),

  z.object({
    event: z.literal(EventKind.Token),
    tokenId: z.string(),
  }),

  z.object({
    event: z.literal(EventKind.Vehicle),
    vehicleId: z.number().int().nonnegative(),
    longitude: z.number(),
    latitude: z.number(),
  }),

  z.object({
    event: z.literal(EventKind.ShmoBookingUpdate),
    bookingId: z.string(),
    orderId: z.string(),
  }),
]);

export type StreamEvent = z.infer<typeof StreamEventSchema>;

export type StreamEventLog = Array<{
  date: Date;
  streamEvent?: StreamEvent;
  meta?: string;
}>;
