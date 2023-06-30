import {IconButtonProps} from '@atb/components/screen-header';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {useChatUnreadCount} from './use-chat-unread-count';
import {StaticColor, TextColor} from '@atb/theme/colors';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {ContactSheet} from '@atb/chat/ContactSheet';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {Chat} from '@atb/assets/svg/mono-icons/actions';

export const useChatIcon = (
  color?: StaticColor | TextColor,
  testID?: string,
): IconButtonProps | undefined => {
  const unreadCount = useChatUnreadCount();
  const styles = useStyles();
  const {open: openBottomSheet, onOpenFocusRef} = useBottomSheet();
  const {t} = useTranslation();

  const openContactSheet = () => {
    openBottomSheet((close) => (
      <ContactSheet close={close} ref={onOpenFocusRef} />
    ));
  };

  return {
    children: (
      <View style={styles.chatContainer} testID={testID}>
        <ThemeIcon
          colorType={color}
          svg={Chat}
          notification={
            unreadCount
              ? {
                  color: 'valid',
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  chatContainer: {
    width: 36,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
  },
}));
