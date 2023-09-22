import {StyleSheet} from '@atb/theme';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';

const CAPTURE_BUTTON_SIZE = 78;

type Props = {
  onCapture: () => void;
  style?: StyleProp<ViewStyle>;
};

export const CaptureButton = ({style: containerStyle, onCapture}: Props) => {
  const style = useStyles();
  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onCapture} style={style.button} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  button: {
    height: CAPTURE_BUTTON_SIZE,
    width: CAPTURE_BUTTON_SIZE,
    backgroundColor: 'transparent',
    borderWidth: CAPTURE_BUTTON_SIZE * 0.1,
    borderRadius: 100,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
}));
