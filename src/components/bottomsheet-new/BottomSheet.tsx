import React, {
  useCallback,
  useMemo,
  PropsWithChildren,
  useRef,
  useEffect,
} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {Platform} from 'react-native';
import {StyleSheet} from '@atb/theme';

export type BottomSheetProps = PropsWithChildren<{
  snapPoints?: Array<string | number>;
  enableDynamicSizing?: boolean;
  closeOnBackdropPress?: boolean;
  allowBackgroundTouch?: boolean;
  backdropPressBehavior?: 'none' | 'close' | 'collapse' | number;
  keyboardBehavior?: 'extend' | 'interactive' | 'fillParent';
  closeCallback?: () => void;
  detached?: boolean;
  bottomMargin?: number;
}>;

export const BottomSheet = ({
  snapPoints,
  enableDynamicSizing = true,
  closeOnBackdropPress = true,
  keyboardBehavior = Platform.OS === 'ios' ? 'interactive' : 'extend',
  children,
  allowBackgroundTouch,
  backdropPressBehavior,
  closeCallback,
  detached,
  bottomMargin,
}: BottomSheetProps) => {
  const styles = useStyles();
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    ref.current?.present();
  }, []);

  /*const handleClose = useCallback(() => {
    ref.current?.dismiss();
  }, []);*/

  const computedSnapPoints = useMemo(() => {
    if (enableDynamicSizing && (!snapPoints || snapPoints.length === 0))
      return undefined; // dynamic
    return snapPoints ?? ['25%', '50%', '90%'];
  }, [enableDynamicSizing, snapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={allowBackgroundTouch}
        pressBehavior={
          backdropPressBehavior ??
          (allowBackgroundTouch
            ? 'none'
            : closeOnBackdropPress
            ? 'close'
            : 'none')
        }
      />
    ),
    [allowBackgroundTouch, backdropPressBehavior, closeOnBackdropPress],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={computedSnapPoints}
      enableDynamicSizing={enableDynamicSizing}
      backdropComponent={allowBackgroundTouch ? undefined : renderBackdrop}
      enablePanDownToClose
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior="restore"
      accessibilityViewIsModal
      backgroundStyle={styles.modal}
      onAnimate={(from, to) => {
        if (to === -1) {
          closeCallback?.();
        }
      }}
      detached={detached}
      bottomInset={bottomMargin}
      accessible={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    backgroundColor: theme.color.background.neutral[1].background,
    paddingVertical: 16,
  },
  modal: {
    backgroundColor: theme.color.background.neutral[1].background,
  },
}));
