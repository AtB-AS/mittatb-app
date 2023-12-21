import {LayoutChangeEvent, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {BottomSheetTexts, useTranslation} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';

type BottomSheetHeaderWithoutNavigationProps = {
  title?: string;
  closeBottomSheet?: () => void;
};

// Define the interface for the size
interface Size {
  width: number;
  height: number;
}

export const BottomSheetHeader = ({
  title,
  closeBottomSheet,
}: BottomSheetHeaderWithoutNavigationProps) => {
  const styles = useStyle();
  const {t} = useTranslation();

  const {theme} = useTheme();
  const {close: closeBottomSheetDefault, onOpenFocusRef} = useBottomSheet();

  const handleClose = closeBottomSheet ?? closeBottomSheetDefault;

  const themeColor = 'interactive_3';
  const {background: backgroundColor, text: textColor} =
    theme.interactive[themeColor]['active'];

  const [buttonSize, setButtonSize] = useState<Size>({width: 0, height: 0});
  const onButtonLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setButtonSize({width, height});
  };

  // Calculate hitSlop values
  const desiredHitboxSize = 48;
  const hitSlopSize = (desiredHitboxSize - buttonSize.height) / 2;

  const hitSlop = {
    top: hitSlopSize,
    bottom: hitSlopSize,
    left: hitSlopSize,
    right: hitSlopSize,
  };

  return (
    <View style={styles.container}>
      {/*Placeholder to center the title correctly*/}
      <View style={[styles.button, {opacity: 0}]}>
        <ThemeIcon svg={Close} size="normal" />
      </View>
      <View
        accessibilityLabel={title}
        accessible={true}
        importantForAccessibility="yes"
        accessibilityRole="header"
        style={styles.headerTitle}
        ref={onOpenFocusRef}
      >
        <ThemeText accessible={false} type="body__primary--bold">
          {title}
        </ThemeText>
      </View>
      <TouchableOpacity
        onPress={handleClose}
        onLayout={onButtonLayout}
        hitSlop={hitSlop}
        style={[styles.button, {backgroundColor: backgroundColor}]}
        accessible={true}
        accessibilityLabel={t(BottomSheetTexts.closeButton.a11yLabel)}
        accessibilityHint={t(BottomSheetTexts.closeButton.a11yHint)}
        accessibilityRole="button"
      >
        <ThemeIcon fill={textColor} svg={Close} size="normal" />
      </TouchableOpacity>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacings.medium,
      marginVertical: theme.spacings.large,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacings.small,
      borderRadius: 100,
    },

    headerTitle: {alignItems: 'center', flex: 1},
  };
});
