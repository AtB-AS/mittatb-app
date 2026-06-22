import {useAuthContext} from '@atb/modules/auth';
import {AnonymousPurchaseWarning} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/AnonymousPurchaseWarning';
import {FareProducts} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/FareProducts/FareProducts';
import {StyleSheet} from '@atb/theme';
import React, {useRef} from 'react';
import {RefreshControl, View} from 'react-native';
import {BottomSheetModalMethods} from '@atb/components/bottom-sheet';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {TransferCodeBottomSheet} from './Components/TransferCodeBottomSheet';
import {RecentFareContracts} from './Components/RecentFareContracts/RecentFareContracts';
import {TicketTabNavScreenProps} from '../navigation-types';
import {FareProductTypeConfig} from '@atb/modules/configuration';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {FareZoneWithMetadata} from '@atb/modules/fare-zones-selector';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {FareZone} from '@atb/modules/configuration';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import {ErrorWithAccountMessage} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/ErrorWithAccountMessage';
import {
  useRecentFareContracts,
  type RecentFareContractType,
} from '@atb/modules/fare-contracts';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';
import {AnimatedGestureHandlerScrollView} from '@atb/components/animated-gesture-handler-scroll-view';
import {useTabScrollHandler} from '../Ticketing_TicketTabNavStack';
import {useManualRefreshControlProps} from '@atb/utils/use-manual-refresh-props';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';

type Props = TicketTabNavScreenProps<'TicketTabNav_PurchaseTabScreen'>;

