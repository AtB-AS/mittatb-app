import React from 'react';
import {ScrollView} from 'react-native';
import {Button} from '@atb/components/button';
import {secondsToDuration, secondsToDurationShort} from '@atb/utils/date';
import {
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {TripPattern} from '@atb/api/types/trips';
import {getTransportModeSvg} from '@atb/components/icon-box';
import arrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';
import {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

type OnPressedOptions = {
  analyticsMetadata?: {[key: string]: any};
};

type Props = {
  tripPatterns: TripPatternFragment[];
  onDetailsPressed: (tripDetails: TripPattern, opts: OnPressedOptions) => void;
};

export const NonTransitResults = ({tripPatterns, onDetailsPressed}: Props) => {
  const {t, language} = useTranslation();
  const style = useStyle();

  return (
    <ScrollView
      horizontal={true}
      style={style.scrollView}
      contentContainerStyle={style.container}
      showsHorizontalScrollIndicator={false}
    >
      {tripPatterns.map((tripPattern) => {
        const {mode, modeText} = getMode(tripPattern, t);
        const durationShort = secondsToDurationShort(
          tripPattern.duration,
          language,
        );
        const duration = secondsToDuration(tripPattern.duration, language);
        const analyticsMetadata = {mode, duration: durationShort};
        return (
          <Button
            onPress={() => onDetailsPressed(tripPattern, {analyticsMetadata})}
            style={style.tripMode}
            key={modeText}
            type="small"
            interactiveColor="interactive_2"
            text={`${modeText} ${durationShort}`}
            leftIcon={{svg: getTransportModeSvg(mode).svg}}
            rightIcon={{svg: arrowRight}}
            accessibilityLabel={`${modeText} ${duration}`}
          />
        );
      })}
    </ScrollView>
  );
};

const getMode = (
  tp: TripPatternFragment,
  t: TranslateFunction,
): {mode: Mode; modeText: string} => {
  let mode = tp.legs[0].mode;
  let text = t(TripSearchTexts.nonTransit.unknown);

  if (tp.legs.some((leg) => leg.rentedBike)) {
    mode = Mode.Bicycle;
    text = t(TripSearchTexts.nonTransit.bikeRental);
  } else if (tp.legs[0].mode === Mode.Foot) {
    text = t(TripSearchTexts.nonTransit.foot);
  } else if (tp.legs[0].mode === Mode.Bicycle) {
    text = t(TripSearchTexts.nonTransit.bicycle);
  }

  return {mode, modeText: text};
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  scrollView: {
    marginTop: theme.spacings.medium,
  },
  container: {
    paddingHorizontal: theme.spacings.medium,
  },
  tripMode: {
    marginRight: theme.spacings.small,
  },
}));
