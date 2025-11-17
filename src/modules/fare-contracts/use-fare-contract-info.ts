import {
  PreassignedFareProduct,
  FareProductTypeConfig,
  findReferenceDataById,
  useFirestoreConfigurationContext,
  UserProfile,
  FareZone,
  ProductTypeTransportModes,
} from '@atb/modules/configuration';
import {getLastUsedAccess} from '@atb/modules/ticketing';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import {
  FareContractType,
  getAccesses,
  TravelRightType,
  UsedAccessType,
} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';
import {useMemo} from 'react';
import {
  onlyUniquesBasedOnField,
  onlyUniquesBasedOnPredicate,
} from '@atb/utils/only-uniques';
import {ValidityStatus, getValidityStatus} from './utils';
import {
  getAvailabilityStatus,
  type AvailabilityStatus,
} from '@atb-as/utils/lib/fare-contract/availability-status';

type SlimTravelRight = Pick<
  TravelRightType,
  | 'startDateTime'
  | 'endDateTime'
  | 'fareProductRef'
  | 'status'
  | 'travelerName'
  | 'datedServiceJourneys'
  | 'schoolName'
>;

type SlimPreassignedFareProduct = Pick<
  PreassignedFareProduct,
  | 'name'
  | 'type'
  | 'alternativeNames'
  | 'description'
  | 'isBaggageProduct'
  | 'isBookingEnabled'
>;

type SlimFareProductTypeConfig = Pick<FareProductTypeConfig, 'illustration'>;

export type TransportMode = ProductTypeTransportModes;

type BaseTicketInfo = {
  fareZones: FareZone[];
  userProfile?: UserProfile;
  transportModes: TransportMode[];
};

export type FareTicketInfo = BaseTicketInfo &
  SlimTravelRight &
  SlimPreassignedFareProduct &
  SlimFareProductTypeConfig;

type SlimFareContract = Pick<
  FareContractType,
  | 'id'
  | 'bookingId'
  | 'state'
  | 'orderId'
  | 'customerAccountId'
  | 'purchasedBy'
  | 'version'
  | 'created'
  | 'totalAmount'
  | 'paymentType'
  | 'qrCode'
>;

type AccessInfoType = {
  usedAccesses: UsedAccessType[];
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};

export type FareContractInfo = SlimFareContract & {
  tickets: FareTicketInfo[];
  allTransportModes: TransportMode[];
  allUserProfiles: UserProfile[];
  allFareZones: FareZone[];
  isSentOrReceived: boolean;
  accesses: AccessInfoType | undefined;
  mostSignificantTicket: FareTicketInfo;
  hasTravelRightAccesses: boolean;
  getValidityInfo: (now: number, currentUserId?: string) => ValidityInfo;
  getAvailabilityStatus: (now: number) => AvailabilityStatus;
};

export const useFareContractInfos = (
  fareContracts: FareContractType[],
): FareContractInfo[] => {
  const {fareProductTypeConfigs, fareZones, userProfiles} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  return useMemo(() => {
    return fareContracts.map((fc) =>
      mapToFareContractInfo(
        fc,
        preassignedFareProducts,
        fareProductTypeConfigs,
        fareZones,
        userProfiles,
      ),
    );
  }, [
    fareContracts,
    preassignedFareProducts,
    fareProductTypeConfigs,
    fareZones,
    userProfiles,
  ]);
};

export const useFareContractInfo = (
  fareContract: FareContractType,
): FareContractInfo => {
  const {fareProductTypeConfigs, fareZones, userProfiles} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  return useMemo(
    () =>
      mapToFareContractInfo(
        fareContract,
        preassignedFareProducts,
        fareProductTypeConfigs,
        fareZones,
        userProfiles,
      ),
    [
      fareContract,
      preassignedFareProducts,
      fareProductTypeConfigs,
      fareZones,
      userProfiles,
    ],
  );
};

