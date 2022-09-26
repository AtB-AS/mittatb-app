import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import React, {useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import {TicketPurchaseScreenProps} from '../types';
import {useGeolocationState} from '@atb/GeolocationContext';
import {TariffZone} from '@atb/reference-data/types';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {TariffZoneWithMetadata} from '../TariffZones';
import {usePreferences} from '@atb/preferences';
import {
  UserProfileTypeWithCount,
  useTravellersWithPreselectedCounts,
} from '../utils';
import TicketDetailsSelection from './TicketDetailsSelection';

type OverviewProps = TicketPurchaseScreenProps<'PurchaseOverview'>;

const PurchaseOverview: React.FC<OverviewProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {preassignedFareproducts} = useFirestoreConfiguration();
  const productType =
    params.preassignedFareProduct?.type ?? params.selectableProductType;

  const selectableProducts = preassignedFareproducts
    .filter(productIsSellableInApp)
    .filter((product) => product.type === productType);

  const preassignedFareProduct =
    params.preassignedFareProduct ?? selectableProducts[0];

  const {tariffZones, userProfiles} = useFirestoreConfiguration();
  const defaultTariffZone = useDefaultTariffZone(tariffZones);
  const {fromTariffZone = defaultTariffZone, toTariffZone = defaultTariffZone} =
    params;
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
    preSelectedUsers ?? [defaultPreSelectedUser],
    preassignedFareProduct,
  );

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
        <TicketDetailsSelection
          {...params}
          preassignedFareProduct={preassignedFareProduct}
          selectableTravellers={selectableTravellers}
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
        />
      </ScrollView>
    </View>
  );
};

/**
 * Get the default tariff zone, either based on current location or else the
 * first tariff zone in the provided tariff zones list.
 */
export const useDefaultTariffZone = (
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
}));

export default PurchaseOverview;
