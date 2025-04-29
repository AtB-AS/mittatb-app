import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {BusLiveArrow} from '@atb/assets/svg/mono-icons/navigation';

type DirectionArrowProps = {
  vehicleBearing: number;
  heading: number;
  iconSize: number;
  iconScale: number;
  fill: string;
};

export const DirectionArrow: React.FC<DirectionArrowProps> = ({
  vehicleBearing,
  heading,
  iconSize,
  iconScale,
  fill,
}) => {
  const styles = useStyles();

  const vehicleBearingDefined =
    vehicleBearing === undefined ? 0 : vehicleBearing; // fallback to 0
  const bearingRadians =
    ((90 - vehicleBearingDefined + heading) * Math.PI) / 180; // start at 90 degrees, go counter clockwise and convert from degrees to radians
  const rotateDegrees = vehicleBearingDefined - heading;

  const directionArrowOffsetFromCenter = iconScale * iconSize * 0.7;

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
        color={fill}
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
