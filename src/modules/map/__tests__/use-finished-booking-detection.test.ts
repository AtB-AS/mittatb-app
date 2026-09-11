import {renderHook, waitFor} from '@testing-library/react-native';
import {useFinishedBookingDetection} from '../hooks/use-finished-booking-detection';
import {MapStateActionType} from '../mapStateReducer';
import {
  clearPendingFinishedBooking,
  getPendingFinishedBooking,
  setPendingFinishedBooking,
} from '../pending-finished-booking';

const USER_ID_A = 'user-a';
const USER_ID_B = 'user-b';
const BOOKING_ID = 'booking-1';

jest.mock('../mapStateReducer', () => ({
  MapStateActionType: {FinishedBooking: 'FINISHED_BOOKING'},
}));

jest.mock('../pending-finished-booking', () => ({
  getPendingFinishedBooking: jest.fn(),
  setPendingFinishedBooking: jest.fn(),
  clearPendingFinishedBooking: jest.fn(),
}));

let mockUserId: string | undefined;
jest.mock('@atb/modules/auth', () => ({
  useAuthContext: () => ({userId: mockUserId}),
}));

let mockActiveBookingQuery: {data: any; isSuccess: boolean};
jest.mock('@atb/modules/mobility', () => ({
  useActiveShmoBookingQuery: () => mockActiveBookingQuery,
}));

const mockedGetPending = getPendingFinishedBooking as jest.Mock;

const renderDetection = () => {
  const dispatchMapState = jest.fn();
  const hook = renderHook(() =>
    useFinishedBookingDetection(true, dispatchMapState),
  );
  return {...hook, dispatchMapState};
};

describe('useFinishedBookingDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserId = USER_ID_A;
    mockedGetPending.mockResolvedValue(undefined);
    mockActiveBookingQuery = {data: null, isSuccess: true};
  });

  it('stores the booking id while a booking is active', async () => {
    mockActiveBookingQuery = {
      data: {bookingId: BOOKING_ID},
      isSuccess: true,
    };
    const {dispatchMapState} = renderDetection();

    expect(setPendingFinishedBooking).toHaveBeenCalledWith({
      bookingId: BOOKING_ID,
      userId: USER_ID_A,
    });
    expect(dispatchMapState).not.toHaveBeenCalled();
  });

  it('opens the receipt when the active booking disappears', async () => {
    mockedGetPending.mockResolvedValue({
      bookingId: BOOKING_ID,
      userId: USER_ID_A,
    });
    const {dispatchMapState} = renderDetection();

    await waitFor(() =>
      expect(dispatchMapState).toHaveBeenCalledWith({
        type: MapStateActionType.FinishedBooking,
        bookingId: BOOKING_ID,
      }),
    );
    expect(clearPendingFinishedBooking).toHaveBeenCalled();
  });

  it('opens the receipt when a booking goes from active to gone', async () => {
    mockedGetPending.mockResolvedValue({
      bookingId: BOOKING_ID,
      userId: USER_ID_A,
    });
    mockActiveBookingQuery = {
      data: {bookingId: BOOKING_ID},
      isSuccess: true,
    };
    const {dispatchMapState, rerender} = renderDetection();
    expect(dispatchMapState).not.toHaveBeenCalled();

    mockActiveBookingQuery = {data: null, isSuccess: true};
    rerender({});

    await waitFor(() =>
      expect(dispatchMapState).toHaveBeenCalledWith({
        type: MapStateActionType.FinishedBooking,
        bookingId: BOOKING_ID,
      }),
    );
  });

  it('does not open the receipt when the booking could not be fetched', async () => {
    mockedGetPending.mockResolvedValue({
      bookingId: BOOKING_ID,
      userId: USER_ID_A,
    });
    mockActiveBookingQuery = {data: undefined, isSuccess: false};
    const {dispatchMapState} = renderDetection();

    await waitFor(() => expect(mockedGetPending).not.toHaveBeenCalled());
    expect(dispatchMapState).not.toHaveBeenCalled();
    expect(clearPendingFinishedBooking).not.toHaveBeenCalled();
  });

  it('discards a booking belonging to another user', async () => {
    mockedGetPending.mockResolvedValue({
      bookingId: BOOKING_ID,
      userId: USER_ID_B,
    });
    const {dispatchMapState} = renderDetection();

    await waitFor(() => expect(clearPendingFinishedBooking).toHaveBeenCalled());
    expect(dispatchMapState).not.toHaveBeenCalled();
  });

  it('does nothing when there is no stored booking', async () => {
    const {dispatchMapState} = renderDetection();

    await waitFor(() => expect(mockedGetPending).toHaveBeenCalled());
    expect(dispatchMapState).not.toHaveBeenCalled();
    expect(clearPendingFinishedBooking).not.toHaveBeenCalled();
  });

  it('does nothing before the user is known', async () => {
    mockUserId = undefined;
    const {dispatchMapState} = renderDetection();

    await waitFor(() => expect(mockedGetPending).not.toHaveBeenCalled());
    expect(dispatchMapState).not.toHaveBeenCalled();
  });
});
