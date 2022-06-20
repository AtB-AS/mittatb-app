import {useGeolocationState} from '@atb/GeolocationContext';
import MessageBox from '@atb/components/message-box';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {RouteProp} from '@react-navigation/native';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import Zones from './components/Zones';

import {
  getReferenceDataName,
  productIsSellableInApp,
} from '@atb/reference-data/utils';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {TicketingStackParams} from '../';
import {TariffZoneWithMetadata} from '../TariffZones';
import useOfferState from './use-offer-state';
import {formatToLongDateTime} from '@atb/utils/date';
import {usePreferences} from '@atb/preferences';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {useTicketState} from '@atb/tickets';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import Summary from './components/Summary';
import DurationSelection from './components/DurationSelection';
import StartTimeSelection from './components/StartTimeSelection';
import TravellerSelection from './components/TravellerSelection';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {getPurchaseFlow} from '../utils';

export type OverviewNavigationProp = DismissableStackNavigationProp<
  TicketingStackParams,
  'PurchaseOverview'
>;

export type OverviewProps = {
  navigation: OverviewNavigationProp;
  route: RouteProp<TicketingStackParams, 'PurchaseOverview'>;
};

const PurchaseOverview: React.FC<OverviewProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {deviceIsInspectable} = useMobileTokenContextState();
  const tokensEnabled = useHasEnabledMobileToken();
  const {customerProfile} = useTicketState();
  const hasProfileTravelCard = !!customerProfile?.travelcard;

  const showProfileTravelcardWarning = !tokensEnabled && hasProfileTravelCard;

  const showNotInspectableTokenWarning = tokensEnabled && !deviceIsInspectable;

  const {tariffZones, userProfiles} = useFirestoreConfiguration();

  const {preassignedFareproducts} = useFirestoreConfiguration();

  const selectableProducts = preassignedFareproducts
    .filter(productIsSellableInApp)
    .filter((product) => product.type === params.selectableProductType);

  const [preassignedFareProduct, setPreassignedFareProduct] = useState(
    selectableProducts[0],
  );

  const defaultUserProfilesWithCount = useDefaultUserProfilesWithCount(
    userProfiles,
    preassignedFareProduct,
  );
  const [travellerSelection, setTravellerSelection] = useState(
    defaultUserProfilesWithCount,
  );
  const hasSelection = travellerSelection.some((u) => u.count);

  const defaultTariffZone = useDefaultTariffZone(tariffZones);
  const {fromTariffZone = defaultTariffZone, toTariffZone = defaultTariffZone} =
    params;

  const [travelDate, setTravelDate] = useState<string | undefined>();

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    travellerSelection,
    travelDate,
  );

  const {travelDateSelectionEnabled} = getPurchaseFlow(preassignedFareProduct);

  const shouldShowValidTrainTicketNotice =
    (preassignedFareProduct.type === 'single' ||
      preassignedFareProduct.type === 'period') &&
    fromTariffZone.id === 'ATB:TariffZone:1' &&
    toTariffZone.id === 'ATB:TariffZone:1';

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () => navigation.dismiss();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(
          PurchaseOverviewTexts.header.title[preassignedFareProduct.type],
        )}
        leftButton={{
          type: 'cancel',
          onPress: closeModal,
        }}
        alertContext="ticketing"
      />

      <ScrollView testID="ticketingScrollView">
        <View style={styles.selectionLinks}>
          {error && (
            <MessageBox
              type="error"
              title={t(PurchaseOverviewTexts.errorMessageBox.title)}
              message={t(PurchaseOverviewTexts.errorMessageBox.message)}
              onPress={refreshOffer}
              onPressText={t(MessageBoxTexts.tryAgainButton)}
              containerStyle={styles.selectionComponent}
            />
          )}

          {preassignedFareProduct.type === 'period' && (
            <DurationSelection
              color="interactive_2"
              selectedProduct={preassignedFareProduct}
              setSelectedProduct={setPreassignedFareProduct}
              style={styles.selectionComponent}
            />
          )}

          <TravellerSelection
            setTravellerSelection={setTravellerSelection}
            preassignedFareProduct={preassignedFareProduct}
            selectableUserProfiles={defaultUserProfilesWithCount}
            style={styles.selectionComponent}
          />

          <Zones
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            style={styles.selectionComponent}
            isApplicableOnSingleZoneOnly={
              preassignedFareProduct.isApplicableOnSingleZoneOnly
            }
          />

          {travelDateSelectionEnabled && (
            <StartTimeSelection
              color="interactive_2"
              travelDate={travelDate}
              setTravelDate={setTravelDate}
              validFromTime={travelDate}
              style={styles.selectionComponent}
            />
          )}
        </View>

        {showProfileTravelcardWarning && (
          <MessageBox
            containerStyle={styles.warning}
            message={t(PurchaseOverviewTexts.warning)}
            type="warning"
          />
        )}

        {showNotInspectableTokenWarning && (
          <MessageBox
            isMarkdown={true}
            containerStyle={styles.warning}
            message={t(PurchaseOverviewTexts.notInspectableTokenDeviceWarning)}
            type="warning"
          />
        )}

        {shouldShowValidTrainTicketNotice && (
          <MessageBox
            containerStyle={styles.warning}
            message={
              preassignedFareProduct.type === 'single'
                ? t(PurchaseOverviewTexts.samarbeidsbillettenInfo.single)
                : t(PurchaseOverviewTexts.samarbeidsbillettenInfo.period)
            }
            type="info"
          />
        )}

        <FullScreenFooter>
          <Summary
            isLoading={isSearchingOffer}
            isError={!!error || !hasSelection}
            price={totalPrice}
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            userProfilesWithCount={travellerSelection}
            preassignedFareProduct={preassignedFareProduct}
            travelDate={travelDate}
            style={styles.summary}
          />
        </FullScreenFooter>
      </ScrollView>
    </View>
  );
};

