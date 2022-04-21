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
} from '@atb/reference-data/types';
import Bugsnag from '@bugsnag/react-native';
import {
  defaultPreassignedFareProducts,
  defaultTariffZones,
  defaultUserProfiles,
} from '@atb/reference-data/defaults';
import {
  defaultVatPercent,
  defaultPaymentTypes,
  defaultModesWeSellTicketsFor,
} from '@atb/configuration/defaults';
import {PaymentType} from '@atb/tickets';

type ConfigurationContextState = {
  preassignedFareproducts: PreassignedFareProduct[];
  tariffZones: TariffZone[];
  userProfiles: UserProfile[];
  modesWeSellTicketsFor: string[];
  paymentTypes: PaymentType[];
  vatPercent: number;
};

const defaultConfigurationContextState: ConfigurationContextState = {
  preassignedFareproducts: defaultPreassignedFareProducts,
  tariffZones: defaultTariffZones,
  userProfiles: defaultUserProfiles,
  modesWeSellTicketsFor: defaultModesWeSellTicketsFor,
  paymentTypes: defaultPaymentTypes,
  vatPercent: defaultVatPercent,
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
  const [modesWeSellTicketsFor, setModesWeSellTicketsFor] = useState(
    defaultModesWeSellTicketsFor,
  );
  const [paymentTypes, setPaymentTypes] = useState(defaultPaymentTypes);
  const [vatPercent, setVatPercent] = useState(defaultVatPercent);

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

          const modesWeSellTicketsFor =
            getModesWeSellTicketsForFromSnapshot(snapshot);
          if (modesWeSellTicketsFor) {
            setModesWeSellTicketsFor(modesWeSellTicketsFor);
          }

          const paymentTypes = getPaymentTypesFromSnapshot(snapshot);
          if (paymentTypes) {
            setPaymentTypes(paymentTypes);
          }

          const vatPercent = getVatPercentFromSnapshot(snapshot);
          if (vatPercent) {
            setVatPercent(vatPercent);
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
      modesWeSellTicketsFor,
      paymentTypes,
      vatPercent,
    };
  }, [
    preassignedFareproducts,
    tariffZones,
    userProfiles,
    modesWeSellTicketsFor,
    paymentTypes,
    vatPercent,
  ]);

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
      return JSON.parse(
        preassignedFareproductsFromFirestore,
      ) as PreassignedFareProduct[];
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

function getModesWeSellTicketsForFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): string[] | undefined {
  return snapshot.docs
    .find((doc) => doc.id == 'other')
    ?.get<string[]>('modesWeSellTicketsFor');
}

function getVatPercentFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): number | undefined {
  return snapshot.docs
    .find((doc) => doc.id == 'other')
    ?.get<number>('vatPercent');
}

function getPaymentTypesFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): PaymentType[] | undefined {
  let paymentTypesField = snapshot.docs
    .find((doc) => doc.id == 'paymentTypes')
    ?.get<string[]>('app');
  if (paymentTypesField != undefined) {
    return mapPaymentTypeStringsToEnums(paymentTypesField);
  }
  return undefined;
}

function mapPaymentTypeStringsToEnums(
  arrayOfPaymentTypes: string[],
): PaymentType[] {
  var paymentTypes: PaymentType[] = [];
  for (const option of arrayOfPaymentTypes) {
    const typeName =
      option.charAt(0).toUpperCase() + option.slice(1).toLocaleLowerCase();
    const paymentType: PaymentType =
      PaymentType[typeName as keyof typeof PaymentType];
    if (paymentType != undefined) {
      paymentTypes.push(paymentType);
    }
  }
  return paymentTypes;
}
