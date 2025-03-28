import React, {useEffect, useRef} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  AccessibilityRole,
  InteractionManager,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import {StyleSheet} from '@atb/theme';

type BottomSheetContainerProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  initialIndex?: number;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  onClose?: () => void;
  headerNode?: React.ReactNode;
};

export const BottomSheetContainer = ({
  children,
  snapPoints = ['50%'],
  initialIndex = 0,
  accessibilityLabel = 'Bottom Sheet',
  accessibilityRole = 'summary',
  onClose,
}: BottomSheetContainerProps) => {
  const sheetRef = useRef<BottomSheet>(null);
  const styles = useStyles();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      sheetRef.current?.snapToIndex(0);

      // Announce to screen readers
      if (Platform.OS === 'ios') {
        AccessibilityInfo.announceForAccessibility('Bottom sheet opened');
      }
    });

    return () => task.cancel();
  }, [initialIndex]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index === -1) handleClose();
      }}
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      accessibilityLabel={accessibilityLabel}
      enableContentPanningGesture={true} // Try setting to true
      backdropComponent={() => null}
    >
      <BottomSheetScrollView
        accessible={true}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        style={styles.sheetContent}
        importantForAccessibility="yes"
        accessibilityViewIsModal={true}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderBottomWidth: theme.border.width.slim,
    borderBottomColor: theme.color.border.primary,
  },
  background: {
    backgroundColor: theme.color.background.neutral[1].background,
  },
  handle: {
    backgroundColor: theme.color.background.neutral[3].background,
  },
  sheetContent: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    width: '100%',
  },
}));
