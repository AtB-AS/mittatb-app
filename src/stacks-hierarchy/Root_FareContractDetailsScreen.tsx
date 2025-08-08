import {FullScreenHeader, useTicketInfo} from '@atb/components/screen-header';
import {DetailsContent} from '@atb/modules/fare-contracts';
import {useApplePassPresentationSuppression} from '@atb/modules/native-bridges';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  FareContractTexts,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackScreenProps} from '../stacks-hierarchy/navigation-types';
import {useTimeContext} from '@atb/modules/time';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {MapFilterType} from '@atb/modules/map';
import {useAuthContext} from '@atb/modules/auth';
import {ErrorBoundary} from '@atb/screen-components/error-boundary';
import {hasShmoBookingId} from '@atb/modules/fare-contracts';

type Props = RootStackScreenProps<'Root_FareContractDetailsScreen'>;

export function Root_FareContractDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {enable_ticket_information} = useRemoteConfigContext();
  const {serverNow} = useTimeContext();
  const analytics = useAnalyticsContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {ticketInfoParams, fareContract, preassignedFareProduct} =
    useTicketInfo(route.params.fareContractId);

  useEffect(() => {
    console.log('FareContract: ', fareContract);
  }, [fareContract]);

  const isSentFareContract =
    fareContract?.customerAccountId !== fareContract?.purchasedBy &&
    fareContract?.purchasedBy === currentUserId;

  useApplePassPresentationSuppression();

  const navigateToTicketInfoScreen = () => {
    if (ticketInfoParams) {
      analytics.logEvent(
        'Ticketing',
        'Ticket information button clicked',
        ticketInfoParams,
      );
      navigation.navigate('Root_TicketInformationScreen', ticketInfoParams);
    }
  };
  const onNavigateToMap = async (initialFilters: MapFilterType) => {
    navigation.navigate('Root_TabNavigatorStack', {
      screen: 'TabNav_MapStack',
      params: {
        screen: 'Map_RootScreen',
        params: {initialFilters},
      },
    });
  };
  const onReceiptNavigate = () =>
    fareContract &&
    navigation.push('Root_ReceiptScreen', {
      orderId: fareContract.orderId,
      orderVersion: fareContract.version,
    });

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
        rightButton={
          enable_ticket_information && !hasShmoBookingId(fareContract)
            ? {
                type: 'info',
                onPress: navigateToTicketInfoScreen,
                color: theme.color.background.accent[0],
                accessibilityHint: t(
                  FareContractTexts.details.infoButtonA11yHint,
                ),
              }
            : undefined
        }
        title={t(FareContractTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fareContract && (
          <ErrorBoundary
            message={t(
              TicketingTexts.scrollView.errorLoadingTicket(
                fareContract.orderId,
              ),
            )}
          >
            <DetailsContent
              fareContract={fareContract}
              preassignedFareProduct={preassignedFareProduct}
              now={serverNow}
              isSentFareContract={isSentFareContract}
              onReceiptNavigate={onReceiptNavigate}
              onNavigateToMap={onNavigateToMap}
            />
          </ErrorBoundary>
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[2].background,
  },
  content: {
    padding: theme.spacing.medium,
    paddingBottom: theme.spacing.xLarge,
  },
}));
