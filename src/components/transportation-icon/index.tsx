import React from 'react';
import {View, StyleProp, ViewStyle, AccessibilityProps} from 'react-native';
import {
  BusSide,
  TramSide,
  TrainSide,
  PlaneSide,
  FerrySide,
  WalkingPerson,
} from '../../assets/svg/icons/transportation';
import {LegMode} from '../../sdk';
import {StyleSheet} from '../../theme';
import {SvgProps} from 'react-native-svg';
import transportationColor from '../../utils/transportation-color';
import {useTranslation} from '../../translations';
import {getTranslatedModeName} from '../../utils/transportation-names';

export type TransportationIconProps = {
  mode?: LegMode;
  publicCode?: string;
  style?: StyleProp<ViewStyle>;
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  publicCode,
  style,
  children,
}) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {color} = transportationColor(mode, publicCode);

  return (
    <View style={styles.iconContainer}>
      {children ? (
        children
      ) : (
        <InnerIcon
          fill={color}
          style={style}
          mode={mode}
          accessibilityLabel={t(getTranslatedModeName(mode))}
        />
      )}
    </View>
  );
};

export default TransportationIcon;

function InnerIcon({
  mode,
  fill,
  style,
}: {
  fill: string;
  style?: StyleProp<ViewStyle>;
  mode?: LegMode;
} & AccessibilityProps) {
  const innerIconProps: SvgProps = {
    width: '100%',
    height: '100%',
    fill,
    style,
  };

  switch (mode) {
    case 'bus':
      return <BusSide key="bus" {...innerIconProps} />;
    case 'tram':
      return <TramSide key="tram" {...innerIconProps} />;
    case 'rail':
      return <TrainSide key="rail" {...innerIconProps} />;
    case 'air':
      return <PlaneSide key="airport" {...innerIconProps} />;
    case 'water':
      return <FerrySide key="boat" {...innerIconProps} />;
    case 'foot':
      return <WalkingPerson {...innerIconProps} />;
    case 'unknown':
    default:
      return null;
  }
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  iconContainer: {
    width: 20,
    height: 20,
  },
}));
