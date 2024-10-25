import {IconButtonProps} from '@atb/components/screen-header';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {useChatUnreadCount} from './use-chat-unread-count';
import {ContrastColor} from '@atb/theme/colors';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {ContactSheet} from '@atb/chat/ContactSheet';
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
  const {theme} = useTheme();
  const {open: openBottomSheet} = useBottomSheet();
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();

  const openContactSheet = () => {
    openBottomSheet(() => (
      <ContactSheet
        onReportParkingViolation={() =>
          navigation.navigate('Root_ParkingViolationsSelectScreen')
        }
      />
    ));
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
                  color: theme.color.status.valid.primary,
                  backgroundColor: color,
                }
              : undefined
          }
        />
      </View>
    ),
    accessibilityHint: t(ScreenHeaderTexts.headerButton.chat.a11yHint),
    onPress: () => openContactSheet(),
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
