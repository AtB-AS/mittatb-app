import {Edit} from '@atb/assets/svg/icons/actions';
import Button from '@atb/components/button';
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
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {TicketingStackParams} from '../';
import {tariffZonesSummary, TariffZoneWithMetadata} from '../TariffZones';
import useOfferState from './use-offer-state';
import {getPurchaseFlow} from '@atb/screens/Ticketing/Purchase/utils';
import {formatToLongDateTime} from '@atb/utils/date';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import ProductSheet from '@atb/screens/Ticketing/Purchase/Product/ProductSheet';
import {usePreferences} from '@atb/preferences';
import {screenReaderPause} from '@atb/components/accessible-text';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import TravellersSheet from '@atb/screens/Ticketing/Purchase/Travellers/TravellersSheet';
import TravelDateSheet from '@atb/screens/Ticketing/Purchase/TravelDate/TravelDateSheet';

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

  const [preassignedFareProduct, setPreassignedFareProduct] = useState(
    selectableProducts[0],
  );

  const {travelDateSelectionEnabled} = getPurchaseFlow(preassignedFareProduct);

  const defaultUserProfilesWithCount = useDefaultUserProfilesWithCount(
    userProfiles,
    preassignedFareProduct,
  );
  const [userProfilesWithCount, setUserProfilesWithCount] = useState(
    defaultUserProfilesWithCount,
  );

  const defaultTariffZone = useDefaultTariffZone(tariffZones);
  const {
    fromTariffZone = defaultTariffZone,
    toTariffZone = defaultTariffZone,
  } = params;

  const [travelDate, setTravelDate] = useState<string | undefined>();

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

  const {open: openBottomSheet} = useBottomSheet();

  const openProductSheet = () => {
    openBottomSheet((close, focusRef) => (
      <ProductSheet
        close={close}
        save={setPreassignedFareProduct}
        preassignedFareProduct={preassignedFareProduct}
        ref={focusRef}
      />
    ));
  };

  const openTravellersSheet = () => {
    openBottomSheet((close, focusRef) => (
      <TravellersSheet
        close={close}
        save={setUserProfilesWithCount}
        preassignedFareProduct={preassignedFareProduct}
        userProfilesWithCount={userProfilesWithCount}
        ref={focusRef}
      />
    ));
  };

  const openTravelDateSheet = () => {
    openBottomSheet((close, focusRef) => (
      <TravelDateSheet
        close={close}
        save={setTravelDate}
        travelDate={travelDate}
        ref={focusRef}
      />
    ));
  };

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
            onPress={openProductSheet}
            disabled={selectableProducts.length <= 1}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityLabel:
                getReferenceDataName(preassignedFareProduct, language) +
                screenReaderPause,
              accessibilityHint: t(PurchaseOverviewTexts.product.a11yHint),
            }}
          />
          <Sections.LinkItem
            text={createTravellersText(
              userProfilesWithCount,
              true,
              false,
              t,
              language,
            )}
            onPress={openTravellersSheet}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityLabel:
                createTravellersText(
                  userProfilesWithCount,
                  false,
                  false,
                  t,
                  language,
                ) + screenReaderPause,
              accessibilityHint: t(PurchaseOverviewTexts.travellers.a11yHint),
            }}
          />
          <Sections.LinkItem
            text={createTravelDateText(t, language, travelDate)}
            disabled={!travelDateSelectionEnabled}
            onPress={openTravelDateSheet}
            icon={<ThemeIcon svg={Edit} />}
            accessibility={{
              accessibilityLabel:
                createTravelDateText(t, language, travelDate) +
                screenReaderPause,
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
              accessibilityLabel:
                tariffZonesSummary(fromTariffZone, toTariffZone, language, t) +
                screenReaderPause,
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
