import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../components/screen-header';
import {Edit} from '../../../../assets/svg/icons/actions';
import {StyleSheet} from '../../../../theme';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import useOfferState from './use-offer-state';
import MessageBox from '../../../../message-box';
import * as Sections from '../../../../components/sections';
import {tariffZonesSummary, TariffZoneWithMetadata} from '../TariffZones';
import {
  Language,
  PurchaseOverviewTexts,
  TranslateFunction,
  useTranslation,
} from '../../../../translations';
import {useRemoteConfig} from '../../../../RemoteConfigContext';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {getReferenceDataName} from '../../../../reference-data/utils';
import {TariffZone} from '../../../../reference-data/types';
import {useGeolocationState} from '../../../../GeolocationContext';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {SafeAreaView} from 'react-native-safe-area-context';

export type OverviewProps = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'PurchaseOverview'
  >;
  route: RouteProp<TicketingStackParams, 'PurchaseOverview'>;
};

const PurchaseOverview: React.FC<OverviewProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {
    tariff_zones: tariffZones,
    preassigned_fare_products: preassignedFareProducts,
    user_profiles: userProfiles,
  } = useRemoteConfig();

  const preassignedFareProduct =
    params.preassignedFareProduct ?? preassignedFareProducts[0];

  const defaultUserProfilesWithCount = useMemo(
    () =>
      userProfiles.map((u, i) => ({
        ...u,
        count: i == 0 ? 1 : 0,
      })),
    [userProfiles],
  );
  const userProfilesWithCount =
    params.userProfilesWithCount ?? defaultUserProfilesWithCount;

  const defaultTariffZone = useDefaultTariffZone(tariffZones);
  const {
    fromTariffZone = defaultTariffZone,
    toTariffZone = defaultTariffZone,
  } = params;

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
  );

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () => navigation.dismiss();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t(PurchaseOverviewTexts.header.title)}
        leftButton={{
          type: 'cancel',
          onPress: closeModal,
        }}
      />

      <View style={styles.selectionLinks}>
        {error && (
          <MessageBox
            type="warning"
            title={t(PurchaseOverviewTexts.errorMessageBox.title)}
            message={t(PurchaseOverviewTexts.errorMessageBox.message)}
            retryFunction={refreshOffer}
            containerStyle={styles.errorMessage}
          />
        )}

        <Sections.Section>
          <Sections.LinkItem
            text={getReferenceDataName(preassignedFareProduct, language)}
            onPress={() => {
              navigation.push('Product', {
                preassignedFareProductId: preassignedFareProduct.id,
              });
            }}
            disabled={preassignedFareProducts.length <= 1}
            icon={<ThemeIcon svg={Edit} />}
          />
          <Sections.LinkItem
            text={createTravellersText(userProfilesWithCount, t, language)}
            onPress={() => {
              navigation.push('Travellers', {
                userProfilesWithCount,
              });
            }}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityHint: t(PurchaseOverviewTexts.travellers.a11yHint),
            }}
          />
          <Sections.LinkItem
            text={t(PurchaseOverviewTexts.startTime)}
            disabled={true}
            onPress={() => {}}
            icon={<ThemeIcon svg={Edit} />}
          />
          <Sections.LinkItem
            text={t(tariffZonesSummary(fromTariffZone, toTariffZone, language))}
            onPress={() => {
              navigation.push('TariffZones', {
                fromTariffZone,
                toTariffZone,
              });
            }}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityHint: t(PurchaseOverviewTexts.tariffZones.a11yHint),
            }}
          />
        </Sections.Section>
      </View>

      <View style={styles.toPaymentButton}>
        <Button
          mode="primary"
          text={t(PurchaseOverviewTexts.primaryButton.text(totalPrice))}
          disabled={isSearchingOffer || !totalPrice || !!error}
          accessibilityLabel={t(
            PurchaseOverviewTexts.primaryButton.a11yLabel(totalPrice),
          )}
          accessibilityHint={t(PurchaseOverviewTexts.primaryButton.a11yHint)}
          onPress={() => {
            navigation.navigate('Confirmation', {
              fromTariffZone,
              toTariffZone,
              userProfilesWithCount,
              preassignedFareProduct,
              headerLeftButton: {type: 'back'},
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const createTravellersText = (
  userProfilesWithCount: UserProfileWithCount[],
  t: TranslateFunction,
  language: Language,
) => {
  const chosenUserProfiles = userProfilesWithCount.filter((u) => u.count);
  if (chosenUserProfiles.length > 2) {
    const totalCount = chosenUserProfiles.reduce(
      (total, u) => total + u.count,
      0,
    );
    return t(PurchaseOverviewTexts.travellers.travellersCount(totalCount));
  } else {
    return chosenUserProfiles
      .map((u) => `${u.count} ${getReferenceDataName(u, language)}`)
      .join(', ');
  }
};

/**
 * Get the default tariff zone, either based on current location or else the
 * first tariff zone in the provided tariff zones list.
 */
const useDefaultTariffZone = (
  tariffZones: TariffZone[],
): TariffZoneWithMetadata => {
  const {location} = useGeolocationState();
  const tariffZoneFromLocation = useMemo(() => {
    if (location) {
      const {longitude, latitude} = location.coords;
      return tariffZones.find((t) =>
        turfBooleanPointInPolygon([longitude, latitude], t.geometry),
      );
    }
  }, [tariffZones, location]);
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
    backgroundColor: theme.background.level2,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  selectionLinks: {margin: theme.spacings.medium},
  toPaymentButton: {marginHorizontal: theme.spacings.medium},
}));

export default PurchaseOverview;