export const createTravellersText = (
  userProfilesWithCount: UserProfileWithCount[],
  /**
   * shortened Shorten text if more than two traveller groups, making
   * '2 adults, 1 child, 2 senior' become '5 travellers'.
   */
  shortened: boolean,
  /**
   * prefixed Prefix the traveller selection with text signalling it is the current
   * selection.
   */
  prefixed: boolean,
  t: TranslateFunction,
  language: Language,
) => {
  const chosenUserProfiles = userProfilesWithCount.filter((u) => u.count);

  const prefix = prefixed ? t(PurchaseOverviewTexts.travellers.prefix) : '';

  if (chosenUserProfiles.length === 0) {
    return prefix + t(PurchaseOverviewTexts.travellers.noTravellers);
  } else if (chosenUserProfiles.length > 2 && shortened) {
    const totalCount = chosenUserProfiles.reduce(
      (total, u) => total + u.count,
      0,
    );
    return (
      prefix + t(PurchaseOverviewTexts.travellers.travellersCount(totalCount))
    );
  } else {
    return (
      prefix +
      chosenUserProfiles
        .map((u) => `${u.count} ${getReferenceDataName(u, language)}`)
        .join(', ')
    );
  }
};

export const createTravelDateText = (
  t: TranslateFunction,
  language: Language,
  travelDate?: string,
) => {
  return travelDate
    ? t(
        PurchaseOverviewTexts.travelDate.futureDate(
          formatToLongDateTime(travelDate, language),
        ),
      )
    : t(PurchaseOverviewTexts.travelDate.now);
};

/**
 * Get the default user profiles with count. If a default user profile has been
 * selected in the preferences that profile will have a count of one. If no
 * default user profile preference exists then the first user profile will have
 * a count of one.
 */
const useDefaultUserProfilesWithCount = (
  userProfiles: UserProfile[],
  preassignedFareProduct: PreassignedFareProduct,
) => {
  const {
    preferences: {defaultUserTypeString},
  } = usePreferences();

  const isDefaultProfile = useCallback(
    (u: UserProfile, index: number, filteredProfiles: UserProfile[]) => {
      if (
        defaultUserTypeString &&
        filteredProfiles.some(
          (fp) => fp.userTypeString === defaultUserTypeString,
        )
      ) {
        return u.userTypeString === defaultUserTypeString;
      } else {
        return index === 0;
      }
    },
    [defaultUserTypeString],
  );

  return useMemo(
    () =>
      userProfiles
        .filter((u) =>
          preassignedFareProduct.limitations.userProfileRefs.includes(u.id),
        )
        .map((u, i, filteredProfiles) => ({
          ...u,
          count: isDefaultProfile(u, i, filteredProfiles) ? 1 : 0,
        })),
    [userProfiles, isDefaultProfile, preassignedFareProduct],
  );
};

/**
 * Get the default tariff zone, either based on current location or else the
 * first tariff zone in the provided tariff zones list.
 */
const useDefaultTariffZone = (
  tariffZones: TariffZone[],
): TariffZoneWithMetadata => {
  const tariffZoneFromLocation = useTariffZoneFromLocation(tariffZones);
  return useMemo<TariffZoneWithMetadata>(
    () =>
      tariffZoneFromLocation
        ? {...tariffZoneFromLocation, resultType: 'geolocation'}
        : {...tariffZones[0], resultType: 'zone'},
    [tariffZones, tariffZoneFromLocation],
  );
};

export const useTariffZoneFromLocation = (tariffZones: TariffZone[]) => {
  const {location} = useGeolocationState();
  return useMemo(() => {
    if (location) {
      const {longitude, latitude} = location.coordinates;
      return tariffZones.find((t) =>
        turfBooleanPointInPolygon([longitude, latitude], t.geometry),
      );
    }
  }, [tariffZones, location]);
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  selectionComponent: {
    marginVertical: theme.spacings.medium,
  },
  selectionLinks: {margin: theme.spacings.medium},
  totalSection: {flex: 1, textAlign: 'center'},
  toPaymentButton: {marginHorizontal: theme.spacings.medium},
  warning: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  summary: {marginTop: theme.spacings.medium},
}));

export default PurchaseOverview;
