import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {BusLiveArrow} from '@atb/assets/svg/mono-icons/navigation';

type DirectionArrowProps = {
  bearingRadians: number;
  rotateDegrees: number;
  directionArrowOffsetFromCenter: number;
  iconSize: number;
  iconScale: number;
  fill: string;
};

export const DirectionArrow: React.FC<DirectionArrowProps> = ({
  bearingRadians,
  rotateDegrees,
  directionArrowOffsetFromCenter,
  iconSize,
  iconScale,
  fill,
}) => {
  const styles = useStyles();
  return (
    <View
      style={{
        ...styles.arrowIconContainer,
        ...{
          top: -Math.sin(bearingRadians) * directionArrowOffsetFromCenter,
          left: Math.cos(bearingRadians) * directionArrowOffsetFromCenter,
        },
      }}
    >
      <ThemeIcon
        svg={BusLiveArrow}
        fill={fill}
        width={iconSize}
        height={iconSize}
        style={{
          transform: [{rotate: `${rotateDegrees} deg`}, {scale: iconScale}],
        }}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  arrowIconContainer: {
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
}));
