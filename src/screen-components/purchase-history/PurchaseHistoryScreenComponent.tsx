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
import React, {useCallback, useMemo} from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {FareContractOrReservation} from '@atb/modules/fare-contracts';
import {EmptyState} from '@atb/components/empty-state';
import {ThemedTicketTilted} from '@atb/theme/ThemedAssets';
import {sortFcOrReservationByCreation} from '@atb/modules/fare-contracts';
import {FareContractType} from '@atb-as/utils';
import {ThemeText} from '@atb/components/text';

type Props = {
  onPressFareContract: (fareContractId: string) => void;
  onNavigateToBonusScreen: () => void;
};

export const PurchaseHistoryScreenComponent = ({
  onPressFareContract,
  onNavigateToBonusScreen,
}: Props) => {
  const {sentFareContracts, reservations, rejectedReservations} =
    useTicketingContext();
  const {serverNow} = useTimeContext();
  const analytics = useAnalyticsContext();
  const {fareContracts: historicalFareContracts} = useFareContracts(
    {availability: 'historical'},
    serverNow,
  );
  const {abtCustomerId: customerAccountId} = useAuthContext();

  const {t} = useTranslation();
  const styles = useStyles();

  const fareContractsToShow = sentFareContracts.concat(historicalFareContracts);
  const reservationsToShow = getReservationsToShow(
    reservations,
    rejectedReservations,
    customerAccountId,
  );

  const sections = useMemo(
    () => groupByYear([...fareContractsToShow, ...reservationsToShow]),
    [fareContractsToShow, reservationsToShow],
  );

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
      />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.created + item.orderId}
        renderSectionHeader={({section}) => (
          <ThemeText
            typography="body__m"
            color="secondary"
            style={styles.sectionHeader}
          >
            {section.year}
          </ThemeText>
        )}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            title={t(TicketingTexts.purchaseHistory.emptyState.title)}
            details={t(TicketingTexts.purchaseHistory.emptyState.description)}
            illustrationComponent={<ThemedTicketTilted height={84} />}
            testID="fareContracts"
          />
        }
        contentContainerStyle={styles.sectionListContent}
        testID="ticketHistoryScrollView"
        stickySectionHeadersEnabled={false}
        // Optimizations for large lists
        windowSize={7}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        scrollEventThrottle={16}
      />
    </View>
  );
};

type YearSection = {
  year: number;
  data: (Reservation | FareContractType)[];
};

const groupByYear = (
  items: (Reservation | FareContractType)[],
): YearSection[] => {
  const sortedItems = sortFcOrReservationByCreation(items);
  const sections: YearSection[] = [];
  let currentSection: YearSection | null = null;

  for (const item of sortedItems) {
    const d = new Date(item.created);
    const year = d.getFullYear();

    if (!currentSection || currentSection.year !== year) {
      currentSection = {year, data: []};
      sections.push(currentSection);
    }

    currentSection.data.push(item);
  }

  return sections;
};

const getReservationsToShow = (
  reservations: Reservation[],
  rejectedReservations: Reservation[],
  customerAccountId?: string,
) => {
  const reservationsToShow: Reservation[] = [];

  // only show reservations for tickets sent to others
  reservationsToShow.push(
    ...reservations.filter(
      (reservation) => reservation.customerAccountId !== customerAccountId,
    ),
  );

  // only show rejected reservations for tickets purchesed for own account
  reservationsToShow.push(
    ...rejectedReservations.filter(
      (reservation) => reservation.customerAccountId === customerAccountId,
    ),
  );

  return reservationsToShow;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  sectionListContent: {
    gap: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.large,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.small,
  },
}));
