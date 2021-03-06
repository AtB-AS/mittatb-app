import {Chat, ChatUnread} from '@atb/assets/svg/icons/actions';
import {IconButton} from '@atb/components/screen-header/HeaderButton';
import ThemeIcon from '@atb/components/theme-icon';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import Intercom from 'react-native-intercom';
import useChatUnreadCount from './use-chat-unread-count';
import {ThemeColor} from '@atb/theme/colors';

export default function useChatIcon(
  color?: ThemeColor,
): IconButton | undefined {
  const config = useRemoteConfig();
  const unreadCount = useChatUnreadCount();
  const styles = useStyles();

  if (!config.enable_intercom) {
    return undefined;
  }

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
    onPress: () =>
      unreadCount
        ? Intercom.displayMessenger()
        : Intercom.displayConversationsList(),
    importantForAccessibility: 'no-hide-descendants', // Android
    accessibilityElementsHidden: true, // iOS
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
