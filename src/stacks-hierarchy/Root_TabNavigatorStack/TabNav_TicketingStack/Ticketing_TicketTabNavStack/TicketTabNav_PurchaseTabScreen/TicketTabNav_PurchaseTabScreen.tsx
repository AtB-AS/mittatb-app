import {useAuthContext} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {AnonymousPurchaseWarning} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/AnonymousPurchaseWarning';
import {FareProducts} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/FareProducts/FareProducts';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {RecentFareContracts} from './Components/RecentFareContracts/RecentFareContracts';
import {TicketTabNavScreenProps} from '../navigation-types';
import {UpgradeSplash} from './Components/UpgradeSplash';
import {FareProductTypeConfig} from '@atb/modules/configuration';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {FareZoneWithMetadata} from '@atb/fare-zones-selector';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {FareZone} from '@atb/modules/configuration';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import {ErrorWithAccountMessage} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/ErrorWithAccountMessage';
import {useRecentFareContracts} from '@atb/recent-fare-contracts/use-recent-fare-contracts';
import type {RecentFareContractType} from '@atb/recent-fare-contracts';
import {usePurchaseSelectionBuilder} from '@atb/modules/purchase-selection';

type Props = TicketTabNavScreenProps<'TicketTabNav_PurchaseTabScreen'>;

export const TicketTabNav_PurchaseTabScreen = ({navigation}: Props) => {
  const {must_upgrade_ticketing} = useRemoteConfigContext();
  const {authenticationType} = useAuthContext();
  const {theme} = useThemeContext();
  const {
    recentFareContracts,
    isLoading: isLoadingRecentFareContracts,
    refresh: refetchRecentFareContracts,
  } = useRecentFareContracts();
  const {
    data: preassignedFareProducts,
    refetch: refetchPreassignedFareProducts,
    isRefetching: isRefetchingPreassignedFareProducts,
    isPlaceholderData,
  } = useGetFareProductsQuery();
  const selectionBuilder = usePurchaseSelectionBuilder();

  const hasRecentFareContracts = !!recentFareContracts.length;
  const styles = useStyles();
  const analytics = useAnalyticsContext();

  if (must_upgrade_ticketing) return <UpgradeSplash />;

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
      navigation.navigate('Root_LoginRequiredForFareProductScreen', {
        selection,
      });
      return;
    }

    navigation.navigate('Root_PurchaseOverviewScreen', {
      selection,
      transitionOverride: 'slide-from-right',
      mode: 'Ticket',
    });
  };

  const onFareContractSelect = (
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
      .baggageProducts(rfc.baggageProductsWithCount)
      .fromStopPlace(mapPlace(rfc.pointToPointValidity?.fromPlace))
      .toStopPlace(mapPlace(rfc.pointToPointValidity?.toPlace));
    if (rfc.fromFareZone) builder.fromZone(mapZone(rfc.fromFareZone));
    if (rfc.toFareZone) builder.toZone(mapZone(rfc.toFareZone));
    const selection = builder.build();

    navigation.navigate('Root_PurchaseOverviewScreen', {
      selection,
      mode: 'Ticket',
      transitionOverride: 'slide-from-right',
    });
  };

  return authenticationType !== 'none' ? (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingPreassignedFareProducts}
          onRefresh={() => {
            refetchRecentFareContracts();
            refetchPreassignedFareProducts();
            analytics.logEvent('Ticketing', 'Pull to refresh products', {
              fareProductsCount: preassignedFareProducts.length,
              isPlaceholderData,
            });
          }}
        />
      }
    >
      <ErrorWithAccountMessage style={styles.accountWrongMessage} />
      <RecentFareContracts
        recentFareContracts={recentFareContracts}
        loading={isLoadingRecentFareContracts}
        onSelect={onFareContractSelect}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: hasRecentFareContracts
              ? theme.color.background.neutral[2].background
              : undefined,
          },
        ]}
      >
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
      </View>
    </ScrollView>
  ) : null;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacing.medium,
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
}));
