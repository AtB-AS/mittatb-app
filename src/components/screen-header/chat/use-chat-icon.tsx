import {IconButtonProps} from '@atb/components/screen-header';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {RefObject, useRef} from 'react';
import {View} from 'react-native';
import {useChatUnreadCount} from '@atb/modules/chat';
import {ContrastColor} from '@atb/theme/colors';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {ContactSheet} from './ContactSheet';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {Theme} from '@atb/theme/colors';

export const useChatIcon = (
  color?: ContrastColor,
  testID?: string,
): IconButtonProps | undefined => {
  const unreadCount = useChatUnreadCount();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {open: openBottomSheet} = useBottomSheetContext();
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const openContactSheet = () => {
    openBottomSheet(
      () => (
        <ContactSheet
          onReportParkingViolation={() =>
            navigation.navigate('Root_ParkingViolationsSelectScreen')
          }
        />
      ),
      onCloseFocusRef,
    );
  };

  return {
    children: (
      <View style={styles.chatContainer} testID={testID}>
        <ThemeIcon
          color={color}
          svg={Chat}
          notification={
            unreadCount
              ? {
                  color: theme.color.status.error.primary,
                  backgroundColor: color,
                }
              : undefined
          }
        />
      </View>
    ),
    accessibilityHint: t(ScreenHeaderTexts.headerButton.chat.a11yHint),
    onPress: () => openContactSheet(),
    focusRef: onCloseFocusRef,
  };
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  chatContainer: {
    width: 36,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
  },
}));
