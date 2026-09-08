import Bugsnag from '@bugsnag/react-native';
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from '@react-native-firebase/firestore';
import {addHours} from 'date-fns';
import {CustomerProfile, Reservation} from './types';
import {FareContractType} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';

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
  const mapTravelRight = (travelRight: DocumentData): DocumentData => {
    return {
      ...travelRight,
      startDateTime: (travelRight.startDateTime as Timestamp)?.toDate(),
      endDateTime: (travelRight.endDateTime as Timestamp)?.toDate(),
      ...(travelRight.usedAccesses && {
        usedAccesses: travelRight.usedAccesses.map(mapUsedAccesses),
      }),
    };
  };

  const mapUsedAccesses = (usedAccesses: DocumentData): DocumentData => {
    return {
      ...usedAccesses,
      startDateTime: (usedAccesses.startDateTime as Timestamp).toDate(),
      endDateTime: (usedAccesses.endDateTime as Timestamp).toDate(),
    };
  };

  const mapFareContract = (
    d: DocumentSnapshot,
  ): FareContractType | undefined => {
    const fareContract = d.data();
    if (!fareContract) {
      return undefined;
    }
    try {
      const created = (fareContract.created as Timestamp).toDate();
      const travelRights = fareContract.travelRights.map(mapTravelRight);
      return {
        ...fareContract,
        created,
        travelRights,
      } as FareContractType;
    } catch (e) {
      console.warn('Error mapping fare contract:', e);
      return undefined;
    }
  };

  const mapReservation = (d: DocumentSnapshot): Reservation => {
    const reservation = d.data();
    if (!reservation) {
      throw new Error('No reservation data');
    }

    if (reservation.created) {
      const rCreatedTimestamp = reservation.created as Timestamp;

      reservation.created = rCreatedTimestamp.toDate();
    }

    return reservation as Reservation;
  };

  const db = getFirestore();
  const customerDoc = doc(collection(db, 'customers'), abtCustomerId);

  const fareContractUnsub = onSnapshot(
    query(collection(customerDoc, 'fareContracts'), orderBy('created', 'desc')),
    (snapshot) => {
      const fareContracts = snapshot.docs
        .map(mapFareContract)
        .filter(isDefined);
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

  const sentFareContractsUnsub = onSnapshot(
    query(
      collection(customerDoc, 'sentFareContracts'),
      orderBy('created', 'desc'),
    ),
    (snapshot) => {
      const sentFareContracts = snapshot.docs
        .map(mapFareContract)
        .filter(isDefined);
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

  const reservationsUnsub = onSnapshot(
    query(
      collection(customerDoc, 'reservations'),
      where('created', '>', addHours(Date.now(), -1)),
    ),
    (snapshot) => {
      const reservations = snapshot.docs.map(mapReservation);
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

  const rejectedReservationsUnsub = onSnapshot(
    query(
      collection(customerDoc, 'reservations'),
      where('paymentStatus', '==', 'REJECT'),
    ),
    (snapshot) => {
      const rejectedReservations = snapshot.docs.map(mapReservation);
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

  const customerProfileUnsub = onSnapshot(
    customerDoc,
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
