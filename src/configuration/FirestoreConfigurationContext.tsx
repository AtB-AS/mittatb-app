import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import Bugsnag from '@bugsnag/react-native';
import {defaultPreassignedFareProducts} from '@atb/reference-data/defaults';

type ConfigurationContextState = {
  hello: string;
  preassignedFareproducts: PreassignedFareProduct[];
};

const defaulConfigurationContextState: ConfigurationContextState = {
  hello: 'world',
  preassignedFareproducts: [],
};

const FirestoreConfigurationContext = createContext<ConfigurationContextState>(
  defaulConfigurationContextState,
);

export const FirestoreConfigurationContextProvider: React.FC = ({children}) => {
  const hello = '';
  const [preassignedFareproducts, setPreassignedFareproducts] = useState<
    PreassignedFareProduct[]
  >([]);

  useEffect(() => {
    firestore()
      .collection('configuration')
      .onSnapshot(
        (snapshot) => {
          const preassignedFareproductsFromFirestore = snapshot.docs
            .find((doc) => doc.id == 'referenceData')
            ?.get<string>('preassignedFareProducts_v2');

          const preassignedFareproducts = preassignedFareproductsFromFirestore
            ? (JSON.parse(
                preassignedFareproductsFromFirestore,
              ) as PreassignedFareProduct[])
            : defaultPreassignedFareProducts;

          setPreassignedFareproducts(preassignedFareproducts);

          Bugsnag.leaveBreadcrumb('>> Firestore fareproducts', {
            type: typeof preassignedFareproductsFromFirestore,
            preassignedFareproductsFromFirestore,
          });
        },
        (error) => {
          Bugsnag.leaveBreadcrumb(
            `!!! Firebase Error when fetching PreassignedFareproducts from Firestore`,
            error,
          );
        },
      );
  }, []);

  const memoizedState = useMemo(
    () => ({
      hello,
      preassignedFareproducts,
    }),
    [hello, preassignedFareproducts],
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
