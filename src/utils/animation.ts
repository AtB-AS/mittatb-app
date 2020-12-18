import {LayoutAnimation} from 'react-native';

export function animateNextChange() {
  if (LayoutAnimation && LayoutAnimation.configureNext) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }
}
