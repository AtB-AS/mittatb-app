import {TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {BottomSheetTexts, useTranslation} from '@atb/translations';

export default function ClickableBackground({
  isOpen,
  close,
  height,
}: {
  isOpen: boolean;
  close: () => void;
  height: number;
}) {
  const styles = useStyles();
  const {t} = useTranslation();
  if (!isOpen) return null;

  return (
    <TouchableWithoutFeedback
      onPress={close}
      accessibilityLabel={t(BottomSheetTexts.background.a11yLabel)}
      accessibilityHint={t(BottomSheetTexts.background.a11yHint)}
    >
      <View
        style={{
          ...styles.clickableBackground,
          bottom: height,
        }}
        pointerEvents={'box-only'}
      />
    </TouchableWithoutFeedback>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  clickableBackground: {
    backgroundColor: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
}));
