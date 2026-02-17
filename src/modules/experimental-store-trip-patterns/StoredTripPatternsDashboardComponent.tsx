import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import {TripPattern} from '@atb/api/types/trips';
import {useNow} from '@atb/utils/use-now';

import {TripSearchTime} from '../../stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {useSingleTripQuery} from '@atb/modules/trip-patterns';
import Swipeable, {
  SwipeableMethods,
  SwipeDirection,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {ContentHeading} from '@atb/components/heading';
import {translation as _, useTranslation} from '@atb/translations';
import {ResultRow} from '../../stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultRow';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {wrapWithExperimentalFeatureToggledComponent} from '@atb/modules/experimental';
import {RemoveStoredTripPatternBottomSheet} from './RemoveStoredTripPatternBottomSheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';

type Props = {
  onDetailsPressed(tripPattern: TripPattern): void;
  isFocused: boolean;
};

export const StoredTripPatternsDashboardComponent =
  wrapWithExperimentalFeatureToggledComponent<Props>(
    'render-children-if-disabled',
    ({onDetailsPressed, isFocused}) => {
      const styles = useThemeStyles();
      const now = useNow(30000);
      const {t} = useTranslation();
      const bottomSheetModalRef = useRef<GorhomBottomSheetModal | null>(null);

      const searchTime = useMemo<TripSearchTime>(
        () => ({option: 'now', date: new Date(now).toISOString()}),
        [now],
      );

      const {tripPatterns, updateTripPattern, removeTripPattern} =
        useStoredTripPatterns();

      const [tripPatternToRemove, setTripPatternToRemove] = useState<
        TripPattern | undefined
      >(undefined);

      useEffect(() => {
        if (tripPatternToRemove) {
          bottomSheetModalRef.current?.present();
        } else {
          bottomSheetModalRef.current?.dismiss();
        }
      }, [tripPatternToRemove]);

      const onRemovePress = useCallback(() => {
        if (tripPatternToRemove) {
          removeTripPattern(tripPatternToRemove);
          setTripPatternToRemove(undefined);
        }
      }, [tripPatternToRemove, removeTripPattern]);

      const onCancelPress = useCallback(() => {
        setTripPatternToRemove(undefined);
      }, []);

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
                setTripPatternToRemove={setTripPatternToRemove}
                isRemoving={
                  tripPatternToRemove?.compressedQuery ===
                  tripPattern.compressedQuery
                }
                isFocused={isFocused}
              />
            </Fragment>
          ))}
          <RemoveStoredTripPatternBottomSheet
            onRemovePress={onRemovePress}
            onCancelPress={onCancelPress}
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
  isRemoving: boolean;
  isFocused: boolean;
}> = ({
  tripPattern,
  onDetailsPressed,
  resultIndex,
  searchTime,
  updateTripPattern,
  setTripPatternToRemove,
  isRemoving,
  isFocused,
}) => {
  const {data} = useSingleTripQuery(tripPattern.compressedQuery, isFocused);
  const swipeableRef = useRef<SwipeableMethods>(null);

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
        setTripPatternToRemove(tripPattern);
      }
    },
    [setTripPatternToRemove, tripPattern],
  );

  useEffect(() => {
    if (!isRemoving) {
      swipeableRef.current?.close();
    }
  }, [isRemoving]);

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}
      onSwipeableOpen={handleSwipe}
      ref={swipeableRef}
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
