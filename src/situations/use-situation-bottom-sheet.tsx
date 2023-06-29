import {useBottomSheet} from '@atb/components/bottom-sheet';
import React from 'react';
import {SituationBottomSheet} from './SituationBottomSheet';
import {SituationType} from './types';

export const useSituationBottomSheet = () => {
  const {open: openBottomSheet} = useBottomSheet();

  const openSituation = (situation: SituationType) => {
    openBottomSheet((close, onOpenFocusRef) => (
      <SituationBottomSheet
        situation={situation}
        close={close}
        ref={onOpenFocusRef}
      />
    ));
  };

  return {openSituation};
};
