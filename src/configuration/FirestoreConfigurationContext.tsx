import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import Bugsnag from '@bugsnag/react-native';
import {defaultPreassignedFareProducts} from '@atb/reference-data/defaults';

type ConfigurationContextState = {
  preassignedFareproducts: PreassignedFareProduct[];
};

const defaultConfigurationContextState: ConfigurationContextState = {
  preassignedFareproducts: [],
};

const FirestoreConfigurationContext = createContext<ConfigurationContextState>(
  defaultConfigurationContextState,
);

export const FirestoreConfigurationContextProvider: React.FC = ({children}) => {
  const [preassignedFareproducts, setPreassignedFareproducts] = useState(
    defaultPreassignedFareProducts,
  );

  useEffect(() => {
    firestore()
      .collection('configuration')
      .onSnapshot(
        (snapshot) => {
          const preassignedFareproductsFromFirestore = snapshot.docs
            .find((doc) => doc.id == 'referenceData')
            ?.get<string>('preassignedFareProducts_v2');

          try {
            if (preassignedFareproductsFromFirestore) {
              const preassignedFareproducts = JSON.parse(
                preassignedFareproductsFromFirestore,
              ) as PreassignedFareProduct[];
              setPreassignedFareproducts(preassignedFareproducts);
            }
          } catch (error) {
            Bugsnag.leaveBreadcrumb(
              'Error parsing preassignedFareproducts from FireStore',
              {preassignedFareproductsFromFirestore},
            );
          }
        },
        (error) => {
          Bugsnag.leaveBreadcrumb(
            `Firebase Error when fetching Configuration from Firestore`,
            error,
          );
        },
      );
  }, []);

  const memoizedState = useMemo(
    () => ({
      preassignedFareproducts,
    }),
    [preassignedFareproducts],
  );

  return (
    <FirestoreConfigurationContext.Provider value={memoizedState}>
      {children}
    </FirestoreConfigurationContext.Provider>
  );
};

export function useFirestoreConfiguration() {
  const context = useContext(FirestoreConfigurationContext);
  if (context === undefined) {
    throw new Error(
      'useConfigurationContext must be used within an useConfigurationContextProvider',
    );
  }
  return context;
}
