import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {IconButtonProps} from '@atb/components/screen-header';
import {ThemeIcon} from '@atb/components/theme-icon';
import React from 'react';
import {StaticColor, TextColor} from '@atb/theme/colors';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {ContactSheet} from '@atb/chat/ContactSheet';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {useChatUnreadCount} from '@atb/chat/use-chat-unread-count';

export const useChatIcon = (
  color?: StaticColor | TextColor,
  testID?: string,
): IconButtonProps | undefined => {
  const unreadCount = useChatUnreadCount();
  const {open: openBottomSheet} = useBottomSheet();
  const {t} = useTranslation();

  const openContactSheet = () => {
    openBottomSheet((close, focusRef) => (
      <ContactSheet close={close} ref={focusRef} />
    ));
  };

  return {
    children: (
      <ThemeIcon
        testID={testID}
        colorType={color}
        svg={Chat}
        notification={unreadCount > 0 ? {color: 'valid'} : undefined}
      />
    ),
    accessibilityHint: t(ScreenHeaderTexts.headerButton.chat.a11yHint),
    onPress: () => openContactSheet(),
  };
};
