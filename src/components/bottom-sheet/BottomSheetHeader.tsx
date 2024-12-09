import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {BottomSheetTexts, useTranslation} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {insets} from '@atb/utils/insets';

type BottomSheetHeaderWithoutNavigationProps = {
  title?: string;
  onClose?: () => void;
  focusTitleOnLoad: boolean;
};

export const BottomSheetHeader = ({
  title,
  onClose,
  focusTitleOnLoad,
}: BottomSheetHeaderWithoutNavigationProps) => {
  const styles = useStyle();
  const {t} = useTranslation();

  const {theme} = useTheme();
  const {close: closeBottomSheetDefault, onOpenFocusRef} = useBottomSheet();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    closeBottomSheetDefault();
  };

  const themeColor = theme.color.interactive[3];
  const {
    background: backgroundColor,
    foreground: {primary: textColor},
  } = themeColor.default;

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
        ref={focusTitleOnLoad ? onOpenFocusRef : undefined}
      >
        <ThemeText accessible={false} typography="body__primary--bold">
          {title}
        </ThemeText>
      </View>
      <TouchableOpacity
        onPress={handleClose}
        hitSlop={insets.all(10)}
        style={[styles.button, {backgroundColor: backgroundColor}]}
        accessible={true}
        accessibilityLabel={t(BottomSheetTexts.closeButton.a11yLabel)}
        accessibilityHint={t(BottomSheetTexts.closeButton.a11yHint)}
        accessibilityRole="button"
        testID="closeButton"
      >
        <ThemeIcon color={textColor} svg={Close} size="normal" />
      </TouchableOpacity>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacing.medium,
      marginVertical: theme.spacing.large,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.small,
      borderRadius: 100,
    },

    headerTitle: {alignItems: 'center', flex: 1},
  };
});
