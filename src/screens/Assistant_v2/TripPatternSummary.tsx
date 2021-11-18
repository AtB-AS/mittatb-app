import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import ThemeText from '@atb/components/text';
import {formatToClock, secondsToDurationShort} from '@atb/utils/date';
import {useTranslation} from '@atb/translations';

type TripPatternSummaryProps = {
  tripPattern: TripPattern;
};

export const TripPatternSummary: React.FC<TripPatternSummaryProps> = ({
  tripPattern,
  ...props
}) => {
  const {t, language} = useTranslation();
  const tripStartTime = formatToClock(tripPattern.expectedStartTime, language);
  const tripEndTime = formatToClock(tripPattern.expectedEndTime, language);

  return (
    <View>
      <ThemeText>
        {tripStartTime} - {tripEndTime}
        {secondsToDurationShort(tripPattern.duration, language)}
      </ThemeText>
      <SummaryLegs legs={tripPattern.legs} />
    </View>
  );
};

type SummaryLegsProps = {
  legs: Leg[];
};

const SummaryLegs: React.FC<SummaryLegsProps> = ({legs}) => {
  return (
    <View>
      {legs.map((leg) => {
        return <ThemeText>{leg.mode}</ThemeText>;
      })}
    </View>
  );
};
