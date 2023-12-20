import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {BottomSheetTexts, useTranslation} from '@atb/translations';

type BottomSheetHeaderWithoutNavigationProps = {
  title?: string;
  closeBottomSheet?: () => void;
};

export const BottomSheetHeader = ({
  title,
  closeBottomSheet,
}: BottomSheetHeaderWithoutNavigationProps) => {
  const styles = useStyle();
  const {t} = useTranslation();

  const {close: closeBottomSheetDefault, onOpenFocusRef} = useBottomSheet();

  const handleClose = closeBottomSheet ?? closeBottomSheetDefault;
  // Calculate hitSlop values
  const iconSize = 28;
  const desiredHitboxSize = 48;
  const hitSlopSize = (desiredHitboxSize - iconSize) / 2;

  const hitSlop = {
    top: hitSlopSize,
    bottom: hitSlopSize,
    left: hitSlopSize,
    right: hitSlopSize,
  };

  return (
    <View style={styles.container}>
      <View style={styles.placeholderButton} />
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
        hitSlop={hitSlop}
        style={styles.button}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={t(BottomSheetTexts.closeButton.a11yLabel)}
        accessibilityHint={t(BottomSheetTexts.closeButton.a11yHint)}
        accessibilityRole="button"
      >
        <View style={styles.iconWrapper}>
          <ThemeIcon svg={Close} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const iconSize = 28;

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
    },
    placeholderButton: {
      width: iconSize,
      height: iconSize,
    },
    iconWrapper: {
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize / 2,
      backgroundColor: theme.static.background.background_3.background, // Adjust the color as needed
      justifyContent: 'center',
      alignItems: 'center',
    },

    headerTitle: {alignItems: 'center', flex: 1},
  };
});
