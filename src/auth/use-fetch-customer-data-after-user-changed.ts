import {Dispatch, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthReducerAction} from './types';

export const useFetchCustomerDataAfterUserChanged = (
  userId: string | undefined,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  // Refresh abt customer id from id token after logged in user changes
  useEffect(() => {
    if (userId) {
      auth()
        .currentUser?.getIdTokenResult()
        .then((idToken) => {
          const abtCustomerId = idToken.claims['abt_id'];
          const customerNumber = idToken.claims['customer_number'];

          dispatch({
            type: 'SET_CUSTOMER_DATA',
            abtCustomerId,
            customerNumber,
          });
        });
    }
  }, [dispatch, userId]);
};
