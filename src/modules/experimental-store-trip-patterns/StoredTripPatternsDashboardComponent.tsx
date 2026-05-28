import {StyleSheet} from '@atb/theme';
import React, {useCallback, useEffect} from 'react';
import {Alert, View} from 'react-native';
import {TripPattern} from '@atb/api/types/trips';

import {useRefreshTripQuery} from '@atb/modules/trip-patterns';
import Animated, {
  Easing,
  LinearTransition,
  ZoomOut,
} from 'react-native-reanimated';
import {ContentHeading} from '@atb/components/heading';
import {
  translation as _,
  TravelCardTexts,
  useTranslation,
} from '@atb/translations';
import {TravelCard} from '@atb/screen-components/travel-card';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {RightActionKind, SwipeableResultRow} from './SwipeableResultRow';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {getTripPatternAnalytics} from '@atb/screen-components/travel-details-screens';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useTimeContext} from '../time';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

type Props = {
  onDetailsPressed(tripPattern: TripPattern): void;
  isFocused: boolean;
};

export const StoredTripPatternsDashboardComponent: React.FC<Props> = ({
  onDetailsPressed,
  isFocused,
}) => {
  const {isSaveTripsEnabled} = useFeatureTogglesContext();
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {fareZones} = useFirestoreConfigurationContext();
  const analytics = useAnalyticsContext();
  const {serverNow} = useTimeContext(30000);

  const {tripPatterns, updateTripPattern, removeTripPattern} =
    useStoredTripPatterns();

  const setTripPatternToRemove = useCallback(
    (tripPattern: TripPattern, cancelRemove: () => void) => {
      Alert.alert(t(RemoveStoredTripPatternAlertTexts.header.text), undefined, [
        {
          text: t(RemoveStoredTripPatternAlertTexts.cancelButton.text),
          style: 'cancel',
          onPress: cancelRemove,
        },
        {
          text: t(RemoveStoredTripPatternAlertTexts.removeButton.text),
          style: 'destructive',
          onPress: () => {
            analytics.logEvent(
              'Dashboard',
              'Trip removed',
              getTripPatternAnalytics(tripPattern, fareZones, serverNow),
            );
            removeTripPattern(tripPattern);
          },
        },
      ]);
    },
    [removeTripPattern, t, analytics, fareZones, serverNow],
  );

  if (!isSaveTripsEnabled || !tripPatterns.length) {
    return null;
  }

  return (
    <View testID="storedTripPatternsContentView" style={styles.container}>
      <ContentHeading
        text={t(StoredTripPatternsDashboardComponentTexts.header)}
      />
      <View style={styles.storedTripsList}>
        {tripPatterns.map((tripPattern, i) => (
          <Animated.View
            key={tripPattern.key}
            exiting={ZoomOut.easing(Easing.inOut(Easing.ease))}
            layout={LinearTransition}
            style={{zIndex: 999}}
          >
            <StoredTripPatternRow
              tripPattern={tripPattern}
              onDetailsPressed={onDetailsPressed}
              resultIndex={i}
              length={tripPatterns.length}
              updateTripPattern={updateTripPattern}
              setTripPatternToRemove={setTripPatternToRemove}
              isFocused={isFocused}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const StoredTripPatternRow: React.FC<{
  tripPattern: TripPattern;
  onDetailsPressed: (tripPattern: TripPattern) => void;
  resultIndex: number;
  length: number;
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
  length,
  updateTripPattern,
  setTripPatternToRemove,
  isFocused,
}) => {
  const {data} = useRefreshTripQuery(tripPattern, isFocused);
  const {t} = useTranslation();

  const updatedTripPattern = data ?? tripPattern;

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
      <TravelCard
        tripPattern={updatedTripPattern}
        onDetailsPressed={onDetailsPressed}
        testID={'tripSearchSearchResult' + resultIndex}
        a11yLabelPrefix={t(
          TravelCardTexts.card.a11yPrefix.savedTrip(resultIndex, length),
        )}
        a11yHint={t(TravelCardTexts.card.a11yHint.tripDetails)}
        includeDayInfo
        includeFromToInfo
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
  container: {
    marginHorizontal: theme.spacing.medium,
  },
  storedTripsList: {
    marginTop: theme.spacing.small,
    gap: theme.spacing.small,
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
