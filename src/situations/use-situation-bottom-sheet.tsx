import {useBottomSheet} from '@atb/components/bottom-sheet';
import React from 'react';
import {SituationBottomSheet} from './SituationBottomSheet';
import {SituationType} from './types';

export const useSituationBottomSheet = () => {
  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    onOpenFocusRef,
  } = useBottomSheet();

  const openSituation = (situation: SituationType) => {
    openBottomSheet(() => (
      <SituationBottomSheet
        situation={situation}
        close={closeBottomSheet}
        ref={onOpenFocusRef}
      />
    ));
  };

  return {openSituation};
};
