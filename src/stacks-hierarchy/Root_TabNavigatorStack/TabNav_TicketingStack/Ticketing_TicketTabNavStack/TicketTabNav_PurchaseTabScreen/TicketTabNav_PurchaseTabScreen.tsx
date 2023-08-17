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
import {useTipsAndInformationEnabled} from '@atb/stacks-hierarchy/Root_TipsAndInformation/use-tips-and-information-enabled';
import {useTicketingAssistantEnabled} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/use-ticketing-assistant-enabled';
import {TipsAndInformationTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Assistant/TipsAndInformationTile';
import {TicketAssistantTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Assistant/TicketAssistantTile';
import {useAnalytics} from '@atb/analytics';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {findInspectable, isMobileToken} from '@atb/mobile-token/utils';
import {ThemeText} from '@atb/components/text';
import {TicketingTexts, useTranslation} from '@atb/translations';

type Props = TicketTabNavScreenProps<'TicketTabNav_PurchaseTabScreen'>;

export const TicketTabNav_PurchaseTabScreen = ({navigation}: Props) => {
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();
  const {abtCustomerId, authenticationType} = useAuthState();
  const isSignedInAsAbtCustomer = !!abtCustomerId;
  const {theme} = useTheme();
  const {recentFareContracts, loading} = useRecentFareContracts();
  const hasRecentFareContracts =
    enable_recent_tickets && !!recentFareContracts.length;
  const styles = useStyles();
  const {t} = useTranslation();

  const showTipsAndInformation = useTipsAndInformationEnabled();
  const showTicketAssistant = useTicketingAssistantEnabled();
  const analytics = useAnalytics();

  const {remoteTokens} = useMobileTokenContextState();
  const inspectableToken = findInspectable(remoteTokens);
  const hasInspectableMobileToken = isMobileToken(inspectableToken);

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
          afterLogin: {
            screen: 'Root_ActiveTokenOnPhoneRequiredForFareProductScreen',
            params: {
              nextScreen: {
                screen: 'Root_PurchaseOverviewScreen',
                params: {
                  fareProductTypeConfig,
                  mode: 'Ticket',
                },
              },
            },
          },
        });
        return;
      }

      if (fareProductTypeConfig.configuration.requiresLogin) {
        navigation.navigate('Root_LoginRequiredForFareProductScreen', {
          fareProductTypeConfig,
          afterLogin: {
            screen: 'Root_PurchaseOverviewScreen',
            params: {
              fareProductTypeConfig,
              mode: 'Ticket',
            },
          },
        });
        return;
      }
    } else {
      if (
        fareProductTypeConfig.configuration.requiresTokenOnMobile &&
        !hasInspectableMobileToken
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
    }

    navigation.navigate('Root_PurchaseOverviewScreen', {
      fareProductTypeConfig: fareProductTypeConfig,
      mode: 'Ticket',
    });
  };

  const onFareContractSelect = (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
  ) => {
    analytics.logEvent('Ticketing', 'Recently used fare product selected', {
      type: fareProductTypeConfig.type,
    });
    navigation.navigate('Root_PurchaseOverviewScreen', {
      fareProductTypeConfig,
      preassignedFareProduct: rfc.preassignedFareProduct,
      userProfilesWithCount: rfc.userProfilesWithCount,
      fromPlace: rfc.fromTariffZone && {
        ...rfc.fromTariffZone,
        resultType: 'zone',
      },
      toPlace: rfc.toTariffZone && {
        ...rfc.toTariffZone,
        resultType: 'zone',
      },
      mode: 'Ticket',
    });
  };

  return isSignedInAsAbtCustomer ? (
    <ScrollView>
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
              ? theme.static.background.background_2.background
              : undefined,
          },
        ]}
      >
        {authenticationType !== 'phone' && (
          <AnonymousPurchaseWarning
            onPress={() =>
              navigation.navigate('Root_PurchaseAsAnonymousConsequencesScreen')
            }
          />
        )}

        {showTipsAndInformation && (
          <TipsAndInformationTile
            onPress={() => {
              navigation.navigate('Root_TipsAndInformation');
            }}
            testID="tipsAndInformation"
          />
        )}
        <FareProducts onProductSelect={onProductSelect} />
        {showTicketAssistant && (
          <>
            <ThemeText style={styles.heading} type={'body__secondary'}>
              {t(TicketingTexts.ticketAssistantTile.title)}
            </ThemeText>
            <TicketAssistantTile
              onPress={() => {
                analytics.logEvent('Ticketing', 'Ticket assistant opened');
                navigation.navigate('Root_TicketAssistantStack');
              }}
              testID="ticketAssistant"
            />
          </>
        )}
      </View>
    </ScrollView>
  ) : null;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacings.medium,
  },
  heading: {
    margin: theme.spacings.medium,
    marginLeft: theme.spacings.xLarge,
  },
}));
