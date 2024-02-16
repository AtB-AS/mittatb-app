import {StyleSheet} from '@atb/theme';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  filterExpiredFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import React, {useCallback, useRef} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {useAnalytics} from '@atb/analytics';
import {useTimeContextState} from '@atb/time';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {TicketTabNavScreenProps} from './navigation-types';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import {usePopOver} from '@atb/popover';
import {useOneTimePopover} from '@atb/popover/use-one-time-popover';

type Props =
  TicketTabNavScreenProps<'TicketTabNav_ActiveFareProductsTabScreen'>;

export const TicketTabNav_ActiveFareProductsTabScreen = ({
  navigation,
}: Props) => {
  const {
    reservations,
    sentFareContracts,
    fareContracts,
    isRefreshingFareContracts,
    resubscribeFirestoreListeners,
  } = useTicketingState();
  const {serverNow} = useTimeContextState();
  const analytics = useAnalytics();

  const activeFareContracts = filterAndSortActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );

  const styles = useStyles();
  const {t} = useTranslation();
  const {addPopOver} = usePopOver();

  const hasExpiredFareContracts =
    filterExpiredFareContracts(fareContracts, serverNow).length > 0;

  const hasSentFareContracts = sentFareContracts.length > 0;

  const sentFareContractRef = useRef(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const {isPopOverSeen, setPopOverSeen} = useOneTimePopover();

  // if user has sent fare contracts AND the popOver is not seen yet,
  // the popOver should be shown
  const shouldShowPopOver =
    hasSentFareContracts && !isPopOverSeen('on-behalf-of-first-time-purchase');

  const showPopOver = useCallback(() => {
    addPopOver({
      oneTimeKey: 'on-behalf-of-first-time-purchase',
      target: sentFareContractRef,
    });
    setPopOverSeen('on-behalf-of-first-time-purchase');
  }, [addPopOver, setPopOverSeen]);

  useFocusEffect(
    useCallback(() => {
      if (shouldShowPopOver) {
        // Check if the button for tickets sent to others is visible on screen or not
        if (sentFareContractRef.current) {
          const currentView = sentFareContractRef.current as View;
          currentView.measure((x, y, width, height, pageX, pageY) => {
            const rectTop = pageX;
            const rectBottom = pageY + height;
            const rectWidth = pageX + width;
            const window = Dimensions.get('window');
            const isVisible =
              rectBottom != 0 &&
              rectTop >= 0 &&
              rectBottom <= window.height &&
              rectWidth > 0 &&
              rectWidth <= window.width;

            // if layout is visible : show pop over
            // else : scroll to bottom, and then show pop over (see handleScrollEvent)
            if (isVisible) {
              showPopOver();
            } else {
              scrollViewRef.current?.scrollToEnd({animated: true});
            }
          });
        }
      }
    }, [shouldShowPopOver, showPopOver]),
  );

  // show popover when it reaches the end of scrollview
  const handleScrollEvent = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (shouldShowPopOver) {
      const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height) {
        showPopOver();
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScrollEvent}
        scrollEventThrottle={0} // this will make the onScroll event sent only once
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingFareContracts}
            onRefresh={() => {
              resubscribeFirestoreListeners();
              analytics.logEvent('Ticketing', 'Pull to refresh tickets', {
                reservationsCount: reservations.length,
                activeFareContractsCount: activeFareContracts.length,
              });
            }}
          />
        }
      >
        <FareContractAndReservationsList
          reservations={reservations}
          fareContracts={activeFareContracts}
          now={serverNow}
          showTokenInfo={true}
          emptyStateTitleText={t(
            TicketingTexts.activeFareProductsAndReservationsTab
              .noActiveTicketsTitle,
          )}
          emptyStateDetailsText={t(
            TicketingTexts.activeFareProductsAndReservationsTab
              .noActiveTicketsDetails,
          )}
        />
        <Section>
          {hasExpiredFareContracts && (
            <LinkSectionItem
              text={t(TicketHistoryModeTexts.expired.title)}
              accessibility={{
                accessibilityHint: t(TicketHistoryModeTexts.expired.titleA11y),
              }}
              testID="expiredTicketsButton"
              onPress={() =>
                navigation.navigate('Ticketing_TicketHistoryScreen', {
                  mode: 'expired',
                })
              }
            />
          )}

          {hasSentFareContracts && (
            <View ref={sentFareContractRef} collapsable={false}>
              <LinkSectionItem
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
            </View>
          )}
        </Section>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  content: {
    padding: theme.spacings.medium,
  },
}));
