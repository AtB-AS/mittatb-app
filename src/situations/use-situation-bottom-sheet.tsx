import {useBottomSheet} from '@atb/components/bottom-sheet';
import React, {RefObject} from 'react';
import {SituationBottomSheet} from './SituationBottomSheet';
import {SituationType} from './types';

export const useSituationBottomSheet = ({
  onCloseFocusRef,
}: {
  onCloseFocusRef: RefObject<any>;
}) => {
  const {open: openBottomSheet, onOpenFocusRef} = useBottomSheet();

  const openSituation = (situation: SituationType) => {
    openBottomSheet(
      () => <SituationBottomSheet situation={situation} ref={onOpenFocusRef} />,
      undefined,
      onCloseFocusRef,
    );
  };

  return {openSituation};
};
