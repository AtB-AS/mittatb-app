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
const LastActiveBookingSchema = z.object({
  bookingId: z.string(),
  userId: z.string(),
});

type LastActiveBooking = z.infer<typeof LastActiveBookingSchema>;

export const setLastActiveBooking = (lastActiveBooking: LastActiveBooking) =>
  storage.set(
    StorageModelKeysEnum.LastActiveBooking,
    JSON.stringify(lastActiveBooking),
  );

export const getLastActiveBooking = async (): Promise<
  LastActiveBooking | undefined
> => {
  const stored = await storage.get(StorageModelKeysEnum.LastActiveBooking);
  const parsed = LastActiveBookingSchema.safeParse(jsonStringToObject(stored));
  return parsed.success ? parsed.data : undefined;
};

export const clearLastActiveBooking = () =>
  storage.remove(StorageModelKeysEnum.LastActiveBooking);
