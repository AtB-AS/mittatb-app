import {TripPattern} from '@atb/api/types/trips';
import ContentWithDisappearingHeader from '@atb/components/disappearing-header/content';
import Header from '@atb/components/screen-header';
import PaginatedDetailsHeader from '@atb/screens/TripDetails/components/PaginatedDetailsHeader';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Trip from '../components/Trip';
import CompactMap from '../Map/CompactMap';
import {TripDetailsScreenProps} from '../types';
import {useCurrentTripPatternWithUpdates} from '@atb/screens/TripDetails/Details/use-current-trip-pattern-with-updates';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type DetailsRouteParams = {
  tripPatterns: TripPattern[];
  startIndex?: number;
};

type Props = TripDetailsScreenProps<'Details'>;
const Details: React.FC<Props> = (props) => {
  const {
    params: {tripPatterns, startIndex},
  } = props.route;
  const {t} = useTranslation();
  const styles = useStyle();

  const [currentIndex, setCurrentIndex] = useState(startIndex ?? 0);

  const {tripPattern, error} = useCurrentTripPatternWithUpdates(
    currentIndex,
    tripPatterns,
  );

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
        <Header
          leftButton={{type: 'back'}}
          title={t(TripDetailsTexts.header.title)}
          color={themeColor}
        />
      </View>
      <ContentWithDisappearingHeader
        header={
          tripPattern?.legs && (
            <CompactMap
              mapLegs={tripPattern.legs}
              fromPlace={tripPattern.legs[0].fromPlace}
              toPlace={tripPattern.legs[tripPattern.legs.length - 1].toPlace}
              onExpand={() => {
                props.navigation.navigate('DetailsMap', {
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
                currentDate={tripPattern.legs[0]?.expectedStartTime}
              />
            )}
            <Trip tripPattern={tripPattern} error={error} />
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

export default Details;
