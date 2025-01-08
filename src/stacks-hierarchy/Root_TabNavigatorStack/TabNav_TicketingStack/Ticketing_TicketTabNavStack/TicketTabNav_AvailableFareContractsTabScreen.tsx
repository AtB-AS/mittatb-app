import {StyleSheet} from '@atb/theme';
import {useFareContracts, useTicketingContext} from '@atb/ticketing';
import React, {useCallback, useRef} from 'react';
import {Dimensions, View} from 'react-native';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {useAnalyticsContext} from '@atb/analytics';
import {useTimeContext} from '@atb/time';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {TicketTabNavScreenProps} from './navigation-types';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {usePopOverContext} from '@atb/popover';
import {useOneTimePopover} from '@atb/popover/use-one-time-popover';
import {isElementFullyInsideScreen} from '@atb/utils/is-element-fully-inside-screen';

type Props =
  TicketTabNavScreenProps<'TicketTabNav_AvailableFareContractsTabScreen'>;

export const TicketTabNav_AvailableFareContractsTabScreen = ({
  navigation,
}: Props) => {
  const {
    reservations,
    sentFareContracts,
    isRefreshingFareContracts,
    resubscribeFirestoreListeners,
  } = useTicketingContext();
  const {serverNow} = useTimeContext();
  const analytics = useAnalyticsContext();

  const {fareContracts: availableFareContracts} = useFareContracts(
    {availability: 'available'},
    serverNow,
  );
  const {fareContracts: historicFareContracts} = useFareContracts(
    {availability: 'historic'},
    serverNow,
  );

  const styles = useStyles();
  const {t} = useTranslation();
  const {addPopOver} = usePopOverContext();

  const hasHistoricFareContracts = historicFareContracts.length > 0;

  const hasSentFareContracts = sentFareContracts.length > 0;

  const sentFareContractRef = useRef<View>(null);

  const {isPopOverSeen, setPopOverSeen} = useOneTimePopover();

  // if user has sent fare contracts AND the popOver is not seen yet,
  // the popOver should be shown
  const shouldShowPopOver =
    hasSentFareContracts && !isPopOverSeen('on-behalf-of-sent-tickets-button');

  const showPopOver = useCallback(() => {
    addPopOver({
      oneTimeKey: 'on-behalf-of-sent-tickets-button',
      target: sentFareContractRef,
    });
    setPopOverSeen('on-behalf-of-sent-tickets-button');
  }, [addPopOver, setPopOverSeen]);

  // show popOver when the layout is visible on screen
  if (shouldShowPopOver) {
    if (sentFareContractRef.current) {
      sentFareContractRef.current.measure(
        (x, y, width, height, pageX, pageY) => {
          const window = Dimensions.get('window');
          const isElementVisible = isElementFullyInsideScreen(
            width,
            height,
            pageX,
            pageY,
            window.width,
            window.height,
          );

          if (isElementVisible) {
            showPopOver();
          }
        },
      );
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingFareContracts}
            onRefresh={() => {
              resubscribeFirestoreListeners();
              analytics.logEvent('Ticketing', 'Pull to refresh tickets', {
                reservationsCount: reservations.length,
                availableFareContractsCount: availableFareContracts.length,
              });
            }}
          />
        }
      >
        <FareContractAndReservationsList
          reservations={reservations}
          fareContracts={availableFareContracts}
          now={serverNow}
          showTokenInfo={true}
          emptyStateTitleText={t(
            TicketingTexts.availableFareProductsAndReservationsTab
              .noActiveTicketsTitle,
          )}
          emptyStateDetailsText={t(
            TicketingTexts.availableFareProductsAndReservationsTab
              .noActiveTicketsDetails,
          )}
        />
        <Section>
          {hasHistoricFareContracts && (
            <LinkSectionItem
              text={t(TicketHistoryModeTexts.historic.title)}
              accessibility={{
                accessibilityHint: t(TicketHistoryModeTexts.historic.titleA11y),
              }}
              testID="historicTicketsButton"
              onPress={() =>
                navigation.navigate('Ticketing_TicketHistoryScreen', {
                  mode: 'historic',
                })
              }
            />
          )}

          {hasSentFareContracts && (
            <LinkSectionItem
              ref={sentFareContractRef}
              text={t(TicketHistoryModeTexts.sent.title)}
              accessibility={{
                accessibilityHint: t(TicketHistoryModeTexts.sent.titleA11y),
              }}
              testID="sentToOthersButton"
              onPress={() =>
                navigation.navigate('Ticketing_TicketHistoryScreen', {
                  mode: 'sent',
                })
              }
            />
          )}
        </Section>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  content: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.large,
  },
}));
