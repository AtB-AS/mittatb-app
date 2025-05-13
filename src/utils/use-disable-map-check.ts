import {Platform} from 'react-native';
import {useAccessibilityContext} from '@atb/modules/accessibility';

// There are currently issues with VoiceOver and MapBox on iOS.
// A proper fix is in the works but seem non-trivial.
// Currently best workaround is to disable map integration
// when voice over is active. Not ideal by any means,
// but for now better than crashing the entire application.
// @TODO This should be removed as soon as possible.
export function useDisableMapCheck() {
  const a11yContext = useAccessibilityContext();
  return a11yContext.isScreenReaderEnabled && Platform.OS === 'ios';
}
