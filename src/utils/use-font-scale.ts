import {useWindowDimensions} from 'react-native';
import {MAX_FONT_SCALE} from '@atb/components/text';

export function useFontScale() {
  const {fontScale} = useWindowDimensions();
  console.log('useFontScale', fontScale);
  return Math.min(fontScale, MAX_FONT_SCALE);
}
