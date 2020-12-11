import React, {useState, useCallback, useEffect} from 'react';
import {Leg, Situation, TripPattern} from '../../../sdk';
import {RouteProp, NavigationProp, useIsFocused} from '@react-navigation/core';
import {DetailsModalStackParams} from '..';
import CompactMap from '../Map/CompactMap';
import {useTheme, StyleSheet} from '../../../theme';

import Header from '../../../ScreenHeader';
import {View, ActivityIndicator} from 'react-native';
import ThemeIcon from '../../../components/theme-icon';
import {ScrollView} from 'react-native-gesture-handler';
import Pagination from '../../../components/pagination';
import {ArrowLeft} from '../../../assets/svg/icons/navigation';
import Axios, {AxiosError} from 'axios';
import {secondsBetween, secondsToDuration} from '../../../utils/date';
import {getSingleTripPattern} from '../../../api/trips';
import usePollableResource from '../../../utils/use-pollable-resource';
import TripSection from './components/TripSection';
import Summary from './components/TripSummary';
import TripMessages from './components/TripMessages';
import {timeIsShort} from './utils';

export type DetailsRouteParams = {
  initialTripPatterns: TripPattern[];
  startIndex: number;
};

export type DetailScreenRouteProp = RouteProp<
  DetailsModalStackParams,
  'Details'
>;

export type DetailScreenNavigationProp = NavigationProp<
  DetailsModalStackParams
>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};
const Details: React.FC<Props> = (props) => {
  const {
    params: {initialTripPatterns: initialTripPatterns, startIndex: startIndex},
  } = props.route;

  const {theme, themeName} = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);

  const isFocused = useIsFocused();

  const styles = useStyle();
  const [tripPattern, setTripPattern] = useState<TripPattern | undefined>(
    initialTripPatterns[currentIndex],
  );
  const [updatedTripPattern, , loading, error] = useTripPattern(
    currentIndex,
    initialTripPatterns[currentIndex],
    !isFocused,
  );
  const showActivityIndicator = (!tripPattern && !error) || loading;

  useEffect(() => {
    const currentPagePatternId = initialTripPatterns[currentIndex].id;
    setTripPattern(
      updatedTripPattern?.id === currentPagePatternId
        ? updatedTripPattern
        : initialTripPatterns[currentIndex],
    );
  }, [currentIndex, updatedTripPattern]);

  const [shortTime, setShortTime] = useState(false);

  function navigate(page: number) {
    const newIndex = page - 1;
    if (
      page > initialTripPatterns.length ||
      page < 1 ||
      currentIndex === newIndex
    ) {
      return;
    }
    setCurrentIndex(newIndex);
    setShortTime(false);
  }

  const checkWaitTime = (secondsBetween: number) => {
    if (!shortTime && timeIsShort(secondsBetween)) {
      setShortTime(true);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        leftButton={{
          onPress: () => props.navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
          icon: <ThemeIcon svg={ArrowLeft} />,
        }}
        title="Reisedetaljer"
        style={styles.header}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
      >
        {showActivityIndicator && (
          <ActivityIndicator
            style={styles.activityIndicator}
            color={theme.text.colors.faded}
            animating={true}
            size="large"
          />
        )}
        {tripPattern && (
          <>
            <CompactMap
              legs={tripPattern.legs}
              darkMode={themeName === 'dark'}
              onExpand={() => {
                props.navigation.navigate('DetailsMap', {
                  legs: tripPattern.legs,
                });
              }}
            />
            <View style={styles.paddedContainer}>
              <Pagination
                page={currentIndex + 1}
                totalPages={initialTripPatterns.length}
                onNavigate={navigate}
                style={styles.pagination}
              ></Pagination>
              <View style={styles.line} />
              <TripMessages
                error={error}
                shortTime={shortTime}
                messageStyle={styles.message}
              />
              <View style={styles.trip}>
                {tripPattern.legs.map((leg, index) => {
                  const waitDetails = legWaitDetails(index, tripPattern.legs);
                  const isFirst = index == 0;
                  const isLast = index == tripPattern.legs.length - 1;
                  if (waitDetails?.waitAfter && !isFirst) {
                    checkWaitTime(waitDetails.waitSeconds);
                  }
                  return (
                    <TripSection
                      key={index}
                      isFirst={isFirst}
                      wait={waitDetails}
                      isLast={isLast}
                      {...leg}
                    />
                  );
                })}
              </View>
              <View style={styles.line} />
              <Summary {...tripPattern} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export type WaitDetails = {
  waitAfter: boolean;
  waitSeconds: number;
};
function legWaitDetails(index: number, legs: Leg[]): WaitDetails | undefined {
  const next = legs.length > index + 1 && legs[index + 1];
  if (!next) {
    return;
  }
  const waitSeconds = secondsBetween(
    legs[index].expectedEndTime,
    next.expectedStartTime,
  );
  const waitAfter = next.mode !== 'foot' && waitSeconds > 0;

  return {waitAfter, waitSeconds};
}
function useTripPattern(
  currentIndex: number,
  initialTripPattern?: TripPattern,
  disabled?: boolean,
) {
  const fetchTripPattern = useCallback(
    async function reload() {
      return await getSingleTripPattern(initialTripPattern?.id ?? '');
    },
    [currentIndex],
  );

  return usePollableResource<TripPattern | undefined, AxiosError>(
    fetchTripPattern,
    {
      initialValue: initialTripPattern,
      pollingTimeInSeconds: 10,
      filterError: (err) => !Axios.isCancel(err),
      disabled,
    },
  );
}
const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.header,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background.level0,
  },
  scrollView: {
    flex: 1,
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
  line: {
    flex: 1,
    height: theme.border.width.slim,
    backgroundColor: theme.background.level1,
  },
  message: {
    marginTop: theme.spacings.medium,
  },
  trip: {
    paddingVertical: theme.spacings.medium,
  },
}));

export default Details;
