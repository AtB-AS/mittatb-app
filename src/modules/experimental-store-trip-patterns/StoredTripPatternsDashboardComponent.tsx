import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {Fragment, useCallback, useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {TripPattern} from '@atb/api/types/trips';
import {useNow} from '@atb/utils/use-now';

import {TripSearchTime} from '../../stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {useSingleTripQuery} from '@atb/modules/trip-patterns';
import Swipeable, {
  SwipeDirection,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {ContentHeading} from '@atb/components/heading';
import {translation as _, useTranslation} from '@atb/translations';
import {ResultRow} from '../../stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultRow';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {wrapWithNullComponent} from '../experimental/null-component';

type Props = {
  onDetailsPressed(tripPattern: TripPattern): void;
  isFocused: boolean;
};

export const StoredTripPatternsDashboardComponent =
  wrapWithNullComponent<Props>(({onDetailsPressed, isFocused}) => {
    const styles = useThemeStyles();
    const now = useNow(30000);
    const {t} = useTranslation();

    const searchTime = useMemo<TripSearchTime>(
      () => ({option: 'now', date: new Date(now).toISOString()}),
      [now],
    );

    const {tripPatterns, updateTripPattern, removeTripPattern} =
      useStoredTripPatterns();

    if (!tripPatterns.length) {
      return null;
    }

    return (
      <View style={styles.container} testID="storedTripPatternsContentView">
        <ContentHeading
          text={t(StoredTripPatternsDashboardComponentTexts.header)}
        />
        {tripPatterns.map((tripPattern, i) => (
          <Fragment key={tripPattern.compressedQuery}>
            <StoredTripPatternRow
              tripPattern={tripPattern}
              onDetailsPressed={onDetailsPressed}
              resultIndex={i}
              searchTime={searchTime}
              updateTripPattern={updateTripPattern}
              removeTripPattern={removeTripPattern}
              isFocused={isFocused}
            />
          </Fragment>
        ))}
      </View>
    );
  });

const StoredTripPatternRow: React.FC<{
  tripPattern: TripPattern;
  onDetailsPressed: (tripPattern: TripPattern) => void;
  resultIndex: number;
  searchTime: TripSearchTime;
  updateTripPattern: (tripPattern: TripPattern) => void;
  removeTripPattern: (tripPattern: TripPattern) => void;
  isFocused: boolean;
}> = ({
  tripPattern,
  onDetailsPressed,
  resultIndex,
  searchTime,
  updateTripPattern,
  removeTripPattern,
  isFocused,
}) => {
  const {data} = useSingleTripQuery(tripPattern.compressedQuery, isFocused);

  const updatedTripPattern = useMemo(
    () => data ?? tripPattern,
    [data, tripPattern],
  );

  useEffect(() => {
    updateTripPattern({...updatedTripPattern});
  }, [updatedTripPattern, updateTripPattern]);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (direction === 'left') {
        removeTripPattern(tripPattern);
      }
    },
    [removeTripPattern, tripPattern],
  );

  return (
    <Swipeable
      friction={1}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}
      onSwipeableOpen={handleSwipe}
    >
      <ResultRow
        tripPattern={updatedTripPattern}
        onDetailsPressed={onDetailsPressed}
        resultIndex={resultIndex}
        searchTime={searchTime}
        testID={'tripSearchSearchResult' + resultIndex}
      />
    </Swipeable>
  );
};

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const {theme} = useThemeContext();
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: drag.value + 100}],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 100,
          padding: theme.spacing.medium,
          justifyContent: 'center',
        },
        styleAnimation,
      ]}
    >
      <ThemeIcon svg={Delete} size="large" />
    </Animated.View>
  );
}

const StoredTripPatternsDashboardComponentTexts = {
  header: _('Lagrede reiser', 'Saved trips', 'Lagrede reiser'),
  removeTrip: {
    text: _('Fjern lagret reise', 'Remove saved trip', 'Fjern lagret reise'),
  },
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
  },
  errorContainer: {
    paddingBottom: theme.spacing.medium,
  },
  infoBoxText: theme.typography.body__m,
  messageBoxContainer: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
  emptyStateContainer: {
    marginTop: theme.spacing.medium,
  },
  heading: {
    marginBottom: theme.spacing.small,
  },
}));
