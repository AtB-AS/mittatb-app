import React from 'react';
import {StyleSheet, View} from 'react-native';
import Intercom from 'react-native-intercom';
import {Chat, ChatUnread} from '../assets/svg/icons/actions';
import useChatUnreadCount from './use-chat-unread-count';
import colors from '../theme/colors';

export default function useChatIcon() {
  const unreadCount = useChatUnreadCount();

  return {
    icon: (
      <View
      accessible={true} 
      accessibilityLabel="Brukerstøtte"
      accessibilityHint="Åpner et meldingsvindu" 
      accessibilityRole="button"
      style={styles.chatContainer}>
        {unreadCount ? <ChatUnread /> : <Chat />}
      </View>
    ),
    openChat: () =>
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
