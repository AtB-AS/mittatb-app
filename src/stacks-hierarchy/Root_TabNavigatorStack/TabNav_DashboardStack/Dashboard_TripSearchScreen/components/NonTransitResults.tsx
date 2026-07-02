import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button} from '@atb/components/button';
import {SkeletonBlock} from '@atb/screen-components/travel-card';
import {useIsExperimentalEnabled} from '@atb/modules/experimental';
import {secondsToDuration, secondsToDurationShort} from '@atb/utils/date';
import {
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TripPattern} from '@atb/api/types/trips';
import {getTransportModeSvg} from '@atb/components/icon-box';
import ChevronRight from '@atb/assets/svg/mono-icons/navigation/ChevronRight';
import {TripPatternFragment} from '@atb/api/types/generated/fragments/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useNonTransitTripsQuery} from '../use-non-transit-trips-query';
import {TripsProps} from '../use-trips';

type OnPressedOptions = {
  analyticsMetadata?: {[key: string]: any};
};

type Props = {
  tripsProps: TripsProps;
  onDetailsPressed: (tripDetails: TripPattern, opts: OnPressedOptions) => void;
};

export const NonTransitResults = ({tripsProps, onDetailsPressed}: Props) => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const style = useStyle();
  const isNewTripSearch = useIsExperimentalEnabled('isNewTripSearchEnabled');
  const {data: tripPatterns, isLoading} = useNonTransitTripsQuery(tripsProps);

  if (isNewTripSearch && isLoading) {
    return (
      <View style={[style.container, style.skeletonContainer]}>
        <SkeletonBlock style={style.skeletonPill} />
        <SkeletonBlock style={style.skeletonPill} delay={150} />
      </View>
    );
  }

  if (!tripPatterns?.length) return null;

  return (
    <ScrollView
      horizontal={true}
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
            expanded={false}
            onPress={() => onDetailsPressed(tripPattern, {analyticsMetadata})}
            style={style.tripMode}
            key={modeText}
            type="small"
            interactiveColor={interactiveColor}
            text={`${modeText} ${durationShort}`}
            leftIcon={{svg: getTransportModeSvg(mode).svg}}
            rightIcon={{svg: ChevronRight}}
            accessibilityLabel={`${modeText} ${duration}`}
            testID={
              tripPattern.legs.some((leg) => leg.rentedBike)
                ? 'rentalResult'
                : `${mode}Result`
            }
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

const useStyle = StyleSheet.createThemeHook((theme, _, {fontScale}) => ({
  container: {
    paddingHorizontal: theme.spacing.medium,
  },
  tripMode: {
    marginRight: theme.spacing.small,
  },
  skeletonContainer: {
    flexDirection: 'row',
  },
  skeletonPill: {
    width: 150,
    height:
      theme.typography.body__s.lineHeight * fontScale +
      theme.spacing.xSmall * 2,
    borderRadius: theme.border.radius.circle,
    marginRight: theme.spacing.small,
  },
}));
