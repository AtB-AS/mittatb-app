import Bugsnag, {OnErrorCallback} from '@bugsnag/react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {addHours, isBefore, subMinutes} from 'date-fns';
import {CustomerProfile, FareContract, Reservation} from './types';

const OLD_ITEM_THRESHOLD_IN_MINUTES = 1;

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
        warningOnSlowItems(
          snapshot.docChanges() as FirebaseFirestoreTypes.DocumentChange<Reservation>[],
          function (event) {
            event.addMetadata('reservation', {
              abtCustomerId,
              reservation: true,
            });
          },
        );
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

function warningOnSlowItems(
  docsChange: FirebaseFirestoreTypes.DocumentChange<{
    created: FirebaseFirestoreTypes.Timestamp;
    orderId: string;
  }>[],
  onError: OnErrorCallback,
) {
  try {
    const itemsOlderThanAMinute = docsChange
      .map((d) => d.doc.data())
      .filter((item) =>
        isBefore(
          item.created.toDate(),
          subMinutes(new Date(), OLD_ITEM_THRESHOLD_IN_MINUTES),
        ),
      );

    if (!itemsOlderThanAMinute.length) return;
    Bugsnag.notify(
      new Error('Reservations added after some time'),
      function (event, cb) {
        event.severity = 'info';
        event.addMetadata(
          'itemIds',
          itemsOlderThanAMinute.map((res) => res.orderId),
        );

        return onError(event, cb);
      },
    );
  } catch (e) {
    // Do nothing.
  }
}
