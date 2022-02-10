import ContentWithDisappearingHeader from '@atb/components/disappearing-header/content';
import PaginatedDetailsHeader from '@atb/components/pagination';
import Header from '@atb/components/screen-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import usePollableResource from '@atb/utils/use-pollable-resource';
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import Axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DetailsStackParams} from '..';
import Trip from '../components/Trip';
import CompactMap from '../Map/CompactMap';
import {ThemeColor} from '@atb/theme/colors';
import {singleTripSearch} from '@atb/api/trips_v2';
import {TripPattern} from '@atb/api/types/trips';
import Bugsnag from '@bugsnag/react-native';

const themeColor: ThemeColor = 'background_accent';

export type DetailsRouteParams = {
  tripPatterns?: TripPattern[];
  startIndex?: number;
};

export type DetailScreenRouteProp = RouteProp<DetailsStackParams, 'Details'>;

export type DetailScreenNavigationProp = NavigationProp<DetailsStackParams>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};
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
          <View style={styles.paddedContainer}>
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
    async function reload() {
      const tripQuery = await singleTripSearch(
        tripPattern?.compressedQuery ?? null,
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
      filterError: (err) => !Axios.isCancel(err),
      disabled,
    },
  );
}
const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_0.backgroundColor,
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
