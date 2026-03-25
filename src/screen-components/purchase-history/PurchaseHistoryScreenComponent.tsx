import {StyleSheet} from '@atb/theme';
import {
  Reservation,
  useFareContracts,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {useTimeContext} from '@atb/modules/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {useAuthContext} from '@atb/modules/auth';
import React, {Ref, useCallback, useMemo} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {FareContractOrReservation} from '@atb/modules/fare-contracts';
import {EmptyState} from '@atb/components/empty-state';
import {ThemedTicketTilted} from '@atb/theme/ThemedAssets';
import {sortFcOrReservationByCreation} from '@atb/modules/fare-contracts';
import {FareContractType} from '@atb-as/utils';
import {ThemeText} from '@atb/components/text';
import {ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

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
  const {sentFareContracts, reservations, rejectedReservations} =
    useTicketingContext();
  const {serverNow} = useTimeContext(
    isFocused ? ONE_SECOND_MS * 5 : ONE_MINUTE_MS,
  );
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
    <FullScreenView
      headerProps={{
        title: t(TicketingTexts.purchaseHistory.title),
        leftButton: {type: 'back'},
      }}
      headerContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(TicketingTexts.purchaseHistory.title)}
        />
      )}
      focusRef={focusRef}
    >
      <View style={styles.container}>
        <View
          style={styles.sectionListContent}
          testID="ticketHistoryScrollView"
        >
          {sections.length === 0 ? (
            <EmptyState
              title={t(TicketingTexts.purchaseHistory.emptyState.title)}
              details={t(TicketingTexts.purchaseHistory.emptyState.description)}
              illustrationComponent={<ThemedTicketTilted height={84} />}
              testID="fareContracts"
            />
          ) : (
            sections.map((section) => (
              <View key={section.year} style={styles.section}>
                <ThemeText
                  typography="body__m"
                  color="secondary"
                  style={styles.sectionHeader}
                >
                  {section.year}
                </ThemeText>
                {section.data.map((item, index) => (
                  <View key={item.created + item.orderId}>
                    {renderItem({item, index})}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </View>
    </FullScreenView>
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
  section: {
    gap: theme.spacing.medium,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.medium,
  },
}));
