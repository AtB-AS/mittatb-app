import {z} from 'zod';

export enum EventKind {
  FareContract = 'FARE_CONTRACT',
}

export const StreamEvent = z.object({
  event: z.nativeEnum(EventKind),
});
export type StreamEvent = z.infer<typeof StreamEvent>;
