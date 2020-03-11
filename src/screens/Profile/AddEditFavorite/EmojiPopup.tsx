import React, {useRef, useEffect} from 'react';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import RBSheet from 'react-native-raw-bottom-sheet';

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
  const refRBSheet = useRef<RBSheet>(null);

  useEffect(() => {
    if (!refRBSheet.current) return;
    if (open) {
      refRBSheet.current.open();
    } else {
      refRBSheet.current.close();
    }
  }, [open]);

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={true}
      onClose={onClose}
      height={500}
    >
      <EmojiSelector
        showSearchBar={true}
        showTabs={false}
        showHistory={true}
        showSectionTitles={false}
        category={Categories.all}
        onEmojiSelected={onEmojiSelected}
        placeholder="Søk etter symbol"
      />
    </RBSheet>
  );
}
