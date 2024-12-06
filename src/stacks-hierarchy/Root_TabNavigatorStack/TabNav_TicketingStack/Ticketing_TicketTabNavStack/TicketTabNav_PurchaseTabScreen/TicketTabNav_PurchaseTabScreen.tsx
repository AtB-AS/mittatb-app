import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {AnonymousPurchaseWarning} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/AnonymousPurchaseWarning';
import {FareProducts} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/FareProducts/FareProducts';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {RecentFareContracts} from './Components/RecentFareContracts/RecentFareContracts';
import {TicketTabNavScreenProps} from '../navigation-types';
import {UpgradeSplash} from './Components/UpgradeSplash';
import {useRecentFareContracts} from './use-recent-fare-contracts';
import {FareProductTypeConfig} from '@atb/configuration';
import {RecentFareContract} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/types';
import {useAnalytics} from '@atb/analytics';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {TariffZone} from '@atb/configuration';
import {TransitionPresets} from '@react-navigation/stack';
import {useGetFareProductsQuery} from '@atb/ticketing/use-get-fare-products-query';
import {ErrorWithAccountMessage} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/ErrorWithAccountMessage.tsx';

type Props = TicketTabNavScreenProps<'TicketTabNav_PurchaseTabScreen'>;

export const TicketTabNav_PurchaseTabScreen = ({navigation}: Props) => {
  const {must_upgrade_ticketing} = useRemoteConfig();
  const {authenticationType} = useAuthState();
  const {theme} = useTheme();
  const {recentFareContracts, loading} = useRecentFareContracts();
  const {data: fareProducts} = useGetFareProductsQuery();

  const hasRecentFareContracts = !!recentFareContracts.length;
  const styles = useStyles();
  const analytics = useAnalytics();

  const {tokens, mobileTokenStatus} = useMobileTokenContextState();
  const inspectableToken = tokens.find((t) => t.isInspectable);
  const hasInspectableMobileToken = inspectableToken?.type === 'mobile';
  const hasMobileTokenError =
    mobileTokenStatus === 'fallback' || mobileTokenStatus === 'error';

  if (must_upgrade_ticketing) return <UpgradeSplash />;

  const onProductSelect = (fareProductTypeConfig: FareProductTypeConfig) => {
    analytics.logEvent('Ticketing', 'Fare product selected', {
      type: fareProductTypeConfig.type,
    });

    if (authenticationType !== 'phone') {
      if (
        fareProductTypeConfig.configuration.requiresLogin &&
        fareProductTypeConfig.configuration.requiresTokenOnMobile &&
        !hasInspectableMobileToken
      ) {
        navigation.navigate('Root_LoginRequiredForFareProductScreen', {
          fareProductTypeConfig,
        });
        return;
      }

      if (fareProductTypeConfig.configuration.requiresLogin) {
        navigation.navigate('Root_LoginRequiredForFareProductScreen', {
          fareProductTypeConfig,
        });
        return;
      }
    } else if (
      fareProductTypeConfig.configuration.requiresTokenOnMobile &&
      !hasInspectableMobileToken &&
      !hasMobileTokenError
    ) {
      navigation.navigate(
        'Root_ActiveTokenOnPhoneRequiredForFareProductScreen',
        {
          nextScreen: {
            screen: 'Root_PurchaseOverviewScreen',
            params: {
              fareProductTypeConfig,
              mode: 'Ticket',
            },
          },
        },
      );
      return;
    }

    navigation.navigate('Root_PurchaseOverviewScreen', {
      fareProductTypeConfig: fareProductTypeConfig,
      mode: 'Ticket',
    });
  };

  const onFareContractSelect = (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
    harbors?: StopPlaceFragment[],
  ) => {
    analytics.logEvent('Ticketing', 'Recently used fare product selected', {
      type: fareProductTypeConfig.type,
    });
    const getPlace = (
      pointToPointValidityPlace: string | undefined,
      zone: TariffZone | undefined,
    ): TariffZoneWithMetadata | StopPlaceFragment | undefined => {
      if (pointToPointValidityPlace !== undefined) {
        const fromName = harbors?.find(
          (sp) => sp.id === pointToPointValidityPlace,
        )?.name;
        return fromName
          ? {
              id: pointToPointValidityPlace,
              name: fromName,
            }
          : undefined;
      } else if (zone !== undefined) {
        return {...zone, resultType: 'zone'};
      }
    };
    navigation.navigate('Root_PurchaseOverviewScreen', {
      fareProductTypeConfig,
      preassignedFareProduct: rfc.preassignedFareProduct,
      userProfilesWithCount: rfc.userProfilesWithCount,
      fromPlace: getPlace(
        rfc.pointToPointValidity?.fromPlace,
        rfc.fromTariffZone,
      ),
      toPlace: getPlace(rfc.pointToPointValidity?.toPlace, rfc.toTariffZone),
      mode: 'Ticket',
    });
  };

  return authenticationType !== 'none' ? (
    <ScrollView>
      <ErrorWithAccountMessage style={styles.accountWrongMessage} />
      <RecentFareContracts
        recentFareContracts={recentFareContracts}
        loading={loading}
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
                  transitionPreset: TransitionPresets.ModalSlideFromBottomIOS,
                },
              )
            }
          />
        )}

        <FareProducts
          fareProducts={fareProducts}
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
