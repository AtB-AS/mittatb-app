import {Edit} from '@atb/assets/svg/icons/actions';
import Button from '@atb/components/button';
import Header from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
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
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {getReferenceDataName} from '@atb/reference-data/utils';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import React, {useCallback, useEffect, useMemo} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../';
import {tariffZonesSummary, TariffZoneWithMetadata} from '../TariffZones';
import useOfferState from './use-offer-state';
import {getPurchaseFlow} from '@atb/screens/Ticketing/Purchase/utils';
import {formatToLongDateTime} from '@atb/utils/date';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {usePreferences} from '@atb/preferences';

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

  const selectableProducts = preassignedFareProducts.filter(
    (p) => p.type === params.selectableProductType,
  );

  const preassignedFareProduct =
    params.preassignedFareProduct ?? selectableProducts[0];

  const {travelDateSelectionEnabled} = getPurchaseFlow(preassignedFareProduct);

  const defaultUserProfilesWithCount = useDefaultUserProfilesWithCount(
    userProfiles,
    preassignedFareProduct,
  );
  const userProfilesWithCount =
    params.userProfilesWithCount ?? defaultUserProfilesWithCount;

  const defaultTariffZone = useDefaultTariffZone(tariffZones);
  const {
    fromTariffZone = defaultTariffZone,
    toTariffZone = defaultTariffZone,
    travelDate,
  } = params;

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
    travelDate,
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
        title={t(
          PurchaseOverviewTexts.header.title[preassignedFareProduct.type],
        )}
        leftButton={{
          type: 'cancel',
          onPress: closeModal,
        }}
        alertContext="ticketing"
      />

      <View style={styles.selectionLinks}>
        {error && (
          <MessageBox
            type="error"
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
            disabled={selectableProducts.length <= 1}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityHint: t(PurchaseOverviewTexts.product.a11yHint),
            }}
          />
          <Sections.LinkItem
            text={createTravellersText(userProfilesWithCount, t, language)}
            onPress={() => {
              navigation.push('Travellers', {
                userProfilesWithCount,
                preassignedFareProduct,
              });
            }}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityHint: t(PurchaseOverviewTexts.travellers.a11yHint),
            }}
          />
          <Sections.LinkItem
            text={createTravelDateText(t, language, travelDate)}
            disabled={!travelDateSelectionEnabled}
            onPress={() => {
              navigation.navigate('TravelDate', {travelDate});
            }}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityHint: t(PurchaseOverviewTexts.travelDate.a11yHint),
            }}
          />
          <Sections.LinkItem
            text={tariffZonesSummary(fromTariffZone, toTariffZone, language, t)}
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
          <Sections.GenericItem>
            {isSearchingOffer ? (
              <ActivityIndicator style={styles.totalSection} />
            ) : (
              <ThemeText style={styles.totalSection} type="body__primary--bold">
                {t(PurchaseOverviewTexts.totalPrice(totalPrice))}
              </ThemeText>
            )}
          </Sections.GenericItem>
        </Sections.Section>
      </View>

      <View style={styles.toPaymentButton}>
        <Button
          color="primary_2"
          text={t(PurchaseOverviewTexts.primaryButton)}
          disabled={isSearchingOffer || !totalPrice || !!error}
          onPress={() => {
            navigation.navigate('Confirmation', {
              fromTariffZone,
              toTariffZone,
              userProfilesWithCount,
              preassignedFareProduct,
              travelDate,
              headerLeftButton: {type: 'back'},
            });
          }}
          icon={ArrowRight}
          iconPosition="right"
        />
      </View>
    </SafeAreaView>
  );
};

export const createTravellersText = (
  userProfilesWithCount: UserProfileWithCount[],
  t: TranslateFunction,
  language: Language,
) => {
  const chosenUserProfiles = userProfilesWithCount.filter((u) => u.count);
  if (chosenUserProfiles.length === 0) {
    return t(PurchaseOverviewTexts.travellers.noTravellers);
  } else if (chosenUserProfiles.length > 2) {
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
    [userProfiles, isDefaultProfile],
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
      const {longitude, latitude} = location.coords;
      return tariffZones.find((t) =>
        turfBooleanPointInPolygon([longitude, latitude], t.geometry),
      );
    }
  }, [tariffZones, location]);
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  selectionLinks: {margin: theme.spacings.medium},
  totalSection: {flex: 1, textAlign: 'center'},
  toPaymentButton: {marginHorizontal: theme.spacings.medium},
}));

export default PurchaseOverview;
