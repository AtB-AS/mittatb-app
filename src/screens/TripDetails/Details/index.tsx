import {singleTripSearch} from '@atb/api/trips_v2';
import {TripPattern} from '@atb/api/types/trips';
import ContentWithDisappearingHeader from '@atb/components/disappearing-header/content';
import Header from '@atb/components/screen-header';
import PaginatedDetailsHeader from '@atb/screens/TripDetails/components/PaginatedDetailsHeader';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import usePollableResource from '@atb/utils/use-pollable-resource';
import {useIsFocused} from '@react-navigation/native';
import Axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Trip from '../components/Trip';
import CompactMap from '../Map/CompactMap';
import {TripDetailsScreenProps} from '../types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type DetailsRouteParams = {
  tripPatterns?: TripPattern[];
  startIndex?: number;
};

type Props = TripDetailsScreenProps<'Details'>;
const Details: React.FC<Props> = (props) => {
  const {
    params: {tripPatterns: initialTripPatterns, startIndex},
  } = props.route;
  const {theme} = useTheme();
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const styles = useStyle();

  const [currentIndex, setCurrentIndex] = useState<number>(startIndex ?? 0);

  const [tripPattern, setTripPattern] = useState<TripPattern | undefined>(
    initialTripPatterns ? initialTripPatterns[currentIndex] : undefined,
  );
  const [updatedTripPattern, , loading, error] = useTripPattern(
    currentIndex,
    initialTripPatterns ? initialTripPatterns[currentIndex] : undefined,
    !isFocused,
  );
  const tripPatterns = initialTripPatterns ?? [updatedTripPattern];

  const showActivityIndicator = (!tripPattern && !error) || loading;

  useEffect(() => {
    const initialPatternForPage = tripPatterns[currentIndex];
    if (initialPatternForPage) {
      setTripPattern(
        updatedTripPattern?.compressedQuery ===
          initialPatternForPage.compressedQuery
          ? updatedTripPattern
          : initialPatternForPage,
      );
    } else if (updatedTripPattern) {
      setTripPattern(updatedTripPattern);
    }
  }, [currentIndex, updatedTripPattern]);

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
        {showActivityIndicator && (
          <ActivityIndicator
            style={styles.activityIndicator}
            color={theme.text.colors.disabled}
            animating={true}
            size="large"
          />
        )}
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

function useTripPattern(
  currentIndex: number,
  tripPattern?: TripPattern,
  disabled?: boolean,
) {
  const fetchTripPattern = useCallback(
    async function reload(signal?: AbortSignal) {
      const tripQuery = await singleTripSearch(
        tripPattern?.compressedQuery ?? null,
        {signal},
      );
      return tripQuery?.trip?.tripPatterns[0] ?? undefined;
    },
    [currentIndex],
  );

  return usePollableResource<TripPattern | undefined, AxiosError>(
    fetchTripPattern,
    {
      initialValue: tripPattern,
      pollingTimeInSeconds: 30,
      disabled,
    },
  );
}
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
  activityIndicator: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  scrollViewContent: {},
  pagination: {
    marginVertical: theme.spacings.medium,
  },
}));

export default Details;
