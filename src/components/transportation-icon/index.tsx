import React from 'react';
import {View} from 'react-native';
import {
  BusSide,
  TramSide,
  TrainSide,
  PlaneSide,
  FerrySide,
  WalkingPerson,
  Subway,
} from '@atb/assets/svg/mono-icons/transportation';
import {LegMode, TransportSubmode, TransportMode} from '@atb/sdk';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {
  Mode as Mode_v2,
  TransportMode as TransportMode_v2,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TransportSubmode as TransportSubMode_v2} from '@atb/api/types/generated/journey_planner_v3_types';
import ThemeText from '@atb/components/text';

export type AnyMode = LegMode | Mode_v2 | TransportMode | TransportMode_v2;
export type AnySubMode = TransportSubmode | TransportSubMode_v2;

export type TransportationIconProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  lineNumber?: string;
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  subMode,
  lineNumber,
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = useThemeColorForTransportMode(mode, subMode);
  const backgroundColor = theme.colors[themeColor].backgroundColor;
  const svg = getTransportModeSvg(mode);
  const styles = useStyles();

  const lineNumberElement = lineNumber ? (
    <ThemeText type="body__primary--bold" color={themeColor}>
      {lineNumber}
    </ThemeText>
  ) : null;

  return svg ? (
    <View style={[styles.transportationIcon, {backgroundColor}]}>
      <ThemeIcon
        style={styles.lineNumber}
        svg={svg}
        colorType={themeColor}
        accessibilityLabel={t(getTranslatedModeName(mode))}
      />
      {lineNumberElement}
    </View>
  ) : null;
};

export default TransportationIcon;

export function getTransportModeSvg(mode?: AnyMode) {
  switch (mode) {
    case 'bus':
    case 'coach':
      return BusSide;
    case 'tram':
      return TramSide;
    case 'rail':
      return TrainSide;
    case 'air':
      return PlaneSide;
    case 'water':
      return FerrySide;
    case 'foot':
      return WalkingPerson;
    case 'metro':
      return Subway;
    default:
      return null;
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationIcon: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacings.xSmall,
    paddingRight: theme.spacings.small,
    paddingLeft: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
    marginHorizontal: theme.spacings.xSmall,
  },
  lineNumber: {
    marginHorizontal: theme.spacings.xSmall,
  },
}));
