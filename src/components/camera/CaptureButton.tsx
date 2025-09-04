import {StyleSheet} from '@atb/theme';
import {RefObject} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {PressableOpacity} from '../pressable-opacity';

type Props = {
  onCapture: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  color?: string;
  focusRef?: RefObject<any>;
};

export const CaptureButton = ({
  style: containerStyle,
  onCapture,
  size,
  color,
  focusRef,
}: Props) => {
  const style = useStyles({size, color})();
  return (
    <View style={containerStyle}>
      <PressableOpacity onPress={onCapture} style={style.button} ref={focusRef}>
        <View style={style.innerButton} />
      </PressableOpacity>
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
