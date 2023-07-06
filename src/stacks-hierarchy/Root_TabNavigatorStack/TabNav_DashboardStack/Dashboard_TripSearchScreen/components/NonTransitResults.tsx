import {ScrollView} from 'react-native';
import {Button} from '@atb/components/button';
import {secondsToDurationShort} from '@atb/utils/date';
import React from 'react';
import {NonTransitTripsQuery} from '@atb/api/types/generated/TripsQuery';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {TripPattern} from '@atb/api/types/trips';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {isBlank} from '@atb/utils/presence';

type Props = {
  trips: NonTransitTripsQuery[];
  onDetailsPressed(tripPattern?: TripPattern, resultIndex?: number): void;
};

export const NonTransitResults = ({trips, onDetailsPressed}: Props) => {
  const {language} = useTranslation();
  const style = useStyle();

  if (trips.map((t) => t.trip).every(isBlank)) return null;

  return (
    <ScrollView horizontal={true} style={style.container}>
      {trips.map((trip, i) => {
        // Non-transit trips will only have one trip pattern.
        const tripPattern = trip.trip?.tripPatterns[0];
        if (!tripPattern) return null;
        return (
          <Button
            style={style.tripMode}
            key={trip.mode}
            type={'pill'}
            interactiveColor={'interactive_2'}
            text={secondsToDurationShort(tripPattern.duration, language)}
            leftIcon={{svg: getTransportModeSvg(trip.mode)}}
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
