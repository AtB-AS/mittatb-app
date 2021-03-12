import React, {
  forwardRef,
  ReactNode,
  RefObject,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  LayoutChangeEvent,
  View,
} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import getBackdrop from '@atb/components/bottom-sheet/CustomBackdrop';

type Props = {
  close: () => void;
  children: ReactNode;
};

const InternalBottomSheet = forwardRef<BottomSheet, Props>(
  ({close, children}, ref) => {
    const styles = useStyles();
    const {theme} = useTheme();
    const {bottom: safeAreBottom} = useSafeAreaInsets();

    const {snapPoints, layoutChangeListener} = useDynamicHeight();

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={getBackdrop(close)}
        handleComponent={null}
      >
        <BottomSheetView
          style={{
            ...styles.bottomSheet,
            paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
          }}
          onLayout={layoutChangeListener}
        >
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

/**
 * This is for making the height of the bottom sheet fit its content.
 */
const useDynamicHeight = () => {
  const [contentHeight, setContentHeight] = useState<string | number>(0);
  const layoutChangeListener = ({nativeEvent}: LayoutChangeEvent) => {
    setContentHeight(nativeEvent.layout.height);
  };
  const snapPoints = useMemo(() => [-1, contentHeight], [contentHeight]);
  return {
    snapPoints,
    layoutChangeListener,
  };
};

const useBottomSheet = (
  contentRenderer: (close: () => void, focusRef: RefObject<any>) => ReactNode,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const focusRef = useRef(null);
  const open = () => {
    bottomSheetRef.current?.expand();
    setIsOpen(true);
    const reactTag = findNodeHandle(focusRef.current);
    if (reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  };
  const close = () => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
  };

  return {
    open,
    isOpen,
    bottomSheet: (
      <InternalBottomSheet close={close} ref={bottomSheetRef}>
        <View
          style={{minHeight: 10}}
          accessibilityElementsHidden={true}
          importantForAccessibility={'no-hide-descendants'}
        >
          {contentRenderer(close, focusRef)}
        </View>
      </InternalBottomSheet>
    ),
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sections: {
    marginVertical: theme.spacings.medium,
  },
  bottomSheet: {
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level2,
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
  },
}));

export default useBottomSheet;
