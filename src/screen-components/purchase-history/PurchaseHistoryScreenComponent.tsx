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
import React, {useMemo} from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {FareContractOrReservation} from '@atb/modules/fare-contracts';
import {EmptyState} from '@atb/components/empty-state';
import {ThemedTicketTilted} from '@atb/theme/ThemedAssets';
import {sortFcOrReservationByCreation} from '@atb/modules/fare-contracts';
import {FareContractType} from '@atb-as/utils';
import {ThemeText} from '@atb/components/text';
import {formatToMonthAndYear} from '@atb/utils/date';

type Props = {
  onPressFareContract: (fareContractId: string) => void;
  navigateToBonusScreen: () => void;
};

export const PurchaseHistoryScreenComponent = ({
  onPressFareContract,
  navigateToBonusScreen,
}: Props) => {
  const {language} = useTranslation();
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
    () => groupByMonth([...fareContractsToShow, ...reservationsToShow]),
    [fareContractsToShow, reservationsToShow],
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
            {formatToMonthAndYear(section.month, language)}
          </ThemeText>
        )}
        renderItem={({item, index}) => (
          <FareContractOrReservation
            navigateToBonusScreen={navigateToBonusScreen}
            now={serverNow}
            onPressFareContract={() => {
              // Reservations don't have `id`, but also don't show the link to
              // ticket details.
              if ('id' in item) {
                analytics.logEvent('Ticketing', 'Ticket details clicked');
                onPressFareContract(item.id);
              }
            }}
            fcOrReservation={item}
            index={index}
          />
        )}
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
      />
    </View>
  );
};

type MonthSection = {
  month: Date;
  data: (Reservation | FareContractType)[];
};

const groupByMonth = (
  items: (Reservation | FareContractType)[],
): MonthSection[] => {
  const sortedItems = sortFcOrReservationByCreation(items);
  const sections: MonthSection[] = [];
  let currentSection: MonthSection | null = null;

  for (const item of sortedItems) {
    const d = new Date(item.created);
    const monthDate = new Date(d.getFullYear(), d.getMonth(), 1);

    if (
      !currentSection ||
      currentSection.month.getTime() !== monthDate.getTime()
    ) {
      currentSection = {month: monthDate, data: []};
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
