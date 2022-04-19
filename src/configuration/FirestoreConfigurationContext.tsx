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
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
  DistributionChannel,
} from '@atb/reference-data/types';
import Bugsnag from '@bugsnag/react-native';
import {
  defaultPreassignedFareProducts,
  defaultTariffZones,
  defaultUserProfiles,
} from '@atb/reference-data/defaults';

type ConfigurationContextState = {
  preassignedFareproducts: PreassignedFareProduct[];
  tariffZones: TariffZone[];
  userProfiles: UserProfile[];
};

const defaultConfigurationContextState: ConfigurationContextState = {
  preassignedFareproducts: [],
  tariffZones: [],
  userProfiles: [],
};

const FirestoreConfigurationContext = createContext<ConfigurationContextState>(
  defaultConfigurationContextState,
);

export const FirestoreConfigurationContextProvider: React.FC = ({children}) => {
  const [preassignedFareproducts, setPreassignedFareproducts] = useState(
    defaultPreassignedFareProducts,
  );
  const [tariffZones, setTariffZones] = useState(defaultTariffZones);
  const [userProfiles, setUserProfiles] = useState(defaultUserProfiles);

  useEffect(() => {
    firestore()
      .collection('configuration')
      .onSnapshot(
        (snapshot) => {
          const preassignedFareproducts =
            getPreassignedFarecontractsFromSnapshot(snapshot);
          if (preassignedFareproducts) {
            setPreassignedFareproducts(preassignedFareproducts);
          }

          const tariffZones = getTariffZonesFromSnapshot(snapshot);
          if (tariffZones) {
            setTariffZones(tariffZones);
          }

          const userProfiles = getUserProfilesFromSnapshot(snapshot);
          if (userProfiles) {
            setUserProfiles(userProfiles);
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

  const memoizedState = useMemo(() => {
    return {
      preassignedFareproducts,
      tariffZones,
      userProfiles,
    };
  }, [preassignedFareproducts, tariffZones, userProfiles]);

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

function getPreassignedFarecontractsFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): PreassignedFareProduct[] | undefined {
  const preassignedFareproductsFromFirestore = snapshot.docs
    .find((doc) => doc.id == 'referenceData')
    ?.get<string>('preassignedFareProducts_v2');

  try {
    if (preassignedFareproductsFromFirestore) {
      const fareProducts = JSON.parse(
        preassignedFareproductsFromFirestore,
      ) as PreassignedFareProduct[];

      console.log('>> Firestore raw parsed', fareProducts);

      const filtered = fareProducts.filter((fareProduct) => {
        return fareProduct.distributionChannel.some(
          (channel) => channel == 'app',
        );
      });

      console.log('>> Firestore filtered fareproducts', filtered);
      return filtered;
    }
  } catch (error: any) {
    Bugsnag.notify(error);
  }
  return undefined;
}

function getTariffZonesFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): TariffZone[] | undefined {
  const tariffZonesFromFirestore = snapshot.docs
    .find((doc) => doc.id == 'referenceData')
    ?.get<string>('tariffZones');

  try {
    if (tariffZonesFromFirestore) {
      return JSON.parse(tariffZonesFromFirestore) as TariffZone[];
    }
  } catch (error: any) {
    Bugsnag.notify(error);
  }
  return undefined;
}

function getUserProfilesFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): UserProfile[] | undefined {
  const userProfilesFromFirestore = snapshot.docs
    .find((doc) => doc.id == 'referenceData')
    ?.get<string>('userProfiles');

  try {
    if (userProfilesFromFirestore) {
      return JSON.parse(userProfilesFromFirestore) as UserProfile[];
    }
  } catch (error: any) {
    Bugsnag.notify(error);
  }
  return undefined;
}
