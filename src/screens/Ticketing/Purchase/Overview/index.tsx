import {Edit} from '@atb/assets/svg/mono-icons/actions';
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
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import Zones from './components/Zones';

import {
  getReferenceDataName,
  productIsSellableInApp,
} from '@atb/reference-data/utils';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {TicketingStackParams} from '../';
import {TariffZoneWithMetadata} from '../TariffZones';
import useOfferState from './use-offer-state';
import {getPurchaseFlow} from '@atb/screens/Ticketing/Purchase/utils';
import {formatToLongDateTime} from '@atb/utils/date';
import ThemeText from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {usePreferences} from '@atb/preferences';
import {screenReaderPause} from '@atb/components/accessible-text';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import TravellersSheet from '@atb/screens/Ticketing/Purchase/Travellers/TravellersSheet';
import TravelDateSheet from '@atb/screens/Ticketing/Purchase/TravelDate/TravelDateSheet';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {useTicketState} from '@atb/tickets';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import DurationSelection from './components/DurationSelection';
import StartTimeSelection from './components/StartTimeSelection';

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
  const {t, language} = useTranslation();
  const {inspectableToken} = useMobileTokenContextState();
  const tokensEnabled = useHasEnabledMobileToken();
  const {customerProfile} = useTicketState();
  const hasProfileTravelCard = !!customerProfile?.travelcard;

  const showProfileTravelcardWarning = !tokensEnabled && hasProfileTravelCard;
  const showNotInspectableTokenWarning =
    tokensEnabled && !inspectableToken?.isThisDevice;

  const {tariffZones, userProfiles} = useFirestoreConfiguration();

  const {preassignedFareproducts} = useFirestoreConfiguration();

  const selectableProducts = preassignedFareproducts
    .filter(productIsSellableInApp)
    .filter((product) => product.type === params.selectableProductType);

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

  const [selectableUserProfiles, setSelectableUserProfiles] = useState(
    defaultUserProfilesWithCount,
  );

  useEffect(() => {
    const options = defaultUserProfilesWithCount.filter((p) => {
      const profileIds = preassignedFareProduct.limitations.userProfileRefs;
      return profileIds.includes(p.id);
    });
    const optionIds = options.map((p) => p.id);
    const selectedUserProfiles = userProfilesWithCount
      .filter((p) => p.count > 0)
      .map((p) => p.id);

    if (!selectedUserProfiles.every((p) => optionIds.includes(p))) {
      setUserProfilesWithCount(defaultUserProfilesWithCount);
    } else {
      setSelectableUserProfiles(options);
    }
  }, [preassignedFareProduct, userProfilesWithCount]);

  const defaultTariffZone = useDefaultTariffZone(tariffZones);
  const {fromTariffZone = defaultTariffZone, toTariffZone = defaultTariffZone} =
    params;

  const [travelDate, setTravelDate] = useState<string | undefined>();

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
    travelDate,
  );

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

  const {open: openBottomSheet} = useBottomSheet();

  const openTravellersSheet = () => {
    openBottomSheet((close, focusRef) => (
      <TravellersSheet
        close={close}
        save={setUserProfilesWithCount}
        preassignedFareProduct={preassignedFareProduct}
        userProfilesWithCount={selectableUserProfiles}
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

      <ScrollView>
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

          <Sections.Section style={styles.selectionComponent}>
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
              testID="selectTravellersButton"
            />
            <Sections.GenericItem>
              {isSearchingOffer ? (
                <ActivityIndicator style={styles.totalSection} />
              ) : (
                <ThemeText
                  style={styles.totalSection}
                  type="body__primary--bold"
                  testID="offerTotalPriceText"
                >
                  {t(PurchaseOverviewTexts.totalPrice(totalPrice))}
                </ThemeText>
              )}
            </Sections.GenericItem>
          </Sections.Section>

          <Zones
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            style={styles.selectionComponent}
          />

          <StartTimeSelection
            color="interactive_2"
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            validFromTime={travelDate}
          />
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

        <View style={styles.toPaymentButton}>
          <Button
            interactiveColor="interactive_0"
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
            testID="goToPaymentButton"
          />
        </View>
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
}));

export default PurchaseOverview;
