import {Platform, TextStyle} from 'react-native';

export const MAX_FONT_SCALE = 2;

export const screenReaderPause = '\n';

export function fontWeightToRobotoFamily(weight?: string) {
  switch (weight) {
    case '400':
      return 'Roboto-Regular';
    case '500':
      return 'Roboto-Medium';
    case '600':
    case 'bold':
      return 'Roboto-SemiBold';
    default:
      return 'Roboto-Regular';
  }
}

export function getTextWeightStyleWithCustomAndroidHandling(
  androidSystemFont: boolean,
  fontWeight: TextStyle['fontWeight'],
): TextStyle {
  // Android custom font handling
  if (Platform.OS === 'android' && !androidSystemFont) {
    return {
      fontFamily: fontWeightToRobotoFamily(fontWeight?.toString()),
      fontWeight: 'normal',
    };
  }

  // iOS + Android system font
  return {
    fontWeight: fontWeight,
  };
}
