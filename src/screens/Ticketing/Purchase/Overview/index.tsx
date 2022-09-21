import MessageBox from '@atb/components/message-box';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import Zones from './components/Zones';

import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {usePreferences} from '@atb/preferences';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {useTicketState} from '@atb/tickets';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {getOtherDeviceIsInspectableWarning} from '../../Ticket/utils';
import {TicketPurchaseScreenProps} from '../types';
import {
  getPurchaseFlow,
  UserProfileTypeWithCount,
  useTravellersWithPreselectedCounts,
} from '../utils';
import DurationSelection from './components/DurationSelection';
import StartTimeSelection from './components/StartTimeSelection';
import Summary from './components/Summary';
import TravellerSelection from './components/TravellerSelection';
import useOfferState from './use-offer-state';

import {getTrainTicketNoticeText} from '../../utils';
import {TariffZone} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '../TariffZones';
import {useGeolocationState} from '@atb/GeolocationContext';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';

type OverviewProps = TicketPurchaseScreenProps<'PurchaseOverview'>;

const PurchaseOverview: React.FC<OverviewProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
    remoteTokens,
  } = useMobileTokenContextState();
  const tokensEnabled = useHasEnabledMobileToken();
  const {customerProfile} = useTicketState();
  const hasProfileTravelCard = !!customerProfile?.travelcard;

  const showProfileTravelcardWarning = !tokensEnabled && hasProfileTravelCard;

  const inspectableTokenWarningText = getOtherDeviceIsInspectableWarning(
    tokensEnabled,
    mobileTokenError,
    fallbackEnabled,
    t,
    remoteTokens,
    deviceIsInspectable,
  );

  const {preassignedFareproducts} = useFirestoreConfiguration();
  const productType =
    params.preassignedFareProduct?.type ?? params.selectableProductType;

  const selectableProducts = preassignedFareproducts
    .filter(productIsSellableInApp)
    .filter((product) => product.type === productType);

  const [preassignedFareProduct, setPreassignedFareProduct] = useState(
    params.preassignedFareProduct ?? selectableProducts[0],
  );

  const {tariffZones, userProfiles} = useFirestoreConfiguration();
  const {
    preferences: {defaultUserTypeString},
  } = usePreferences();

  const defaultPreSelectedUser: UserProfileTypeWithCount = {
    userTypeString: defaultUserTypeString ?? userProfiles[0].userTypeString,
    count: 1,
  };

  const preSelectedUsers = params.userProfilesWithCount?.map(
    (up: UserProfileWithCount): UserProfileTypeWithCount => {
      return {userTypeString: up.userTypeString, count: up.count};
    },
  );

  const selectableTravellers = useTravellersWithPreselectedCounts(
    userProfiles,
    preassignedFareProduct,
    preSelectedUsers ?? [defaultPreSelectedUser],
  );

  const [travellerSelection, setTravellerSelection] =
    useState(selectableTravellers);
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
      preassignedFareProduct.type === 'period' ||
      preassignedFareProduct.type === 'hour24') &&
    fromTariffZone.id === 'ATB:TariffZone:1' &&
    toTariffZone.id === 'ATB:TariffZone:1';

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () =>
    navigation.navigate('TabNavigator', {
      screen: 'Ticketing',
      params: {
        screen: 'BuyTickets',
      },
    });

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
        globalMessageContext="app-ticketing"
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
            selectableUserProfiles={selectableTravellers}
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

        {inspectableTokenWarningText && (
          <MessageBox
            type="warning"
            message={inspectableTokenWarningText}
            containerStyle={styles.warning}
            isMarkdown={true}
          />
        )}

        {shouldShowValidTrainTicketNotice && (
          <MessageBox
            containerStyle={styles.warning}
            message={getTrainTicketNoticeText(t, preassignedFareProduct.type)}
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
