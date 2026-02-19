import {StyleSheet} from '@atb/theme';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View} from 'react-native';
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
import {RemoveStoredTripPatternBottomSheet} from './RemoveStoredTripPatternBottomSheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {SwipeableResultRow} from './SwipeableResultRow';
import {SwipeableMethods} from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';

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
      const bottomSheetModalRef =
        useRef<GorhomBottomSheetModal<TripPattern> | null>(null);

      const {registerCloseCallback, closeAllSwipeables} =
        useCloseAllSwipeables();

      const searchTime = useMemo<TripSearchTime>(
        () => ({option: 'now', date: new Date(now).toISOString()}),
        [now],
      );

      const {tripPatterns, updateTripPattern, removeTripPattern} =
        useStoredTripPatterns();

      const setTripPatternToRemove = useCallback((tripPattern: TripPattern) => {
        bottomSheetModalRef.current?.present(tripPattern);
      }, []);

      const onRemovePress = useCallback(
        (tripPattern: TripPattern) => {
          removeTripPattern(tripPattern);
          bottomSheetModalRef.current?.dismiss();
        },
        [removeTripPattern],
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
                registerCloseCallback={registerCloseCallback}
              />
            </Animated.View>
          ))}
          <RemoveStoredTripPatternBottomSheet
            onRemovePress={onRemovePress}
            onClose={closeAllSwipeables}
            bottomSheetModalRef={bottomSheetModalRef}
          />
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
  setTripPatternToRemove: (tripPattern: TripPattern) => void;
  isFocused: boolean;
  registerCloseCallback: (callback: () => void) => void;
}> = ({
  tripPattern,
  onDetailsPressed,
  resultIndex,
  searchTime,
  updateTripPattern,
  setTripPatternToRemove,
  isFocused,
  registerCloseCallback,
}) => {
  const {data} = useSingleTripQuery(tripPattern.compressedQuery, isFocused);
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  useEffect(() => {
    return registerCloseCallback(() => {
      swipeableRef.current?.close();
    });
  }, [registerCloseCallback]);

  const updatedTripPattern = useMemo(
    () => data ?? tripPattern,
    [data, tripPattern],
  );

  useEffect(() => {
    updateTripPattern({...updatedTripPattern});
  }, [updatedTripPattern, updateTripPattern]);

  const onRightAction = useCallback(() => {
    setTripPatternToRemove(tripPattern);
  }, [setTripPatternToRemove, tripPattern]);

  return (
    <SwipeableResultRow
      onRightAction={onRightAction}
      swipeableRef={swipeableRef}
      rightActionKind="delete"
    >
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

const useCloseAllSwipeables = () => {
  const closeSwipeableCallbacks = useRef<(() => void)[]>([]);

  const registerCloseCallback = useCallback((callback: () => void) => {
    closeSwipeableCallbacks.current.push(callback);

    // Return cleanup function
    return () => {
      closeSwipeableCallbacks.current = closeSwipeableCallbacks.current.filter(
        (cb) => cb !== callback,
      );
    };
  }, []);

  const closeAllSwipeables = useCallback(() => {
    closeSwipeableCallbacks.current.forEach((callback) => callback());
  }, [closeSwipeableCallbacks]);

  return {registerCloseCallback, closeAllSwipeables};
};

const StoredTripPatternsDashboardComponentTexts = {
  header: _('Lagrede reiser', 'Saved trips', 'Lagrede reiser'),
  removeTrip: {
    text: _('Fjern lagret reise', 'Remove saved trip', 'Fjern lagret reise'),
  },
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentHeading: {
    marginHorizontal: theme.spacing.medium,
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
