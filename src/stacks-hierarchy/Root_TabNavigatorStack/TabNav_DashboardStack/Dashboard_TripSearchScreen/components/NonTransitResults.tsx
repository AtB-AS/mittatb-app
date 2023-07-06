import React from 'react';
import {ScrollView} from 'react-native';
import {Button} from '@atb/components/button';
import {secondsToDurationShort} from '@atb/utils/date';
import {NonTransitTripsQuery} from '@atb/api/types/generated/TripsQuery';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {TripPattern} from '@atb/api/types/trips';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {isBlank} from '@atb/utils/presence';
import arrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';

type Props = {
  trips: NonTransitTripsQuery[];
  onDetailsPressed(tripPattern?: TripPattern, resultIndex?: number): void;
};

export const NonTransitResults = ({trips, onDetailsPressed}: Props) => {
  const {t, language} = useTranslation();
  const style = useStyle();

  if (trips.map((t) => t.trip).every(isBlank)) return null;

  return (
    <ScrollView horizontal={true} style={style.container}>
      {trips.map((trip, i) => {
        // Non-transit trips will only have one trip pattern.
        const tripPattern = trip.trip?.tripPatterns[0];
        if (!tripPattern) return null;
        const mode = t(TripSearchTexts.nonTransit.travelMode(trip.mode));
        const duration = secondsToDurationShort(tripPattern.duration, language);
        return (
          <Button
            style={style.tripMode}
            key={trip.mode}
            type={'pill'}
            interactiveColor={'interactive_2'}
            text={`${mode} ${duration}`}
            leftIcon={{svg: getTransportModeSvg(trip.mode)}}
            rightIcon={{svg: arrowRight}}
            onPress={() => onDetailsPressed(tripPattern, i)}
          />
        );
      })}
    </ScrollView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingTop: theme.spacings.medium,
  },
  tripMode: {
    marginRight: theme.spacings.small,
  },
}));
