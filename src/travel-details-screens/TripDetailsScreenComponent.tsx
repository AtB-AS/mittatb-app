import {TripPattern} from '@atb/api/types/trips';
import {ContentWithDisappearingHeader} from '@atb/components/disappearing-header';
import {ScreenHeader} from '@atb/components/screen-header';
import PaginatedDetailsHeader from '@atb/travel-details-screens/components/PaginatedDetailsHeader';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Trip from './components/Trip';
import {
  CompactTravelDetailsMap,
  TravelDetailsMapScreenParams,
} from '@atb/travel-details-map-screen';
import {useCurrentTripPatternWithUpdates} from '@atb/travel-details-screens/use-current-trip-pattern-with-updates';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {Button} from '@atb/components/button';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import {useFromTravelSearchToTicketEnabled} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use_from_travel_search_to_ticket_enabled';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type TripDetailsScreenParams = {
  tripPatterns: TripPattern[];
  startIndex?: number;
};

type Props = TripDetailsScreenParams & {
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
  onPressDeparture: (items: ServiceJourneyDeparture[], index: number) => void;
};

export const TripDetailsScreenComponent = ({
  tripPatterns,
  startIndex,
  onPressDetailsMap,
  onPressDeparture,
  onPressQuay,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyle();

  const [currentIndex, setCurrentIndex] = useState(startIndex ?? 0);

  const {tripPattern, error} = useCurrentTripPatternWithUpdates(
    currentIndex,
    tripPatterns,
  );
  const fromTripsSearchToTicketEnabled = useFromTravelSearchToTicketEnabled();

  function navigate(page: number) {
    const newIndex = page - 1;
    if (page > tripPatterns.length || page < 1 || currentIndex === newIndex) {
      return;
    }
    setCurrentIndex(newIndex);
  }

  const {top: paddingTop} = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop}]}>
        <ScreenHeader
          leftButton={{type: 'back'}}
          title={t(TripDetailsTexts.header.title)}
          color={themeColor}
        />
      </View>
      <ContentWithDisappearingHeader
        header={
          tripPattern?.legs && (
            <CompactTravelDetailsMap
              mapLegs={tripPattern.legs}
              fromPlace={tripPattern.legs[0].fromPlace}
              toPlace={tripPattern.legs[tripPattern.legs.length - 1].toPlace}
              onExpand={() => {
                onPressDetailsMap({
                  legs: tripPattern.legs,
                  fromPlace: tripPattern.legs[0].fromPlace,
                  toPlace:
                    tripPattern.legs[tripPattern.legs.length - 1].toPlace,
                });
              }}
            />
          )
        }
      >
        {tripPattern && (
          <View style={styles.paddedContainer} testID="tripDetailsContentView">
            {tripPatterns.length > 1 && (
              <PaginatedDetailsHeader
                page={currentIndex + 1}
                totalPages={tripPatterns.length}
                onNavigate={navigate}
                style={styles.pagination}
                currentDate={tripPattern.legs[0]?.aimedStartTime}
              />
            )}
            <Trip
              tripPattern={tripPattern}
              error={error}
              onPressDeparture={onPressDeparture}
              onPressQuay={onPressQuay}
            />
          </View>
        )}
      </ContentWithDisappearingHeader>
      {fromTripsSearchToTicketEnabled && (
        <View style={styles.borderTop}>
          <Button
            accessibilityRole={'button'}
            accessibilityLabel={t(TripDetailsTexts.trip.buyTicket.a11yLabel)}
            onPress={() => {}}
            type="block"
            text={t(TripDetailsTexts.trip.buyTicket.text)}
            rightIcon={{svg: Ticket}}
            style={styles.purchaseButtonAccessible}
          />
        </View>
      )}
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.static.background[themeColor].background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_0.background,
  },
  paddedContainer: {
    paddingHorizontal: theme.spacings.medium,
  },
  purchaseButton: {
    position: 'absolute',
    marginHorizontal: theme.spacings.large,
    marginBottom: theme.spacings.large,
    bottom: 0,
    right: 0,
    shadowRadius: theme.spacings.small,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 3,
  },
  purchaseButtonAccessible: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacings.medium,
    marginVertical: theme.spacings.xSmall,
    flexDirection: 'row',
  },
  borderTop: {
    borderTopColor: theme.border.primary,
    borderTopWidth: theme.border.width.slim,
  },
  pagination: {
    marginVertical: theme.spacings.medium,
  },
}));
