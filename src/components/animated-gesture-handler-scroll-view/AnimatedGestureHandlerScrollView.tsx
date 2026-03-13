import {ScrollView} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

/**
 * An animated ScrollView (from react-native-reanimated), backed by
 * react-native-gesture-handler. Required for screens inside a MaterialTopTabNavigator,
 * where a regular Animated.ScrollView would cause scroll gesture conflicts 
 * with the tab swipe gesture. The gesture-handler variant ensures proper
 * gesture coordination, while the Reanimated wrapper enables worklet-based 
 * scroll handlers (useAnimatedScrollHandler)for UI-thread scroll tracking 
 * without JS bridge overhead.
 */
export const AnimatedGestureHandlerScrollView =
  Animated.createAnimatedComponent(ScrollView);