export const TicketTabNav_PurchaseTabScreen = ({navigation}: Props) => {
  const {authenticationType} = useAuthContext();
  const {
    recentFareContracts,
    recentFareContractsLoading,
    recentFareContractsRefetch,
  } = useRecentFareContracts();
  const {
    data: preassignedFareProducts,
    refetch: refetchPreassignedFareProducts,
    isRefetching: isRefetchingPreassignedFareProducts,
    isPlaceholderData,
  } = useGetFareProductsQuery();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const styles = useStyles();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const {scrollHandler} = useTabScrollHandler(0);
  const {isTicketTransferEnabled} = useFeatureTogglesContext();
  const transferCodeButtonRef = useRef<View>(null);
  const transferCodeSheetRef = useRef<BottomSheetModalMethods>(null);

  const onTicketsReceived = () => {
    analytics.logEvent('Ticketing', 'Ticket received with transfer code');
    navigation.navigate('TicketTabNav_AvailableFareContractsTabScreen', {
      refreshTickets: true,
      showTransferCodeSuccess: true,
    });
  };

  const onOpenTransferCodeSheet = () => {
    if (authenticationType !== 'phone') {
      navigation.navigate('Root_LoginRequiredForFareProductScreen', {
        title: t(TicketingTexts.transferCode.loginRequired.title),
        text: t(TicketingTexts.transferCode.loginRequired.text),
      });
      return;
    } else {
      transferCodeSheetRef.current?.present();
    }
  };

  const onProductSelect = (fareProductTypeConfig: FareProductTypeConfig) => {
    analytics.logEvent('Ticketing', 'Fare product selected', {
      type: fareProductTypeConfig.type,
    });

    const selection = selectionBuilder
      .forType(fareProductTypeConfig.type)
      .build();

    if (
      authenticationType !== 'phone' &&
      fareProductTypeConfig.configuration.requiresLogin
    ) {
      navigation.navigate('Root_LoginRequiredForFareProductScreen', {});
      return;
    }

    navigation.navigate('Root_PurchaseOverviewScreen', {
      selection,
      transitionOverride: 'slide-from-right',
      mode: 'Ticket',
    });
  };

  const onRecentFareContractSelect = (
    rfc: RecentFareContractType,
    fareProductTypeConfig: FareProductTypeConfig,
    harbors?: StopPlaceFragment[],
  ) => {
    analytics.logEvent('Ticketing', 'Recently used fare product selected', {
      type: fareProductTypeConfig.type,
    });

    const mapZone = (zone: FareZone): FareZoneWithMetadata => {
      return {...zone, resultType: 'zone'};
    };

    const mapPlace = (pointToPointValidityPlace?: string) => {
      if (!pointToPointValidityPlace) return undefined;
      const fromName = harbors?.find(
        (sp) => sp.id === pointToPointValidityPlace,
      )?.name;
      return fromName
        ? {
            id: pointToPointValidityPlace,
            name: fromName,
          }
        : undefined;
    };

    const builder = selectionBuilder
      .forType(fareProductTypeConfig.type)
      .product(rfc.preassignedFareProduct)
      .userProfiles(rfc.userProfilesWithCount)
      .supplementProducts(rfc.baggageProductsWithCount)
      .fromStopPlace(mapPlace(rfc.pointToPointValidity?.fromPlace))
      .toStopPlace(mapPlace(rfc.pointToPointValidity?.toPlace));
    if (rfc.fromFareZone) builder.fromZone(mapZone(rfc.fromFareZone));
    if (rfc.toFareZone) builder.toZone(mapZone(rfc.toFareZone));
    const selection = builder.build();

    /*
     *  If booking is enabled we need the user to select a departure, and
     *  thus cannot send them directly to the confirmation screen.
     */
    if (rfc.preassignedFareProduct.isBookingEnabled) {
      navigation.navigate('Root_PurchaseOverviewScreen', {
        selection,
        mode: 'Ticket',
        transitionOverride: 'slide-from-right',
      });
    } else {
      navigation.navigate('Root_PurchaseConfirmationScreen', {
        selection,
        mode: 'Ticket',
        transitionOverride: 'slide-from-right',
        allowEdit: true,
      });
    }
  };

  const refreshControlProps = useManualRefreshControlProps({
    onRefresh: () => {
      recentFareContractsRefetch();
      refetchPreassignedFareProducts();
      analytics.logEvent('Ticketing', 'Pull to refresh products', {
        fareProductsCount: preassignedFareProducts.length,
        isPlaceholderData,
      });
    },
    refreshing: isRefetchingPreassignedFareProducts,
  });

  return authenticationType !== 'none' ? (
    <AnimatedGestureHandlerScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={<RefreshControl {...refreshControlProps} />}
    >
      <ErrorWithAccountMessage style={styles.accountWrongMessage} />
      <RecentFareContracts
        recentFareContracts={recentFareContracts}
        loading={recentFareContractsLoading}
        onSelect={onRecentFareContractSelect}
      />
      <View style={styles.container}>
        {authenticationType !== 'phone' && (
          <AnonymousPurchaseWarning
            onPress={() =>
              navigation.navigate(
                'Root_PurchaseAsAnonymousConsequencesScreen',
                {
                  showLoginButton: true,
                  transitionOverride: 'slide-from-bottom',
                },
              )
            }
          />
        )}

        <FareProducts
          fareProducts={preassignedFareProducts}
          onProductSelect={onProductSelect}
        />

        {isTicketTransferEnabled && (
          <View style={styles.transferCode}>
            <ContentHeading
              text={t(TicketingTexts.transferCode.link.heading)}
            />
            <Section style={styles.transferCodeSection}>
              <LinkSectionItem
                text={t(TicketingTexts.transferCode.link.text)}
                accessibility={{
                  accessibilityLabel: t(
                    TicketingTexts.transferCode.link.a11yLabel,
                  ),
                }}
                onPress={onOpenTransferCodeSheet}
              />
            </Section>
            <TransferCodeBottomSheet
              bottomSheetModalRef={transferCodeSheetRef}
              onCloseFocusRef={transferCodeButtonRef}
              onTicketsReceived={onTicketsReceived}
            />
          </View>
        )}
      </View>
    </AnimatedGestureHandlerScrollView>
  ) : null;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingBottom: theme.spacing.medium,
  },
  heading: {
    margin: theme.spacing.medium,
    marginLeft: theme.spacing.xLarge,
    marginTop: theme.spacing.large,
  },
  accountWrongMessage: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  transferCode: {
    padding: theme.spacing.medium,
  },
  transferCodeSection: {
    marginVertical: theme.spacing.small,
  },
}));
