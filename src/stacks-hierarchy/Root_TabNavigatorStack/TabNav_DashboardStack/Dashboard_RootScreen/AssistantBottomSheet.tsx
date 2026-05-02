import React, {PropsWithChildren} from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {StyleSheet} from '@atb/theme';

type Props = PropsWithChildren<{
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
}>;

export const AssistantBottomSheet = ({
  children,
  locationArrowOnPress,
  navigateToScanQrCode,
}: Props) => {
  const styles = useStyles();
  return (
    <MapBottomSheet
      snapPoints={['15%', '50%', '90%']}
      index={1}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      canMinimize={false}
      bottomSheetHeaderType={BottomSheetHeaderType.None}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      <BottomSheetScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
      >
        {children}
      </BottomSheetScrollView>
    </MapBottomSheet>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  scroll: {
    backgroundColor: theme.color.background.neutral[1].background,
  },
}));
