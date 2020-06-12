import React from 'react';
import Intercom from 'react-native-intercom';
import {Chat, ChatUnread} from '../assets/svg/icons/actions';
import useChatUnreadCount from './use-chat-unread-count';

export default function useChatIcon() {
  const unreadCount = useChatUnreadCount();

  return {
    icon: unreadCount ? <ChatUnread /> : <Chat />,
    openChat: () =>
      unreadCount
        ? Intercom.displayMessenger()
        : Intercom.displayConversationsList(),
  };
}
