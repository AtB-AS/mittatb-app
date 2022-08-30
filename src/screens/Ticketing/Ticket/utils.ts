import {
  FareContract,
  FareContractState,
  filterActiveOrCanBeUsedFareContracts,
  isInspectableTicket,
  isPreactivatedTicket,
  isValidRightNowFareContract,
  useTicketState,
} from '@atb/tickets';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  PreassignedFareProductType,
  UserProfile,
} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/screens/Ticketing/Purchase/Travellers/use-user-count-state';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/reference-data/utils';
import {RemoteToken} from '@atb/mobile-token/types';
import {Language, TicketTexts, TranslateFunction} from '@atb/translations';
import {
  findInspectable,
  getDeviceName,
  isMobileToken,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {TicketInfoDetailsProps} from './TicketInfo';
import {useState} from 'react';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import useInterval from '@atb/utils/use-interval';

export type RelativeValidityStatus = 'upcoming' | 'valid' | 'expired';

export type ValidityStatus =
  | RelativeValidityStatus
  | 'reserving'
  | 'unknown'
  | 'refunded'
  | 'inactive';

export function getRelativeValidity(
  now: number,
  validFrom: number,
  validTo: number,
): RelativeValidityStatus {
  if (now > validTo) return 'expired';
  if (now < validFrom) return 'upcoming';

  return 'valid';
}

export const userProfileCountAndName = (
  u: UserProfileWithCount,
  omitUserProfileCount: Boolean | undefined,
  language: Language,
) =>
  omitUserProfileCount
    ? `${getReferenceDataName(u, language)}`
    : `${u.count} ${getReferenceDataName(u, language)}`;

export function getValidityStatus(
  now: number,
  validFrom: number,
  validTo: number,
  state: FareContractState,
): ValidityStatus {
  if (state === FareContractState.Refunded) return 'refunded';
  return getRelativeValidity(now, validFrom, validTo);
}

export const getTransportationModes = (ticketType?: string) => {
  switch (ticketType) {
    case 'single':
    case 'hour24':
    case 'period':
    case 'carnet':
      return [{mode: Mode.Bus, subMode: TransportSubmode.LocalBus}];
    case 'summerPass': //TODO cross check this value
      return [
        {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
        {mode: Mode.Rail},
        {mode: Mode.Water},
      ];
    default:
      return null;
  }
};

export const mapToUserProfilesWithCount = (
  userProfileRefs: string[],
  userProfiles: UserProfile[],
): UserProfileWithCount[] =>
  userProfileRefs
    .reduce((groupedById, userProfileRef) => {
      const existing = groupedById.find(
        (r) => r.userProfileRef === userProfileRef,
      );
      if (existing) {
        existing.count += 1;
        return groupedById;
      }
      return [...groupedById, {userProfileRef, count: 1}];
    }, [] as {userProfileRef: string; count: number}[])
    .map((refAndCount) => {
      const userProfile = findReferenceDataById(
        userProfiles,
        refAndCount.userProfileRef,
      );
      return {
        ...userProfile,
        count: refAndCount.count,
      };
    })
    .filter(
      (userProfileWithCount): userProfileWithCount is UserProfileWithCount =>
        'id' in userProfileWithCount,
    );

export const getNonInspectableTokenWarning = (
  isError: boolean,
  fallbackEnabled: boolean,
  t: TranslateFunction,
  remoteTokens?: RemoteToken[],
  isInspectable?: boolean,
  ticketType?: PreassignedFareProductType,
) => {
  const inspectableToken = findInspectable(remoteTokens);
  if (isError && fallbackEnabled) return null;
  if (ticketType !== 'carnet') {
    if (isError) return t(TicketTexts.warning.unableToRetrieveToken);
    if (!inspectableToken)
      return t(TicketTexts.warning.noInspectableTokenFound);
    if (isTravelCardToken(inspectableToken))
      return t(TicketTexts.warning.travelCardAstoken);
    if (isMobileToken(inspectableToken) && !isInspectable)
      return t(
        TicketTexts.warning.anotherMobileAsToken(
          getDeviceName(inspectableToken) ||
            t(TicketTexts.warning.unnamedDevice),
        ),
      );
  } else {
    if (!isTravelCardToken(inspectableToken)) {
      return t(TicketTexts.warning.carnetWarning);
    } else {
      return t(TicketTexts.warning.travelCardAstoken);
    }
  }
};

export const getOtherDeviceIsInspectableWarning = (
  tokensEnabled: boolean,
  isError: boolean,
  fallbackEnabled: boolean,
  t: TranslateFunction,
  remoteTokens?: RemoteToken[],
  deviceIsInspectable?: boolean,
) => {
  const shouldShowWarning =
    tokensEnabled && (isError ? !fallbackEnabled : !deviceIsInspectable);
  if (!shouldShowWarning) return;

  const activeToken = findInspectable(remoteTokens);
  const deviceName =
    getDeviceName(activeToken) || t(TicketTexts.warning.unnamedDevice);

  return isTravelCardToken(activeToken)
    ? t(TicketTexts.warning.tcardIsInspectableWarning)
    : t(TicketTexts.warning.anotherPhoneIsInspectableWarning(deviceName));
};

export const isValidTicket = (status: ValidityStatus) => status === 'valid';

export const getTicketInfoDetailsProps = (
  fareContract: FareContract,
  now: number,
): TicketInfoDetailsProps => {
  const {customerProfile} = useTicketState();

  const hasActiveTravelCard = !!customerProfile?.travelcard;
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();
  const {tariffZones, userProfiles, preassignedFareproducts} =
    useFirestoreConfiguration();

  const travelRights = fareContract.travelRights.filter(isPreactivatedTicket);
  const firstTravelRight = travelRights[0];
  const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
  const ticketIsInspectable = isInspectableTicket(
    firstTravelRight,
    hasActiveTravelCard,
    hasEnabledMobileToken,
    deviceIsInspectable,
    mobileTokenError,
    fallbackEnabled,
  );
  const fareContractState = fareContract.state;
  const {startDateTime, endDateTime} = firstTravelRight;
  const validTo = endDateTime.toMillis();
  const validFrom = startDateTime.toMillis();
  const validityStatus = getValidityStatus(
    now,
    validFrom,
    validTo,
    fareContractState,
  );
  const [firstZone] = tariffZoneRefs;
  const [lastZone] = tariffZoneRefs.slice(-1);
  const fromTariffZone = findReferenceDataById(tariffZones, firstZone);
  const toTariffZone = findReferenceDataById(tariffZones, lastZone);
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareproducts,
    productRef,
  );
  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  return {
    preassignedFareProduct: preassignedFareProduct,
    fromTariffZone: fromTariffZone,
    toTariffZone: toTariffZone,
    userProfilesWithCount: userProfilesWithCount,
    status: validityStatus,
    now: now,
    validTo: validTo,
    isInspectable: ticketIsInspectable,
  };
};
