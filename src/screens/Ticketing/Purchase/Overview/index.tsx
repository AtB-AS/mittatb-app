import FullScreenHeader from '@atb/components/screen-header/full-header';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {usePreferences} from '@atb/preferences';
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React, {useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import {TariffZoneWithMetadata} from '../TariffZones';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {TicketPurchaseScreenProps} from '../types';
import {useTariffZoneFromLocation} from '../utils';
import TicketDetailsSelection from './TicketDetailsSelection';

type UserProfileTypeWithCount = {
  userTypeString: string;
  count: number;
};

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
    preassignedFareProduct,
    preSelectedUsers ?? [defaultPreSelectedUser],
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
          refreshOffer={params.refreshOffer}
          preassignedFareProduct={preassignedFareProduct}
          selectableTravellers={selectableTravellers}
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
        />
      </ScrollView>
    </View>
  );
};

const getCountIfUserIsIncluded = (
  u: UserProfile,
  selections: UserProfileTypeWithCount[],
): number => {
  const selectedUser = selections.filter(
    (up: UserProfileTypeWithCount) => up.userTypeString === u.userTypeString,
  );

  if (selectedUser.length < 1) return 0;
  return selectedUser[0].count;
};

/**
 * Get the default user profiles with count. If a default user profile has been
 * selected in the preferences that profile will have a count of one. If no
 * default user profile preference exists then the first user profile will have
 * a count of one.
 */
const useTravellersWithPreselectedCounts = (
  userProfiles: UserProfile[],
  preassignedFareProduct: PreassignedFareProduct,
  defaultSelections: UserProfileTypeWithCount[],
) => {
  return useMemo(
    () =>
      userProfiles
        .filter((u) =>
          preassignedFareProduct.limitations.userProfileRefs.includes(u.id),
        )
        .map((u) => ({
          ...u,
          count: getCountIfUserIsIncluded(u, defaultSelections),
        })),
    [userProfiles, preassignedFareProduct],
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
}));

export default PurchaseOverview;
