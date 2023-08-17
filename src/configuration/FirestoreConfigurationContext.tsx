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
  CityZone,
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import Bugsnag from '@bugsnag/react-native';
import {
  defaultCityZones,
  defaultFareProductGroups,
  defaultFareProductTypeConfig,
  defaultPreassignedFareProducts,
  defaultTariffZones,
  defaultUserProfiles,
} from '@atb/reference-data/defaults';
import {
  defaultModesWeSellTicketsFor,
  defaultPaymentTypes,
  defaultVatPercent,
} from '@atb/configuration/defaults';
import {PaymentType} from '@atb/ticketing';
import {FareProductGroupType, FareProductTypeConfig} from './types';
import {
  mapLanguageAndTextType,
  mapToFareProductGroups,
  mapToFareProductTypeConfigs,
  mapToFlexibleTransportOption,
  mapToMobilityOperators,
  mapToTransportModeFilterOptions,
} from './converters';
import {LanguageAndTextType} from '@atb/translations';
import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility-operators';
import {TravelSearchFiltersType} from '@atb-as/config-specs';

export type AppTexts = {
  discountInfo: LanguageAndTextType[];
};

type ConfigurableLinks = {
  ticketingInfo?: LanguageAndTextType[];
  termsInfo?: LanguageAndTextType[];
  inspectionInfo?: LanguageAndTextType[];
  refundInfo?: LanguageAndTextType[];
};

type ConfigurationContextState = {
  preassignedFareProducts: PreassignedFareProduct[];
  fareProductGroups: FareProductGroupType[];
  tariffZones: TariffZone[];
  cityZones: CityZone[];
  userProfiles: UserProfile[];
  modesWeSellTicketsFor: string[];
  paymentTypes: PaymentType[];
  vatPercent: number;
  fareProductTypeConfigs: FareProductTypeConfig[];
  travelSearchFilters: TravelSearchFiltersType | undefined;
  appTexts: AppTexts | undefined;
  configurableLinks: ConfigurableLinks | undefined;
  mobilityOperators: MobilityOperatorType[] | undefined;
};

const defaultConfigurationContextState: ConfigurationContextState = {
  preassignedFareProducts: defaultPreassignedFareProducts,
  fareProductGroups: [],
  tariffZones: defaultTariffZones,
  cityZones: defaultCityZones,
  userProfiles: defaultUserProfiles,
  modesWeSellTicketsFor: defaultModesWeSellTicketsFor,
  paymentTypes: defaultPaymentTypes,
  vatPercent: defaultVatPercent,
  fareProductTypeConfigs: defaultFareProductTypeConfig,
  travelSearchFilters: undefined,
  appTexts: undefined,
  configurableLinks: undefined,
  mobilityOperators: undefined,
};

const FirestoreConfigurationContext = createContext<ConfigurationContextState>(
  defaultConfigurationContextState,
);

