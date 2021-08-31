import {Chat, ChatUnread} from '@atb/assets/svg/icons/actions';
import {IconButton} from '@atb/components/screen-header/HeaderButton';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import useChatUnreadCount from './use-chat-unread-count';
import {ThemeColor} from '@atb/theme/colors';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import ContactSheet from '@atb/chat/ContactSheet';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';

export default function useChatIcon(
  color?: ThemeColor,
): IconButton | undefined {
  const unreadCount = useChatUnreadCount();
  const styles = useStyles();
  const {open: openBottomSheet} = useBottomSheet();
  const {t} = useTranslation();

  const openContactSheet = () => {
    openBottomSheet((close, focusRef) => (
      <ContactSheet close={close} ref={focusRef} />
    ));
  };

  return {
    icon: (
      <View style={styles.chatContainer}>
        {unreadCount ? (
          <ThemeIcon colorType={color} svg={ChatUnread} />
        ) : (
          <ThemeIcon colorType={color} svg={Chat} />
        )}
      </View>
    ),
    accessibilityHint: t(ScreenHeaderTexts.headerButton.chat.a11yHint),
    onPress: () => openContactSheet(),
  };
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  chatContainer: {
    width: 36,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
  },
}));
