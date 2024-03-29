import Bugsnag from '@bugsnag/react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {addHours} from 'date-fns';
import {CustomerProfile, FareContract, Reservation} from './types';

type SnapshotListener<T> = {
  onSnapshot: (snapshot: T) => void;
  onError: (err: Error) => void;
};

export function setupFirestoreListeners(
  abtCustomerId: string,
  listeners: {
    fareContracts: SnapshotListener<FareContract[]>;
    sentFareContracts: SnapshotListener<FareContract[]>;
    reservations: SnapshotListener<Reservation[]>;
    rejectedReservations: SnapshotListener<Reservation[]>;
    customer: SnapshotListener<CustomerProfile>;
  },
) {
  const fareContractUnsub = firestore()
    .collection('customers')
    .doc(abtCustomerId)
    .collection('fareContracts')
    .orderBy('created', 'desc')
    .onSnapshot(
      (snapshot) => {
        const fareContracts = (
          snapshot as FirebaseFirestoreTypes.QuerySnapshot<FareContract>
        ).docs.map<FareContract>((d) => d.data());
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
        const sentFareContracts = (
          snapshot as FirebaseFirestoreTypes.QuerySnapshot<FareContract>
        ).docs.map<FareContract>((d) => d.data());
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
        const reservations = (
          snapshot as FirebaseFirestoreTypes.QuerySnapshot<Reservation>
        ).docs.map<Reservation>((d) => d.data());
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
        const rejectedReservations = (
          snapshot as FirebaseFirestoreTypes.QuerySnapshot<Reservation>
        ).docs.map<Reservation>((d) => d.data());
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
