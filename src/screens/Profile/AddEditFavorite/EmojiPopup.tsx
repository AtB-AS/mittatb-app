import React from 'react';
import EmojiSelector, {RenderedEmoji} from './Emojis';
import {StyleSheet, Theme} from '../../../theme';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import MapPointIcon from '../../../assets/svg/MapPointIcon';

type EmojiPopupProps = {
  value?: RenderedEmoji;
  open: boolean;
  onEmojiSelected(emoji: RenderedEmoji): void;
  onClose?(): void;
};
export default function EmojiPopup({
  open,
  value,
  onEmojiSelected,
  onClose,
}: EmojiPopupProps) {
  const css = useModalStyle();

  return (
    <Modal
      isVisible={open}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      hideModalContentWhileAnimating={true}
      swipeDirection="down"
      propagateSwipe
      useNativeDriver
      style={{margin: 0, justifyContent: 'flex-end'}}
    >
      <View style={css.content}>
        <EmojiSelector
          value={value}
          onEmojiSelected={onEmojiSelected}
          placeholder="Søk etter symbol"
          maxEmojiVersion="2"
          clearText={<MapPointIcon height={30} width={30} />}
        />
      </View>
    </Modal>
  );
}

const useModalStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    height: '70%',
    backgroundColor: theme.background.modal_Level2,
    padding: theme.sizes.pagePadding,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
}));