export const FirestoreConfigurationContextProvider: React.FC = ({children}) => {
  const [preassignedFareProducts, setPreassignedFareProducts] = useState(
    defaultPreassignedFareProducts,
  );
  const [tariffZones, setTariffZones] = useState(defaultTariffZones);
  const [cityZones, setCityZones] = useState(defaultCityZones);
  const [userProfiles, setUserProfiles] = useState(defaultUserProfiles);
  const [modesWeSellTicketsFor, setModesWeSellTicketsFor] = useState(
    defaultModesWeSellTicketsFor,
  );
  const [paymentTypes, setPaymentTypes] = useState(defaultPaymentTypes);
  const [vatPercent, setVatPercent] = useState(defaultVatPercent);
  const [fareProductTypeConfigs, setFareProductTypeConfigs] = useState<
    FareProductTypeConfig[]
  >(defaultFareProductTypeConfig);
  const [fareProductGroups, setFareProductGroups] = useState<
    FareProductGroupType[]
  >(defaultFareProductGroups);
  const [travelSearchFilters, setTravelSearchFilters] =
    useState<TravelSearchFiltersType>();
  const [appTexts, setAppTexts] = useState<AppTexts>();
  const [configurableLinks, setConfigurableLinks] =
    useState<ConfigurableLinks>();
  const [mobilityOperators, setMobilityOperators] = useState<
    MobilityOperatorType[]
  >([]);

  useEffect(() => {
    firestore()
      .collection('configuration')
      .onSnapshot(
        (snapshot) => {
          const preassignedFareProducts =
            getPreassignedFareContractsFromSnapshot(snapshot);
          if (preassignedFareProducts) {
            setPreassignedFareProducts(preassignedFareProducts);
          }

          const tariffZones = getTariffZonesFromSnapshot(snapshot);
          if (tariffZones) {
            setTariffZones(tariffZones);
          }

          const cityZones = getCityZonesFromSnapshot(snapshot);
          if (cityZones) {
            setCityZones(cityZones);
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

          const fareProductTypeConfigs =
            getFareProductTypeConfigsFromSnapshot(snapshot);
          if (fareProductTypeConfigs) {
            setFareProductTypeConfigs(fareProductTypeConfigs);
          }

          const fareProductGroups = getFareProductGroupsFromSnapshot(snapshot);
          if (fareProductGroups) {
            setFareProductGroups(fareProductGroups);
          }

          const travelSearchFilters =
            getTravelSearchFiltersFromSnapshot(snapshot);
          if (travelSearchFilters) {
            setTravelSearchFilters(travelSearchFilters);
          }

          const appTexts = getAppTextsFromSnapshot(snapshot);
          if (appTexts) {
            setAppTexts(appTexts);
          }

          const configurableLinks = getConfigurableLinksFromSnapshot(snapshot);
          if (configurableLinks) {
            setConfigurableLinks(configurableLinks);
          }

          const mobilityOperators = getMobilityOperatorsFromSnapshot(snapshot);
          if (mobilityOperators) {
            setMobilityOperators(mobilityOperators);
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
      preassignedFareProducts,
      fareProductGroups,
      tariffZones,
      cityZones,
      userProfiles,
      modesWeSellTicketsFor,
      paymentTypes,
      vatPercent,
      fareProductTypeConfigs,
      travelSearchFilters,
      appTexts,
      configurableLinks,
      mobilityOperators,
    };
  }, [
    preassignedFareProducts,
    fareProductGroups,
    tariffZones,
    cityZones,
    userProfiles,
    modesWeSellTicketsFor,
    paymentTypes,
    vatPercent,
    fareProductTypeConfigs,
    travelSearchFilters,
    appTexts,
    configurableLinks,
    mobilityOperators,
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

function getPreassignedFareContractsFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): PreassignedFareProduct[] | undefined {
  const preassignedFareProductsFromFirestore = snapshot.docs
    .find((doc) => doc.id == 'referenceData')
    ?.get<string>('preassignedFareProducts_v2');

  try {
    if (preassignedFareProductsFromFirestore) {
      return JSON.parse(
        preassignedFareProductsFromFirestore,
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

function getCityZonesFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): CityZone[] | undefined {
  const cityZonesFromFirestore = snapshot.docs
    .find((doc) => doc.id == 'referenceData')
    ?.get<string>('cityZones');

  try {
    if (cityZonesFromFirestore) {
      return JSON.parse(cityZonesFromFirestore) as CityZone[];
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
  const paymentTypes: PaymentType[] = [];
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

function getFareProductTypeConfigsFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): FareProductTypeConfig[] | undefined {
  const fareProductTypeConfigs = snapshot.docs
    .find((doc) => doc.id == 'fareProductTypeConfigs')
    ?.get('fareProductTypeConfigs');
  if (fareProductTypeConfigs !== undefined) {
    return mapToFareProductTypeConfigs(fareProductTypeConfigs);
  }

  return undefined;
}

function getFareProductGroupsFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): FareProductGroupType[] | undefined {
  const fareProductGroups = snapshot.docs
    .find((doc) => doc.id == 'fareProductTypeConfigs')
    ?.get('fareProductGroups');
  if (fareProductGroups !== undefined) {
    return mapToFareProductGroups(fareProductGroups);
  }

  return undefined;
}

function getTravelSearchFiltersFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): TravelSearchFiltersType | undefined {
  const travelSearchFiltersDoc = snapshot.docs.find(
    (doc) => doc.id == 'travelSearchFilters',
  );

  const transportModeOptions = travelSearchFiltersDoc?.get('transportModes');
  const flexibleTransport = travelSearchFiltersDoc?.get('flexibleTransport');

  const mappedTransportModes =
    mapToTransportModeFilterOptions(transportModeOptions);

  const mappedFlexibleTransport =
    mapToFlexibleTransportOption(flexibleTransport);

  if (mappedTransportModes) {
    return {
      transportModes: mappedTransportModes,
      flexibleTransport: mappedFlexibleTransport,
    };
  }

  return undefined;
}

function getAppTextsFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): AppTexts | undefined {
  const appTextsRaw = snapshot.docs.find((doc) => doc.id == 'appTexts');
  if (!appTextsRaw) return undefined;

  const discountInfo = mapLanguageAndTextType(appTextsRaw.get('discountInfo'));
  if (!discountInfo) {
    Bugsnag.notify(
      `App text field "discountInfo" should conform: "LanguageAndTextType"`,
    );
    return undefined;
  }

  return {discountInfo};
}

function getConfigurableLinksFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): ConfigurableLinks | undefined {
  const urls = snapshot.docs.find((doc) => doc.id == 'urls');

  const ticketingInfo = mapLanguageAndTextType(urls?.get('ticketingInfo'));
  const inspectionInfo = mapLanguageAndTextType(urls?.get('inspectionInfo'));
  const termsInfo = mapLanguageAndTextType(urls?.get('termsInfo'));
  const refundInfo = mapLanguageAndTextType(urls?.get('refundInfo'));

  return {
    ticketingInfo,
    termsInfo,
    inspectionInfo,
    refundInfo,
  };
}

function getMobilityOperatorsFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): MobilityOperatorType[] | undefined {
  const operators = snapshot.docs.find((doc) => doc.id == 'mobility');
  return mapToMobilityOperators(operators?.get('operators'));
}
