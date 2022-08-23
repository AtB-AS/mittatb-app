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

export default function setupFirestoreListener(
  abtCustomerId: string,
  listeners: {
    fareContracts: SnapshotListener<FareContract[]>;
    reservations: SnapshotListener<Reservation[]>;
    customer: SnapshotListener<CustomerProfile>;
  },
) {
  const fareContractSub = firestore()
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

  const reservationsSub = firestore()
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

  const customerProfileSub = firestore()
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
    fareContractSub();
    reservationsSub();
    customerProfileSub();
  };
}
