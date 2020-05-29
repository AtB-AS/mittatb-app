import React from 'react';
import Intercom from 'react-native-intercom';
import ChatIcon from '../assets/svg/ChatIcon';
import useChatUnreadCount from './use-chat-unread-count';

export default function useChatIcon() {
  const unreadCount = useChatUnreadCount();

  return {
    icon: <ChatIcon unreadCount={unreadCount} />,
    openChat: () =>
      unreadCount
        ? Intercom.displayMessenger()
        : Intercom.displayMessageComposer(),
  };
}
