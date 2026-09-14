import React, {useEffect} from 'react';
import {useAuthContext} from '@atb/modules/auth';
import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {MapStateActionType, ReducerMapStateAction} from '../mapStateReducer';
import {
  clearLastActiveBooking,
  getLastActiveBooking,
  setLastActiveBooking,
} from '../last-active-booking';

/**
 * Opens the receipt for a booking which has ended while we weren't looking.
 *
 * The active booking only exists while the booking is in a non-terminal state,
 * so when it disappears the booking has been finished or cancelled. We can't
 * rely on the booking event for this, as the event stream is only connected
 * while the app is in the foreground, and delivers no events for the time it
 * was disconnected.
 */
export const useFinishedBookingDetection = (
  isFocusedAndActive: boolean,
  dispatchMapState: React.Dispatch<ReducerMapStateAction>,
) => {
  const {userId} = useAuthContext();
  const {data: activeBooking, isSuccess} =
    useActiveShmoBookingQuery(isFocusedAndActive);
  const activeBookingId = activeBooking?.bookingId;

  useEffect(() => {
    // Only a successful fetch tells us whether there is an active booking. A
    // failed one also leaves us without booking data, and must not be mistaken
    // for the booking having ended.
    if (!isSuccess || !userId) return;

    if (activeBookingId) {
      setLastActiveBooking({bookingId: activeBookingId, userId});
      return;
    }

    let isCancelled = false;
    getLastActiveBooking().then((lastActiveBooking) => {
      if (isCancelled || !lastActiveBooking) return;
      clearLastActiveBooking();
      // Belongs to a previous user, after a logout or an account switch.
      if (lastActiveBooking.userId !== userId) return;
      dispatchMapState({
        type: MapStateActionType.FinishedBooking,
        bookingId: lastActiveBooking.bookingId,
      });
    });
    return () => {
      isCancelled = true;
    };
  }, [activeBookingId, isSuccess, userId, dispatchMapState]);
};
