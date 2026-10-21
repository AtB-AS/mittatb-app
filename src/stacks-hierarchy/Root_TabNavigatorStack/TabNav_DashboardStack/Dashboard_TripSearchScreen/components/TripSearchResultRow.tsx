import React from 'react';
import {TripPattern} from '@atb/api/types/trips';
import {TripPatternWithKey} from '@atb/screen-components/travel-details-screens';
import {SaveableTripSearchResultRow} from '@atb/modules/experimental-store-trip-patterns';
import {
  TravelCard,
  WithTravelCardSkeleton,
} from '@atb/screen-components/travel-card';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {DayLabel} from './DayLabel';

type Props = {
  tripPattern: TripPatternWithKey;
  previousDepartureTime: string | undefined;
  index: number;
  numberOfResults: number;
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  // Shows only the card skeleton until the card itself should be rendered.
  isDeferred?: boolean;
  onInitialRowReady?: (index: number) => void;
};

/**
 * A single trip search result. Kept as its own component so a row only
 * re-renders when its own props change, not whenever the result list does.
 */
export const TripSearchResultRow = ({
  tripPattern,
  previousDepartureTime,
  index,
  numberOfResults,
  onDetailsPressed,
  isDeferred = false,
  onInitialRowReady,
}: Props) => {
  const {t} = useTranslation();

  return (
    <>
      <DayLabel
        departureTime={tripPattern.expectedStartTime}
        previousDepartureTime={previousDepartureTime}
      />
      <WithTravelCardSkeleton>
        {isDeferred
          ? undefined
          : ({onReady}) => (
              <SaveableTripSearchResultRow tripPattern={tripPattern}>
                {(isSaved) => (
                  <TravelCard
                    tripPattern={tripPattern}
                    onDetailsPressed={onDetailsPressed}
                    testID={'tripSearchSearchResult' + index}
                    a11yLabelPrefix={t(
                      TravelCardTexts.card.a11yPrefix.tripSuggestion(
                        index,
                        numberOfResults,
                      ),
                    )}
                    a11yHint={t(TravelCardTexts.card.a11yHint.tripDetails)}
                    onReady={() => {
                      onReady();
                      onInitialRowReady?.(index);
                    }}
                    isSaved={isSaved}
                  />
                )}
              </SaveableTripSearchResultRow>
            )}
      </WithTravelCardSkeleton>
    </>
  );
};
