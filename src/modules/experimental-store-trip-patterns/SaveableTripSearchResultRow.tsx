import React, {useCallback, useMemo, useRef} from 'react';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {useIsExperimentalEnabled} from '@atb/modules/experimental';
import {RightActionKind, SwipeableResultRow} from './SwipeableResultRow';
import {getTripPatternKey} from './utils';
import {TripPattern} from '@atb/api/types/trips';
import {SwipeableMethods} from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import {SaveFill} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';

export const SaveableTripSearchResultRow: React.FC<
  React.PropsWithChildren<{
    tripPattern: TripPattern;
  }>
> = ({children, tripPattern}) => {
  const isExperimentalEnabled = useIsExperimentalEnabled();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const {tripPatterns, addTripPattern, removeTripPattern} =
    useStoredTripPatterns();

  const isStored = useMemo(
    () => tripPatterns.some((tp) => tp.key === getTripPatternKey(tripPattern)),
    [tripPattern, tripPatterns],
  );

  const rightActionKind = useMemo<RightActionKind>(
    () => (isStored ? 'delete' : 'save'),
    [isStored],
  );

  const onRightAction = useCallback(
    (actionKind: RightActionKind) => {
      swipeableRef.current?.close();
      if (actionKind === 'delete') {
        removeTripPattern(tripPattern);
      } else {
        addTripPattern(tripPattern);
      }
    },
    [tripPattern, addTripPattern, removeTripPattern],
  );

  if (!isExperimentalEnabled) {
    return children;
  }

  return (
    <SwipeableResultRow
      swipeableRef={swipeableRef}
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
};
