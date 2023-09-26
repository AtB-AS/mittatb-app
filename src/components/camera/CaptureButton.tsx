import {StyleSheet} from '@atb/theme';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';

type Props = {
  onCapture: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  color?: string;
};

export const CaptureButton = ({
  style: containerStyle,
  onCapture,
  size,
  color,
}: Props) => {
  const style = useStyles({size, color})();
  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onCapture} style={style.button}>
        <View style={style.innerButton} />
      </TouchableOpacity>
    </View>
  );
};

const useStyles = ({
  size = 78,
  color = 'rgba(255, 255, 255, 0.8)',
}: Pick<Props, 'size' | 'color'>) =>
  StyleSheet.createThemeHook(() => ({
    button: {
      height: size,
      width: size,
      backgroundColor: 'transparent',
      borderWidth: size * 0.05,
      borderRadius: size / 2,
      borderColor: color,
    },
    innerButton: {
      flex: 1,
      backgroundColor: color,
      borderRadius: size / 2,
      overflow: 'hidden',
      margin: size * 0.05,
    },
  }));
