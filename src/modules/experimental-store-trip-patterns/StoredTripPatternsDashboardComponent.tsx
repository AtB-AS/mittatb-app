import {StyleSheet} from '@atb/theme';
import React, {useCallback, useEffect, useMemo} from 'react';
import {Alert, View} from 'react-native';
import {TripPattern} from '@atb/api/types/trips';
import {useNow} from '@atb/utils/use-now';

import {TripSearchTime} from '../../stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {useSingleTripQuery} from '@atb/modules/trip-patterns';
import Animated, {
  Easing,
  LinearTransition,
  ZoomOut,
} from 'react-native-reanimated';
import {ContentHeading} from '@atb/components/heading';
import {translation as _, useTranslation} from '@atb/translations';
import {ResultRow} from '../../stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultRow';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {wrapWithExperimentalFeatureToggledComponent} from '@atb/modules/experimental';
import {RightActionKind, SwipeableResultRow} from './SwipeableResultRow';

type Props = {
  onDetailsPressed(tripPattern: TripPattern): void;
  isFocused: boolean;
};

export const StoredTripPatternsDashboardComponent =
  wrapWithExperimentalFeatureToggledComponent<Props>(
    'render-nothing-if-disabled',
    ({onDetailsPressed, isFocused}) => {
      const styles = useThemeStyles();
      const now = useNow(30000);
      const {t} = useTranslation();

      const searchTime = useMemo<TripSearchTime>(
        () => ({option: 'now', date: new Date(now).toISOString()}),
        [now],
      );

      const {tripPatterns, updateTripPattern, removeTripPattern} =
        useStoredTripPatterns();

      const setTripPatternToRemove = useCallback(
        (tripPattern: TripPattern, cancelRemove: () => void) => {
          Alert.alert(
            t(RemoveStoredTripPatternAlertTexts.header.text),
            undefined,
            [
              {
                text: t(RemoveStoredTripPatternAlertTexts.cancelButton.text),
                style: 'cancel',
                onPress: cancelRemove,
              },
              {
                text: t(RemoveStoredTripPatternAlertTexts.removeButton.text),
                style: 'destructive',
                onPress: () => removeTripPattern(tripPattern),
              },
            ],
          );
        },
        [removeTripPattern, t],
      );

      if (!tripPatterns.length) {
        return null;
      }

      return (
        <View testID="storedTripPatternsContentView">
          <ContentHeading
            style={styles.contentHeading}
            text={t(StoredTripPatternsDashboardComponentTexts.header)}
          />
          {tripPatterns.map((tripPattern, i) => (
            <Animated.View
              key={tripPattern.key}
              exiting={ZoomOut.easing(Easing.inOut(Easing.ease))}
              layout={LinearTransition} // https://github.com/software-mansion/react-native-reanimated/discussions/5857#discussioncomment-9992457
              style={{zIndex: 999}} // This is to make the animation appear above content which is not animating
            >
              <StoredTripPatternRow
                tripPattern={tripPattern}
                onDetailsPressed={onDetailsPressed}
                resultIndex={i}
                searchTime={searchTime}
                updateTripPattern={updateTripPattern}
                setTripPatternToRemove={setTripPatternToRemove}
                isFocused={isFocused}
              />
            </Animated.View>
          ))}
        </View>
      );
    },
  );

const StoredTripPatternRow: React.FC<{
  tripPattern: TripPattern;
  onDetailsPressed: (tripPattern: TripPattern) => void;
  resultIndex: number;
  searchTime: TripSearchTime;
  updateTripPattern: (tripPattern: TripPattern) => void;
  setTripPatternToRemove: (
    tripPattern: TripPattern,
    cancelRemove: () => void,
  ) => void;
  isFocused: boolean;
}> = ({
  tripPattern,
  onDetailsPressed,
  resultIndex,
  searchTime,
  updateTripPattern,
  setTripPatternToRemove,
  isFocused,
}) => {
  const {data} = useSingleTripQuery(tripPattern.compressedQuery, isFocused);

  const updatedTripPattern = useMemo(
    () => data ?? tripPattern,
    [data, tripPattern],
  );

  useEffect(() => {
    if (!data) return;
    updateTripPattern({...data});
  }, [data, updateTripPattern]);

  const onRightAction = useCallback(
    (kind: RightActionKind, closeSwipeable: () => void) => {
      if (kind === 'delete') {
        setTripPatternToRemove(tripPattern, closeSwipeable);
      }
    },
    [setTripPatternToRemove, tripPattern],
  );

  return (
    <SwipeableResultRow onRightAction={onRightAction} rightActionKind="delete">
      <ResultRow
        tripPattern={updatedTripPattern}
        onDetailsPressed={onDetailsPressed}
        resultIndex={resultIndex}
        searchTime={searchTime}
        testID={'tripSearchSearchResult' + resultIndex}
      />
    </SwipeableResultRow>
  );
};

const StoredTripPatternsDashboardComponentTexts = {
  header: _('Lagrede reiser', 'Saved trips', 'Lagrede reiser'),
  removeTrip: {
    text: _('Fjern lagret reise', 'Remove saved trip', 'Fjern lagret reise'),
  },
};

const RemoveStoredTripPatternAlertTexts = {
  header: {
    text: _('Fjern lagret reise?', 'Remove saved trip?', 'Fjern lagret reise?'),
  },
  removeButton: {
    text: _('Fjern lagret reise', 'Remove saved trip', 'Fjern lagret reise'),
  },
  cancelButton: {
    text: _('Avbryt', 'Cancel', 'Avbryt'),
  },
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentHeading: {
    marginHorizontal: theme.spacing.xLarge,
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