const mapToFareContractInfo = (
  fareContract: FareContractType,
  preassignedFareProducts: PreassignedFareProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  fareZones: FareZone[],
  userProfiles: UserProfile[],
): FareContractInfo => {
  const tickets = fareContract.travelRights
    .map((tr) => ({
      data: tr,
      info: findReferenceDataById(preassignedFareProducts, tr.fareProductRef),
      config: fareProductTypeConfigs.find((c) => c.type === tr.fareProductRef),
    }))
    .filter((fp) => isDefined(fp.info) && isDefined(fp.config))
    .map((fp) => ({
      fareZones: mapFareZones(fp.data.fareZoneRefs || [], fareZones),
      userProfiles: mapUserProfile(fp.data.userProfileRef, userProfiles),
      startDateTime: fp.data.startDateTime,
      endDateTime: fp.data.endDateTime,
      fareProductRef: fp.data.fareProductRef,
      status: fp.data.status,
      travelerName: fp.data.travelerName,
      datedServiceJourneys: fp.data.datedServiceJourneys,
      isBookingEnabled: fp.info!.isBookingEnabled,
      name: fp.info!.name,
      type: fp.info!.type,
      alternativeNames: fp.info!.alternativeNames,
      description: fp.info!.description,
      isBaggageProduct: fp.info!.isBaggageProduct,
      transportModes: fp.config!.transportModes,
      illustration: fp.config!.illustration,
    }));

  return {
    id: fareContract.id,
    bookingId: fareContract.bookingId,
    state: fareContract.state,
    orderId: fareContract.orderId,
    customerAccountId: fareContract.customerAccountId,
    purchasedBy: fareContract.purchasedBy,
    version: fareContract.version,
    created: fareContract.created,
    paymentType: fareContract.paymentType,
    totalAmount: fareContract.totalAmount,
    qrCode: fareContract.qrCode,
    tickets,
    allTransportModes: tickets
      .flatMap((p) => p.transportModes)
      .filter(isUniqueTransportMode),
    allUserProfiles: tickets.map((p) => p.userProfiles).filter(isDefined),
    allFareZones: tickets.flatMap((p) => p.fareZones).filter(isUniqueFareZone),
    isSentOrReceived:
      fareContract.customerAccountId !== fareContract.purchasedBy,
    accesses: getAccesses(fareContract),
    getValidityInfo: (now: number, userId?: string) =>
      getValidityInfo(now, fareContract, userId),
    hasTravelRightAccesses: fareContract.travelRights.some(
      (tr) => tr.maximumNumberOfAccesses !== undefined,
    ),
    mostSignificantTicket: getMostSignificantTicket(tickets),
    getAvailabilityStatus: (now: number) =>
      getAvailabilityStatus(fareContract, now),
  };
};

const mapFareZones = (
  fareZoneRefs: string[],
  fareZones: FareZone[],
): FareZone[] => {
  return fareZoneRefs
    .map((ref) => findReferenceDataById(fareZones, ref))
    .filter(isDefined);
};

const mapUserProfile = (
  userProfileRef: string | undefined,
  userProfiles: UserProfile[],
): UserProfile | undefined => {
  if (!userProfileRef) return undefined;
  return findReferenceDataById(userProfiles, userProfileRef);
};

const isUniqueTransportMode = (
  tm: TransportMode,
  index: number,
  array: TransportMode[],
) =>
  onlyUniquesBasedOnPredicate(
    (a: TransportMode, b: TransportMode) =>
      a.mode === b.mode && a.subMode === b.subMode,
  )(tm, index, array);

const isUniqueFareZone = onlyUniquesBasedOnField<FareZone>('id');

const getMostSignificantTicket = (
  tickets: FareTicketInfo[],
): FareTicketInfo => {
  const firstNoneBaggableProduct = tickets.find((t) => !t.isBaggageProduct);
  if (firstNoneBaggableProduct) {
    return firstNoneBaggableProduct;
  }
  return tickets[0];
};

export type ValidityInfo = {
  validityStatus: ValidityStatus;
  validFrom: number;
  validTo: number;
  usedAccesses?: UsedAccessType[];
};

export function getValidityInfo(
  now: number,
  fc: FareContractType,
  currentUserId?: string,
): ValidityInfo {
  const isSentOrReceived = fc.customerAccountId !== fc.purchasedBy;
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  const travelRights = fc.travelRights;
  const firstTravelRight = travelRights[0];

  const fareContractValidFrom = firstTravelRight.startDateTime.getTime();
  const fareContractValidTo = firstTravelRight.endDateTime.getTime();

  const validityStatus = getValidityStatus(now, fc, isSent);

  const carnetTravelRightAccesses = getAccesses(fc);

  const lastUsedAccess =
    carnetTravelRightAccesses &&
    getLastUsedAccess(now, carnetTravelRightAccesses.usedAccesses);

  const validFrom = lastUsedAccess?.validFrom
    ? lastUsedAccess.validFrom
    : fareContractValidFrom;
  const validTo = lastUsedAccess?.validTo
    ? lastUsedAccess.validTo
    : fareContractValidTo;

  const usedAccesses = carnetTravelRightAccesses?.usedAccesses;

  return {
    validityStatus,
    validFrom,
    validTo,
    usedAccesses,
  };
}
