import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';
import {PaymentType} from '@atb/ticketing';
import {
  FareProductGroupType,
  FareProductTypeConfig,
  ConfigurableLinksType,
  HarborConnectionOverrideType,
  TravelSearchFiltersType,
  CityZone,
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
  MobilityOperatorType,
  OperatorBenefitIdType,
  FirestoreConfigStatus,
  NotificationConfigType,
} from './types';
import {
  mapLanguageAndTextType,
  mapToFareProductGroups,
  mapToFareProductTypeConfigs,
  mapToFlexibleTransportOption,
  mapToHarborConnectionOverride,
  mapToMobilityOperators,
  mapToBenefitIdsRequiringValueCode,
  mapToNotificationConfig,
  mapToTransportModeFilterOptions,
  mapToTravelSearchPreferences,
  mapToStopSignalButtonConfig,
} from './converters';
import {LanguageAndTextType} from '@atb/translations';
import {useResubscribeToggle} from '@atb/utils/use-resubscribe-toggle';
import {
  StopSignalButtonConfig,
  type StopSignalButtonConfigType,
} from '@atb-as/config-specs';

export const defaultVatPercent: number = 12;
export const defaultStopSignalButtonConfig = StopSignalButtonConfig.parse({});

export type AppTexts = {
  discountInfo: LanguageAndTextType[];
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
  contactPhoneNumber: string | undefined;
  fareProductTypeConfigs: FareProductTypeConfig[];
  travelSearchFilters: TravelSearchFiltersType | undefined;
  appTexts: AppTexts | undefined;
  configurableLinks: ConfigurableLinksType | undefined;
  mobilityOperators: MobilityOperatorType[] | undefined;
  benefitIdsRequiringValueCode: OperatorBenefitIdType[] | undefined;
  harborConnectionOverrides: HarborConnectionOverrideType[] | undefined;
  firestoreConfigStatus: FirestoreConfigStatus;
  notificationConfig: NotificationConfigType | undefined;
  stopSignalButtonConfig: StopSignalButtonConfigType;
  resubscribeFirestoreConfig: () => void;
};

const FirestoreConfigurationContext = createContext<
  ConfigurationContextState | undefined
>(undefined);

export const FirestoreConfigurationContextProvider: React.FC = ({children}) => {
  const [preassignedFareProducts, setPreassignedFareProducts] = useState<
    PreassignedFareProduct[]
  >([]);
  const [tariffZones, setTariffZones] = useState<TariffZone[]>([]);
  const [cityZones, setCityZones] = useState<CityZone[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [modesWeSellTicketsFor, setModesWeSellTicketsFor] = useState<string[]>(
    [],
  );
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [vatPercent, setVatPercent] = useState<number>(defaultVatPercent);
  const [contactPhoneNumber, setContactPhoneNumber] = useState<
    string | undefined
  >();
  const [fareProductTypeConfigs, setFareProductTypeConfigs] = useState<
    FareProductTypeConfig[]
  >([]);
  const [fareProductGroups, setFareProductGroups] = useState<
    FareProductGroupType[]
  >([]);
  const [travelSearchFilters, setTravelSearchFilters] =
    useState<TravelSearchFiltersType>();
  const [appTexts, setAppTexts] = useState<AppTexts>();
  const [configurableLinks, setConfigurableLinks] =
    useState<ConfigurableLinksType>();
  const [mobilityOperators, setMobilityOperators] = useState<
    MobilityOperatorType[]
  >([]);
  const [benefitIdsRequiringValueCode, setBenefitIdsRequiringValueCode] =
    useState<OperatorBenefitIdType[]>([]);
  const [harborConnectionOverrides, setHarborConnectionOverrides] = useState<
    HarborConnectionOverrideType[]
  >([]);
  const [notificationConfig, setNotificationConfig] = useState<
    NotificationConfigType | undefined
  >();
  const [stopSignalButtonConfig, setStopSignalButtonConfig] =
    useState<StopSignalButtonConfigType>(defaultStopSignalButtonConfig);
  const [firestoreConfigStatus, setFirestoreConfigStatus] =
    useState<FirestoreConfigStatus>('loading');
  const {resubscribe, resubscribeToggle} = useResubscribeToggle();

  const subscribeFirestore = useCallback(() => {
    return firestore()
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

          const contactPhoneNumber =
            getContactPhoneNumberFromSnapshot(snapshot);
          setContactPhoneNumber(contactPhoneNumber);

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

          const benefitIdsRequiringValueCode =
            getBenefitIdsRequiringValueCodeFromSnapshot(snapshot);
          if (benefitIdsRequiringValueCode) {
            setBenefitIdsRequiringValueCode(benefitIdsRequiringValueCode);
          }

          const harborConnectionOverrides =
            getHarborConnectionOverridesFromSnapshot(snapshot);
          if (harborConnectionOverrides) {
            setHarborConnectionOverrides(harborConnectionOverrides);
          }
          setFirestoreConfigStatus(!snapshot.empty ? 'success' : 'loading');

          const notificationConfig =
            getNotificationConfigFromSnapshot(snapshot);
          if (notificationConfig) {
            setNotificationConfig(notificationConfig);
          }

          const stopSignalButtonConfig =
            getStopSignalButtonConfigFromSnapshot(snapshot);
          setStopSignalButtonConfig(stopSignalButtonConfig);
        },
        (error) => {
          Bugsnag.leaveBreadcrumb(
            `Firebase Error when fetching Configuration from Firestore`,
            error,
          );
        },
      );
  }, []);

  const clearState = () => {
    setFirestoreConfigStatus('loading');
    setPreassignedFareProducts([]);
    setTariffZones([]);
    setCityZones([]);
    setUserProfiles([]);
    setModesWeSellTicketsFor([]);
    setPaymentTypes([]);
    setVatPercent(defaultVatPercent);
    setContactPhoneNumber(undefined);
    setFareProductTypeConfigs([]);
    setFareProductGroups([]);
    setTravelSearchFilters(undefined);
    setAppTexts(undefined);
    setConfigurableLinks(undefined);
    setMobilityOperators([]);
    setBenefitIdsRequiringValueCode([]);
    setHarborConnectionOverrides([]);
    setNotificationConfig(undefined);
    setStopSignalButtonConfig(defaultStopSignalButtonConfig);
  };

  useEffect(() => {
    const unsubscribeFirestore = subscribeFirestore();
    return () => {
      clearState();
      unsubscribeFirestore();
    };
  }, [resubscribeToggle, subscribeFirestore]);

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
      contactPhoneNumber,
      fareProductTypeConfigs,
      travelSearchFilters,
      appTexts,
      configurableLinks,
      mobilityOperators,
      benefitIdsRequiringValueCode,
      harborConnectionOverrides,
      notificationConfig,
      stopSignalButtonConfig,
      firestoreConfigStatus,
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
    contactPhoneNumber,
    fareProductTypeConfigs,
    travelSearchFilters,
    appTexts,
    configurableLinks,
    mobilityOperators,
    benefitIdsRequiringValueCode,
    harborConnectionOverrides,
    notificationConfig,
    stopSignalButtonConfig,
    firestoreConfigStatus,
  ]);

  return (
    <FirestoreConfigurationContext.Provider
      value={{
        ...memoizedState,
        resubscribeFirestoreConfig: resubscribe,
      }}
    >
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

function getContactPhoneNumberFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): string | undefined {
  return snapshot.docs
    .find((doc) => doc.id == 'other')
    ?.get<string>('contactPhoneNumber');
}

function getPaymentTypesFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): PaymentType[] | undefined {
  const paymentTypesField = snapshot.docs
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
  const travelSearchPreferences = travelSearchFiltersDoc?.get(
    'travelSearchPreferences',
  );

  const mappedTransportModes =
    mapToTransportModeFilterOptions(transportModeOptions);

  const mappedFlexibleTransport =
    mapToFlexibleTransportOption(flexibleTransport);

  const mappedTravelSearchPreferences = mapToTravelSearchPreferences(
    travelSearchPreferences,
  );

  if (mappedTransportModes) {
    return {
      transportModes: mappedTransportModes,
      flexibleTransport: mappedFlexibleTransport,
      travelSearchPreferences: mappedTravelSearchPreferences,
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
): ConfigurableLinksType | undefined {
  const urls = snapshot.docs.find((doc) => doc.id == 'urls');

  const ticketingInfo = mapLanguageAndTextType(urls?.get('ticketingInfo'));
  const inspectionInfo = mapLanguageAndTextType(urls?.get('inspectionInfo'));
  const termsInfo = mapLanguageAndTextType(urls?.get('termsInfo'));
  const refundInfo = mapLanguageAndTextType(urls?.get('refundInfo'));
  const flexTransportInfo = mapLanguageAndTextType(
    urls?.get('flexTransportInfo'),
  );
  const dataSharingInfo = mapLanguageAndTextType(urls?.get('dataSharingInfo'));
  const appA11yStatement = mapLanguageAndTextType(
    urls?.get('appA11yStatement'),
  );
  const iosStoreListing = mapLanguageAndTextType(urls?.get('iosStoreListing'));
  const androidStoreListing = mapLanguageAndTextType(
    urls?.get('androidStoreListing'),
  );
  const externalRealtimeMap = mapLanguageAndTextType(
    urls?.get('externalRealtimeMap'),
  );

  return {
    ticketingInfo,
    termsInfo,
    inspectionInfo,
    refundInfo,
    flexTransportInfo,
    dataSharingInfo,
    appA11yStatement,
    iosStoreListing,
    androidStoreListing,
    externalRealtimeMap,
  };
}

function getMobilityOperatorsFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): MobilityOperatorType[] | undefined {
  const operators = snapshot.docs.find((doc) => doc.id == 'mobility');
  return mapToMobilityOperators(operators?.get('operators'));
}

function getBenefitIdsRequiringValueCodeFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): OperatorBenefitIdType[] | undefined {
  const mobilityConfiguration = snapshot.docs.find(
    (doc) => doc.id == 'mobility',
  );
  return mapToBenefitIdsRequiringValueCode(
    mobilityConfiguration?.get('benefitIdsRequiringValueCode'),
  );
}

function getHarborConnectionOverridesFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): HarborConnectionOverrideType[] | undefined {
  const overrides = snapshot.docs.find(
    (doc) => doc.id == 'harborConnectionOverrides',
  );
  return mapToHarborConnectionOverride(overrides?.get('overrides'));
}

function getNotificationConfigFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): NotificationConfigType | undefined {
  const notificationConfig = snapshot.docs.find(
    (doc) => doc.id == 'notificationConfig',
  );
  return mapToNotificationConfig(notificationConfig?.data());
}

function getStopSignalButtonConfigFromSnapshot(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): StopSignalButtonConfigType {
  const config = snapshot.docs.find(
    (doc) => doc.id == 'stopSignalButtonConfig',
  );
  return mapToStopSignalButtonConfig(config?.data());
}
