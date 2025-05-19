import Bugsnag from '@bugsnag/react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {addHours} from 'date-fns';
import {CustomerProfile, Reservation} from './types';
import {FareContractType} from '@atb-as/utils';

type SnapshotListener<T> = {
  onSnapshot: (snapshot: T) => void;
  onError: (err: Error) => void;
};

export function setupFirestoreListeners(
  abtCustomerId: string,
  listeners: {
    fareContracts: SnapshotListener<FareContractType[]>;
    sentFareContracts: SnapshotListener<FareContractType[]>;
    reservations: SnapshotListener<Reservation[]>;
    rejectedReservations: SnapshotListener<Reservation[]>;
    customer: SnapshotListener<CustomerProfile>;
  },
) {
  const mapTravelRight = (
    travelRight: FirebaseFirestoreTypes.DocumentData,
  ): FirebaseFirestoreTypes.DocumentData => {
    return {
      ...travelRight,
      startDateTime: (
        travelRight.startDateTime as FirebaseFirestoreTypes.Timestamp
      )?.toDate(),
      endDateTime: (
        travelRight.endDateTime as FirebaseFirestoreTypes.Timestamp
      )?.toDate(),
      ...(travelRight.usedAccesses && {
        usedAccesses: travelRight.usedAccesses.map(mapUsedAccesses),
      }),
    };
  };

  const mapUsedAccesses = (
    usedAccesses: FirebaseFirestoreTypes.DocumentData,
  ): FirebaseFirestoreTypes.DocumentData => {
    return {
      ...usedAccesses,
      startDateTime: (
        usedAccesses.startDateTime as FirebaseFirestoreTypes.Timestamp
      ).toDate(),
      endDateTime: (
        usedAccesses.endDateTime as FirebaseFirestoreTypes.Timestamp
      ).toDate(),
    };
  };

  const mapFareContract = (
    d: FirebaseFirestoreTypes.DocumentSnapshot,
  ): FareContractType => {
    const fareContract = d.data();
    if (!fareContract) {
      throw new Error('No fare contract data');
    }
    return {
      ...fareContract,
      created: (
        fareContract.created as FirebaseFirestoreTypes.Timestamp
      ).toDate(),
      ...(fareContract.travelRights && {
        travelRights: fareContract.travelRights.map(mapTravelRight),
      }),
    };
  };

  const mapReservation = (
    d: FirebaseFirestoreTypes.DocumentSnapshot,
  ): Reservation => {
    const reservation = d.data();
    if (!reservation) {
      throw new Error('No reservation data');
    }

    if (reservation.created) {
      const rCreatedTimestamp =
        reservation.created as FirebaseFirestoreTypes.Timestamp;

      reservation.created = rCreatedTimestamp.toDate();
    }

    return reservation as Reservation;
  };

  const fareContractUnsub = firestore()
    .collection('customers')
    .doc(abtCustomerId)
    .collection('fareContracts')
    .orderBy('created', 'desc')
    .onSnapshot(
      (snapshot) => {
        const fareContracts =
          snapshot.docs.map<FareContractType>(mapFareContract);
        listeners.fareContracts.onSnapshot(fareContracts);

        Bugsnag.leaveBreadcrumb('farecontract_snapshot', {
          count: fareContracts.length,
        });
      },
      (err) => {
        Bugsnag.notify(err, function (event) {
          event.addMetadata('ticket', {abtCustomerId});
        });
        listeners.fareContracts.onError(err);
      },
    );

  const sentFareContractsUnsub = firestore()
    .collection('customers')
    .doc(abtCustomerId)
    .collection('sentFareContracts')
    .orderBy('created', 'desc')
    .onSnapshot(
      (snapshot) => {
        const sentFareContracts =
          snapshot.docs.map<FareContractType>(mapFareContract);
        listeners.sentFareContracts.onSnapshot(sentFareContracts);

        Bugsnag.leaveBreadcrumb('sentfarecontract_snapshot', {
          count: sentFareContracts.length,
        });
      },
      (err) => {
        Bugsnag.notify(err, function (event) {
          event.addMetadata('sentticket', {abtCustomerId});
        });
        listeners.sentFareContracts.onError(err);
      },
    );

  const reservationsUnsub = firestore()
    .collection('customers')
    .doc(abtCustomerId)
    .collection('reservations')
    .where('created', '>', addHours(Date.now(), -1))
    .onSnapshot(
      (snapshot) => {
        const reservations = snapshot.docs.map<Reservation>(mapReservation);
        listeners.reservations.onSnapshot(reservations);

        Bugsnag.leaveBreadcrumb('reservations_snapshot', {
          count: reservations.length,
        });
      },
      (err) => {
        Bugsnag.notify(err, function (event) {
          event.addMetadata('ticket', {abtCustomerId});
        });
        listeners.reservations.onError(err);
      },
    );

  const rejectedReservationsUnsub = firestore()
    .collection('customers')
    .doc(abtCustomerId)
    .collection('reservations')
    .where('paymentStatus', '==', 'REJECT')
    .onSnapshot(
      (snapshot) => {
        const rejectedReservations =
          snapshot.docs.map<Reservation>(mapReservation);
        listeners.rejectedReservations.onSnapshot(rejectedReservations);
        Bugsnag.leaveBreadcrumb('rejected_reservations_snapshot', {
          count: rejectedReservations.length,
        });
      },
      (err) => {
        Bugsnag.notify(err, function (event) {
          event.addMetadata('ticket', {abtCustomerId});
        });
        listeners.rejectedReservations.onError(err);
      },
    );

  const customerProfileUnsub = firestore()
    .collection('customers')
    .doc(abtCustomerId)
    .onSnapshot(
      (snapshot) => {
        const customerProfile = snapshot?.data() as CustomerProfile;

        listeners.customer.onSnapshot(customerProfile);

        Bugsnag.leaveBreadcrumb('customer_profile_fetched', {
          customerProfileId: customerProfile?.id,
        });
      },
      (err) => {
        Bugsnag.notify(err, function (event) {
          event.addMetadata('customerProfile', {abtCustomerId});
        });
        listeners.customer.onError(err);
      },
    );

  // Stop listening for updates when no longer required
  return function removeListeners() {
    fareContractUnsub();
    sentFareContractsUnsub();
    reservationsUnsub();
    customerProfileUnsub();
    rejectedReservationsUnsub();
  };
}
