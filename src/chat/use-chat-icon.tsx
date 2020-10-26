import React from 'react';
import {View} from 'react-native';
import Intercom from 'react-native-intercom';
import {Chat, ChatUnread} from '../assets/svg/icons/actions';
import useChatUnreadCount from './use-chat-unread-count';
import {useRemoteConfig} from '../RemoteConfigContext';
import {StyleSheet} from '../theme';
import ThemeIcon from '../components/themed-icon';

export default function useChatIcon() {
  const config = useRemoteConfig();
  const unreadCount = useChatUnreadCount();
  const styles = useStyles();

  if (!config.enable_intercom) {
    return undefined;
  }

  return {
    icon: (
      <View
        accessible={true}
        accessibilityLabel="Brukerstøtte"
        accessibilityRole="button"
        style={styles.chatContainer}
      >
        {unreadCount ? (
          <ThemeIcon svg={ChatUnread} />
        ) : (
          <ThemeIcon svg={Chat} />
        )}
      </View>
    ),
    onPress: () =>
      unreadCount
        ? Intercom.displayMessenger()
        : Intercom.displayConversationsList(),
  };
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  chatContainer: {
    width: 36,
    height: 28,
    backgroundColor: theme.button.primary.bg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
}));
