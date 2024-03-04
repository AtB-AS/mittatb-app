import {ValidityStatus, useSortFcOrReservationByValidityAndCreation} from "../utils";
import {FareContract, Reservation} from "@atb/ticketing/types";
import {FirebaseFirestoreTypes} from "@react-native-firebase/firestore";

jest.mock('@atb/auth/AuthContext', () => { });
jest.mock('@atb/mobile-token/MobileTokenContext', () => { });
jest.mock('@atb/ticketing/TicketingContext', () => { });
jest.mock('@atb/configuration/FirestoreConfigurationContext', () => { });
jest.mock('@atb/api', () => { });

type MockedFareContract = FareContract & {
  validityStatus: ValidityStatus;
};

type MockedReservation = Reservation & {
  validityStatus: ValidityStatus;
};

function mockupFareContract(id: string, validityStatus: ValidityStatus): MockedFareContract {
  return {
    id: id,
    created: FirebaseFirestoreTypes.Timestamp.now(),
    version: "1",
    customerAccountId: "1",
    purchasedBy: "1",
    orderId: "1",
    state: 0,
    minimumSecurityLevel: 1,
    travelRights: [],
    qrCode: "",
    validityStatus: validityStatus,
  };
}

function mockupReservation(id: string, validityStatus: ValidityStatus): MockedReservation {
  return {
    orderId: id,
    created: FirebaseFirestoreTypes.Timestamp.now(),
    paymentId: 1,
    transactionId: 1,
    paymentType: 2,
    url: "http://example.com",
    validityStatus: validityStatus,
  };
}

describe('Sort by Validity', () => {
  const now = Date.now();

  it('Should sort fc or reservation by validity first', async () => {
    const fcOrReservations: (FareContract | Reservation)[] = [
      mockupFareContract('1', 'valid'),
      mockupFareContract('2', 'valid'),
      mockupReservation('3', 'valid'),
    ];

    const result = useSortFcOrReservationByValidityAndCreation(now, fcOrReservations, (currentTime, fareContract, _) => (fareContract as MockedFareContract).validityStatus);
    const ids: string[] = result.map((fcOrReservation) => {
      const isFareContract = 'travelRights' in fcOrReservation;
      if (isFareContract) {
        return fcOrReservation.id;
      } else {
        return fcOrReservation.orderId;
      }
    });

    expect(ids).toEqual(['3', '1', '2']);
  });
});
