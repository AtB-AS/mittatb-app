import {StyleSheet} from '@atb/theme';
import {
  Reservation,
  useFareContracts,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {useTimeContext} from '@atb/modules/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {SectionList, View} from 'react-native';
import {useAuthContext} from '@atb/modules/auth';
import React, {Ref, useCallback, useMemo} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  FareContractOrReservation,
  sortFcOrReservationByCreation,
} from '@atb/modules/fare-contracts';
import {EmptyState} from '@atb/components/empty-state';
import {ThemedTicketTilted} from '@atb/theme/ThemedAssets';
import {FareContractType} from '@atb-as/utils';
import {ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ContentHeading} from '@atb/components/heading';

type Props = {
  onPressFareContract: (fareContractId: string) => void;
  onNavigateToBonusScreen: () => void;
  isFocused: boolean;
  focusRef: Ref<any>;
};

export const PurchaseHistoryScreenComponent = ({
  onPressFareContract,
  onNavigateToBonusScreen,
  isFocused,
  focusRef,
}: Props) => {
  const analytics = useAnalyticsContext();
  const {t} = useTranslation();
  const styles = useStyles();
  const {serverNow} = useTimeContext(
    isFocused ? ONE_SECOND_MS * 5 : ONE_MINUTE_MS,
  );

  const sections = useSectionsByYear(serverNow);

  const renderItem = useCallback(
    ({item, index}: {item: Reservation | FareContractType; index: number}) => (
      <FareContractOrReservation
        onNavigateToBonusScreen={onNavigateToBonusScreen}
        now={serverNow}
        onPressFareContract={() => {
          if ('id' in item) {
            analytics.logEvent('Ticketing', 'Ticket details clicked');
            onPressFareContract(item.id);
          }
        }}
        fcOrReservation={item}
        index={index}
      />
    ),
    [analytics, onNavigateToBonusScreen, onPressFareContract, serverNow],
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketingTexts.purchaseHistory.title)}
        leftButton={{type: 'back'}}
        focusRef={focusRef}
      />
      <SectionList
        contentContainerStyle={styles.sectionListContent}
        sections={sections}
        keyExtractor={(item) => `${item.created.getTime()}-${item.orderId}`}
        renderItem={renderItem}
        renderSectionHeader={({section}) => (
          <ContentHeading text={section.year.toString()} />
        )}
        stickySectionHeadersEnabled={false}
        initialNumToRender={10}
        windowSize={7}
        maxToRenderPerBatch={3}
        scrollEventThrottle={16}
        testID="ticketHistoryScrollView"
        ListEmptyComponent={
          <EmptyState
            title={t(TicketingTexts.purchaseHistory.emptyState.title)}
            details={t(TicketingTexts.purchaseHistory.emptyState.description)}
            illustrationComponent={<ThemedTicketTilted height={84} />}
            testID="fareContracts"
          />
        }
      />
    </View>
  );
};

type YearSection = {
  year: number;
  data: (Reservation | FareContractType)[];
};

const useSectionsByYear = (serverNow: number): YearSection[] => {
  const {abtCustomerId: customerAccountId} = useAuthContext();
  const {fareContracts: historicalFareContracts} = useFareContracts(
    {availability: 'historical'},
    serverNow,
  );
  const {sentFareContracts, reservations, rejectedReservations} =
    useTicketingContext();

  return useMemo(() => {
    const sortedItems = sortFcOrReservationByCreation([
      ...historicalFareContracts,
      ...sentFareContracts,
      // only reservations for tickets sent to others
      ...reservations.filter((r) => r.customerAccountId !== customerAccountId),
      // only show rejected reservations for tickets purchased for own account
      ...rejectedReservations.filter(
        (r) => r.customerAccountId === customerAccountId,
      ),
    ]);

    const sections: YearSection[] = [];
    let currentSection: YearSection | null = null;

    for (const item of sortedItems) {
      const year = item.created.getFullYear();
      if (!currentSection || currentSection.year !== year) {
        currentSection = {year, data: []};
        sections.push(currentSection);
      }
      currentSection.data.push(item);
    }

    return sections;
  }, [
    sentFareContracts,
    historicalFareContracts,
    reservations,
    rejectedReservations,
    customerAccountId,
  ]);
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  sectionListContent: {
    gap: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
}));
