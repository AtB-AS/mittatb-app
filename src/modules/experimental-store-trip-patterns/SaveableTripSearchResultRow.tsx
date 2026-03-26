import React, {useCallback, useMemo} from 'react';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {
  useIsExperimentalEnabled,
  wrapWithExperimentalFeatureToggledComponent,
} from '@atb/modules/experimental';
import {RightActionKind, SwipeableResultRow} from './SwipeableResultRow';
import {getTripPatternKey} from './utils';
import {TripPattern} from '@atb/api/types/trips';
import {SaveFill} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {getTripPatternAnalytics} from '@atb/screen-components/travel-details-screens';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useTimeContext} from '../time';

export const SaveableTripSearchResultRow =
  wrapWithExperimentalFeatureToggledComponent<
    React.PropsWithChildren<{
      tripPattern: TripPattern;
    }>
  >('render-children-if-disabled', ({children, tripPattern}) => {
    const isExperimentalEnabled = useIsExperimentalEnabled();
    const {tripPatterns, addTripPattern, removeTripPattern, canAddTripPattern} =
      useStoredTripPatterns();
    const {fareZones} = useFirestoreConfigurationContext();
    const analytics = useAnalyticsContext();
    const {serverNow} = useTimeContext(30000);

    const canAdd = useMemo(() => {
      return canAddTripPattern(tripPattern);
    }, [tripPattern, canAddTripPattern]);

    const isStored = useMemo(
      () =>
        canAdd &&
        tripPatterns.some((tp) => tp.key === getTripPatternKey(tripPattern)),
      [tripPattern, tripPatterns, canAdd],
    );

    const rightActionKind = useMemo<RightActionKind>(
      () => (isStored ? 'delete' : 'save'),
      [isStored],
    );

    const onRightAction = useCallback(
      (actionKind: RightActionKind, closeSwipeable: () => void) => {
        closeSwipeable();
        if (actionKind === 'delete') {
          analytics.logEvent(
            'Trip search',
            'Trip removed',
            getTripPatternAnalytics(tripPattern, fareZones, serverNow),
          );
          removeTripPattern(tripPattern);
        } else {
          analytics.logEvent(
            'Trip search',
            'Trip saved',
            getTripPatternAnalytics(tripPattern, fareZones, serverNow),
          );
          addTripPattern(tripPattern);
        }
      },
      [
        tripPattern,
        addTripPattern,
        removeTripPattern,
        analytics,
        fareZones,
        serverNow,
      ],
    );

    if (!isExperimentalEnabled || !canAdd) {
      return children;
    }

    return (
      <SwipeableResultRow
        onRightAction={onRightAction}
        rightActionKind={rightActionKind}
      >
        {children}
        {isStored && (
          <ThemeIcon
            svg={SaveFill}
            color="secondary"
            style={{position: 'absolute', right: 20, top: 2}}
          />
        )}
      </SwipeableResultRow>
    );
  });
