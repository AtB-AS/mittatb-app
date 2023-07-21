import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {Button} from '@atb/components/button';
import {secondsToDuration, secondsToDurationShort} from '@atb/utils/date';
import {NonTransitTripsQuery} from '@atb/api/types/generated/TripsQuery';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {TripPattern} from '@atb/api/types/trips';
import {getTransportModeSvg} from '@atb/components/icon-box';
import arrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';
import {MapFilterType} from '@atb/components/map';

type OnPressedOptions = {
  analyticsMetadata?: {[key: string]: any};
  mapFilter?: MapFilterType | undefined;
};

type Props = {
  trips: NonTransitTripsQuery[];
  onDetailsPressed: (tripDetails: TripPattern, opts: OnPressedOptions) => void;
};

export const NonTransitResults = ({trips, onDetailsPressed}: Props) => {
  const {t, language} = useTranslation();
  const style = useStyle();

  return (
    <ScrollView horizontal={true} style={style.container}>
      {trips.map((trip) => {
        // Non-transit trips will only have one trip pattern.
        const tripPattern = trip.trip?.tripPatterns[0];
        if (!tripPattern) return null;
        const mode = t(TripSearchTexts.nonTransit.travelMode(trip.mode));
        const durationShort = secondsToDurationShort(
          tripPattern.duration,
          language,
        );
        const duration = secondsToDuration(tripPattern.duration, language);
        const analyticsMetadata = {mode: trip.mode, duration: durationShort};
        const mapFilter =
          trip.mode === 'bike_rental'
            ? {stations: {cityBikeStations: {showAll: true, operators: []}}}
            : undefined;
        return (
          <TouchableOpacity
            key={trip.mode}
            style={style.tripMode}
            onPress={() =>
              onDetailsPressed(tripPattern, {analyticsMetadata, mapFilter})
            }
          >
            <Button
              type={'pill'}
              interactiveColor={'interactive_2'}
              text={`${mode} ${durationShort}`}
              leftIcon={{svg: getTransportModeSvg(trip.mode).svg}}
              rightIcon={{svg: arrowRight}}
              accessibilityLabel={`${mode} ${duration}`}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingTop: theme.spacings.xSmall,
  },
  tripMode: {
    marginRight: theme.spacings.small,
    paddingVertical: theme.spacings.small,
  },
}));
