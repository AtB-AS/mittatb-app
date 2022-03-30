import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import Bugsnag from '@bugsnag/react-native';

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
      .collection('preassigned_fare_products_v2')
      .onSnapshot(
        (snapshot) => {
          const preassignedFareproducts = (
            snapshot as FirebaseFirestoreTypes.QuerySnapshot<PreassignedFareProduct>
          ).docs.map<PreassignedFareProduct>((doc) => doc.data());
          setPreassignedFareproducts(preassignedFareproducts);
        },
        (error) => {
          Bugsnag.leaveBreadcrumb(
            `Error when fetching PreassignedFareproducts from Firestore`,
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
