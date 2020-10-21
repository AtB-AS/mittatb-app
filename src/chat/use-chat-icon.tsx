import React from 'react';
import {StyleSheet, View} from 'react-native';
import Intercom from 'react-native-intercom';
import {Chat, ChatUnread} from '../assets/svg/icons/actions';
import useChatUnreadCount from './use-chat-unread-count';
import colors from '../theme/colors';
import {useRemoteConfig} from '../RemoteConfigContext';

export default function useChatIcon() {
  const config = useRemoteConfig();
  const unreadCount = useChatUnreadCount();

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
        {unreadCount ? <ChatUnread /> : <Chat />}
      </View>
    ),
    onPress: () =>
      unreadCount
        ? Intercom.displayMessenger()
        : Intercom.displayConversationsList(),
  };
}

const styles = StyleSheet.create({
  chatContainer: {
    width: 36,
    height: 28,
    backgroundColor: colors.secondary.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
