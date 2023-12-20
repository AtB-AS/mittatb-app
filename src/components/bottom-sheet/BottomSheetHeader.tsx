import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {useBottomSheet} from '@atb/components/bottom-sheet';

type BottomSheetHeaderWithoutNavigationProps = {
  shouldHaveLeftButton?: boolean;
  title?: string;
  titleA11yLabel?: string;
};

export const BottomSheetHeader = ({
  shouldHaveLeftButton = false,
  title,
  titleA11yLabel,
}: BottomSheetHeaderWithoutNavigationProps) => {
  const styles = useStyle();
  const themeColor = 'background_accent_4';

  const {close: closeBottomSheet, onOpenFocusRef} = useBottomSheet();

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
      {shouldHaveLeftButton ? (
        <TouchableOpacity
          hitSlop={hitSlop}
          style={styles.button}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <ThemeIcon svg={Close} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderButton} />
      )}
      <View
        accessibilityLabel={titleA11yLabel}
        accessible={true}
        importantForAccessibility="yes"
        accessibilityRole="header"
        style={styles.headerTitle}
        ref={onOpenFocusRef}
      >
        <ThemeText
          accessible={false}
          type="body__primary--bold"
          color={themeColor}
        >
          {title}
        </ThemeText>
      </View>
      <TouchableOpacity
        onPress={closeBottomSheet}
        hitSlop={hitSlop}
        style={styles.button}
        activeOpacity={0.7}
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
