import {PaymentType} from '@atb/ticketing';
import {format, parseISO} from 'date-fns';
import {ErrorType} from '@atb/api/utils';
import {LocationSearchTexts, TranslateFunction} from '@atb/translations';
import {TariffZone} from '@atb/configuration';
import {
  TariffZoneWithMetadata,
  useTariffZoneFromLocation,
} from '@atb/tariff-zones-selector';
import {useMemo} from 'react';

import {useAuthState} from '@atb/auth';
import {useAppState} from '@atb/AppContext';
import {shouldOnboardMobileToken} from '@atb/api/utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {InteractionManager} from 'react-native';

export function getPaymentTypeName(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Visa:
      return 'Visa';
    case PaymentType.Mastercard:
      return 'MasterCard';
    case PaymentType.Vipps:
      return 'Vipps';
    default:
      return '';
  }
}

export function getExpireDate(iso: string): string {
  const date = parseISO(iso);
  // Subtract one day to get the correct expiry date
  // This must be done since the expiry date stored is the date the card expires,
  // and the date that shows on the card is the month before the card expires
  // Example: The card expires the moment the date is 02.2021, but the date on the card is 01.2021
  date.setDate(date.getDate() - 1);
  return format(date, 'MM/yy');
}

export function translateErrorType(
  errorType: ErrorType,
  t: TranslateFunction,
): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(LocationSearchTexts.messages.networkError);
    default:
      return t(LocationSearchTexts.messages.defaultError);
  }
}
/**
 * Get the default tariff zone, either based on current location, default tariff
 * zone set on tariff zone in reference data or else the first tariff zone in the
 * provided tariff zones list.
 */
export const useDefaultTariffZone = (
  tariffZones: TariffZone[],
): TariffZoneWithMetadata => {
  const tariffZoneFromLocation = useTariffZoneFromLocation(tariffZones);
  return useMemo<TariffZoneWithMetadata>(() => {
    if (tariffZoneFromLocation) {
      return {...tariffZoneFromLocation, resultType: 'geolocation'};
    }

    const defaultTariffZone = tariffZones.find(
      (tariffZone) => tariffZone.isDefault,
    );

    if (defaultTariffZone) {
      return {...defaultTariffZone, resultType: 'zone'};
    }

    return {...tariffZones[0], resultType: 'zone'};
  }, [tariffZones, tariffZoneFromLocation]);
};

export const useGoToMobileTokenOnboardingWhenNecessary = () => {
  const {authenticationType} = useAuthState();
  const {mobileTokenOnboarded, mobileTokenWithoutTravelcardOnboarded} =
    useAppState();
  const {disable_travelcard} = useRemoteConfig();
  const navigation = useNavigation<RootNavigationProps>();

  const shouldOnboard = shouldOnboardMobileToken(
    authenticationType,
    mobileTokenOnboarded,
    mobileTokenWithoutTravelcardOnboarded,
    disable_travelcard,
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    if (shouldOnboard && isFocused) {
      InteractionManager.runAfterInteractions(() =>
        navigation.navigate('Root_ConsiderTravelTokenChangeScreen'),
      );
    }
  }, [shouldOnboard, isFocused, navigation]);
};
