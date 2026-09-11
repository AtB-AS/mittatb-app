import {z} from 'zod';
import {storage, StorageModelKeysEnum} from '@atb/modules/storage';
import {jsonStringToObject} from '@atb/utils/object';

/**
 * The booking we have seen as active, but not yet shown a receipt for.
 *
 * The event stream only delivers events while the app is in the foreground, so
 * a booking which is finished or cancelled while the phone is locked never
 * reaches us. Keeping the id in storage lets us detect it afterwards, by seeing
 * that the active booking has disappeared. The user id is stored alongside it
 * so a booking is never shown to another user after a logout or account switch.
 */
const PendingFinishedBookingSchema = z.object({
  bookingId: z.string(),
  userId: z.string(),
});

type PendingFinishedBooking = z.infer<typeof PendingFinishedBookingSchema>;

export const setPendingFinishedBooking = (
  pendingFinishedBooking: PendingFinishedBooking,
) =>
  storage.set(
    StorageModelKeysEnum.PendingFinishedBooking,
    JSON.stringify(pendingFinishedBooking),
  );

export const getPendingFinishedBooking = async (): Promise<
  PendingFinishedBooking | undefined
> => {
  const stored = await storage.get(StorageModelKeysEnum.PendingFinishedBooking);
  const parsed = PendingFinishedBookingSchema.safeParse(
    jsonStringToObject(stored),
  );
  return parsed.success ? parsed.data : undefined;
};

export const clearPendingFinishedBooking = () =>
  storage.remove(StorageModelKeysEnum.PendingFinishedBooking);
