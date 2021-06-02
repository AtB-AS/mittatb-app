import {useWindowDimensions} from 'react-native';
import {MAX_FONT_SCALE} from '@atb/components/text';

export default function useFontScale() {
  const {fontScale} = useWindowDimensions();
  return Math.min(fontScale, MAX_FONT_SCALE);
}

export function useFontScaleClamp(): number {
  const {fontScale} = useWindowDimensions();
  if (fontScale > MAX_FONT_SCALE) {
    return MAX_FONT_SCALE / fontScale;
  }
  return 1;
}
