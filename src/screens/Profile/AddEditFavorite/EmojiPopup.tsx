import React from 'react';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {StyleSheet, Theme} from '../../../theme';
import {View} from 'react-native';
import Modal from 'react-native-modal';

type EmojiPopupProps = {
  open: boolean;
  onEmojiSelected(emoji: string): void;
  onClose?(): void;
};
export default function EmojiPopup({
  open,
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
          showSearchBar={true}
          showTabs={false}
          showHistory={true}
          showSectionTitles={false}
          category={Categories.all}
          onEmojiSelected={onEmojiSelected}
          placeholder="Søk etter symbol"
        />
      </View>
    </Modal>
  );
}

const useModalStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    height: '50%',
    backgroundColor: theme.background.primary,
    padding: theme.sizes.pagePadding,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
}));
