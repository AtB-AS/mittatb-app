import {TripPattern} from '@atb/api/types/trips';
import {Walk, Bicycle} from '@atb/assets/svg/mono-icons/transportation-entur';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {Duration} from '@atb/assets/svg/mono-icons/time';
import {useHumanizeDistance} from '@atb/utils/location';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {SummaryDetail} from './SummaryDetail';

export const TripSummary: React.FC<TripPattern> = ({legs, duration}) => {
  const {t, language} = useTranslation();
  const time = secondsToDuration(duration, language);
  const walkDistance = getDistance(legs, Mode.Foot);
  const bikeDistance = getDistance(legs, Mode.Bicycle);
  const readableWalkDistance = useHumanizeDistance(walkDistance);
  const readableBikeDistance = useHumanizeDistance(bikeDistance);

  return (
    <View>
      <SummaryDetail
        icon={Duration}
        accessibilityLabel={t(
          TripDetailsTexts.trip.summary.travelTime.a11yLabel(time),
        )}
        label={t(TripDetailsTexts.trip.summary.travelTime.label(time))}
        testID="travelTime"
      />
      {readableWalkDistance && (
        <SummaryDetail
          icon={Walk}
          accessibilityLabel={t(
            TripDetailsTexts.trip.summary.walkDistance.a11yLabel(
              readableWalkDistance,
            ),
          )}
          label={t(
            TripDetailsTexts.trip.summary.walkDistance.label(
              readableWalkDistance,
            ),
          )}
          testID="walkDistance"
        />
      )}
      {readableBikeDistance && (
        <SummaryDetail
          icon={Bicycle}
          accessibilityLabel={t(
            TripDetailsTexts.trip.summary.bikeDistance.a11yLabel(
              readableBikeDistance,
            ),
          )}
          label={t(
            TripDetailsTexts.trip.summary.bikeDistance.label(
              readableBikeDistance,
            ),
          )}
        />
      )}
    </View>
  );
};

function getDistance<T extends {mode: Mode; distance: number}>(
  legs: Array<T>,
  mode: Mode,
) {
  return legs
    .filter((l) => l.mode === mode)
    .reduce((tot, {distance}) => tot + distance, 0);
}
