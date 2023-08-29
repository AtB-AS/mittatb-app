import {Dispatch, useEffect} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AuthReducerAction} from './types';

export const useFetchCustomerDataAfterUserChanged = (
  user: FirebaseAuthTypes.User | null,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  // Refresh abt customer id from id token after logged in user changes
  useEffect(() => {
    (async function () {
      if (user) {
        const idToken = await user.getIdTokenResult();
        const abtCustomerId = idToken.claims['sub'];
        const abtCustomerIdFull = idToken.claims['abt_id'];
        const customerNumber = idToken.claims['customer_number'];
        /*
         If no customerNumber, this means the user was newly created in Firestore,
         but the asynchronous creation of the Entur account is not finished yet.
         */
        const authStatus = customerNumber
          ? 'authenticated'
          : 'creating-account';

        dispatch({
          type: 'SET_CUSTOMER_DATA',
          abtCustomerId,
          abtCustomerIdFull,
          customerNumber,
          authStatus,
        });
      }
    })();
  }, [user?.uid]);
};
