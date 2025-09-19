import {useBottomSheet} from '@gorhom/bottom-sheet';
import {SharedValue, useDerivedValue} from 'react-native-reanimated';

export function BottomSheetTopPositionBridge({
  sheetTopPosition,
}: {
  sheetTopPosition: SharedValue<number>;
}) {
  // Returns the coordinate of the top of the bottom sheet relative to the screen in pixels.
  // Where 0 is the top of the screen and positive values move downwards.
  const {animatedPosition} = useBottomSheet();
  useDerivedValue(() => {
    if (sheetTopPosition.value !== animatedPosition.value) {
      sheetTopPosition.value = animatedPosition.value;
    }
  });
  return null;
}
