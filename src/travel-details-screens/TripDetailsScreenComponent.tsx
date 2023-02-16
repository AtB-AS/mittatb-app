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
import {MapLeg} from '@atb/components/map';

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

  const tripPatternLegs = tripPattern?.legs.map((leg) => {
    return {
      ...leg,
      mode: !!leg.bookingArrangements ? 'flex' : leg.mode,
    };
  });

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
          tripPatternLegs && (
            <CompactTravelDetailsMap
              mapLegs={tripPatternLegs as MapLeg[]}
              fromPlace={tripPatternLegs[0].fromPlace}
              toPlace={tripPatternLegs[tripPatternLegs.length - 1].toPlace}
              onExpand={() => {
                onPressDetailsMap({
                  legs: tripPatternLegs as MapLeg[],
                  fromPlace: tripPatternLegs[0].fromPlace,
                  toPlace: tripPatternLegs[tripPatternLegs.length - 1].toPlace,
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
                currentDate={tripPatternLegs[0]?.aimedStartTime}
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
  scrollViewContent: {},
  pagination: {
    marginVertical: theme.spacings.medium,
  },
}));
