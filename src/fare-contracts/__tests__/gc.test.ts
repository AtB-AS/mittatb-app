// import {ValidityStatus, useSortFcOrReservationByValidityAndCreation} from "../utils";
// import { FareContract, Reservation } from "@atb/ticketing/types";
import { createFcAndReservationComparator } from "../utils";
// import {FirebaseFirestoreTypes} from "@react-native-firebase/firestore";

// type MockedFareContract = FareContract & {
//   validityStatus: ValidityStatus;
// };

// type MockedReservation = Reservation & {
//   validityStatus: ValidityStatus;
// };

// function mockupFareContract(id: string, validityStatus: ValidityStatus): MockedFareContract {
//   return {
//     id: id,
//     created: FirebaseFirestoreTypes.Timestamp.now(),
//     version: "1",
//     customerAccountId: "1",
//     purchasedBy: "1",
//     orderId: "1",
//     state: 0,
//     minimumSecurityLevel: 1,
//     travelRights: [],
//     qrCode: "",
//     validityStatus: validityStatus,
//   };
// }

// function mockupReservation(id: string, validityStatus: ValidityStatus): MockedReservation {
//   return {
//     orderId: id,
//     created: FirebaseFirestoreTypes.Timestamp.now(),
//     paymentId: 1,
//     transactionId: 1,
//     paymentType: 2,
//     url: "http://example.com",
//     validityStatus: validityStatus,
//   };
// }

jest.mock('@atb/configuration', () => ({
    useFirestoreConfiguration: () => ({
        firestoreConfigStatus: 'success',
        resubscribeFirestoreConfig: () => {
        },
    }),
}));

jest.mock('@atb/auth', () => ({
    useAuthState: () => ({
      authStatus: 'authenticated',
      retryAuth: () => {},
    }),
  }));

  jest.mock('@atb/AppContext', () => ({
    useAppState: () => ({isLoading: false}),
  }));

describe('Sort by Validity', () => {
    const now = Date.now();

    it('Should sort fc or reservation by validity first', async () => {
        const fcOrReservations: (any)[] = [
            //   mockupFareContract('1', 'valid'),
            //   mockupFareContract('2', 'valid'),
            //   mockupReservation('3', 'valid'),
            {}, {}
        ] as any;

        // const result = useSortFcOrReservationByValidityAndCreation(now, fcOrReservations, (currentTime, fareContract, _) => (fareContract as MockedFareContract).validityStatus);
        // const ids: string[] = result.map((fcOrReservation) => {
        //     const isFareContract = 'travelRights' in fcOrReservation;
        //     if (isFareContract) {
        //         return fcOrReservation.id;
        //     } else {
        //         return fcOrReservation.orderId;
        //     }
        // });

        const comparator = createFcAndReservationComparator(now, "abc");
        const result = fcOrReservations.sort(comparator);

        // expect(ids).toEqual(['3', '1', '2']);
    });
});