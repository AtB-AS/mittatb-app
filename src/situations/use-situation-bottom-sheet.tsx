import {useBottomSheet} from '@atb/components/bottom-sheet';
import React from 'react';
import {SituationBottomSheet} from './SituationBottomSheet';
import {SituationType} from './types';

export const useSituationBottomSheet = ({
  onCloseRef,
}: {
  onCloseRef: React.RefObject<any>;
}) => {
  const {open: openBottomSheet, onOpenFocusRef} = useBottomSheet();

  const openSituation = (situation: SituationType) => {
    openBottomSheet(
      () => <SituationBottomSheet situation={situation} ref={onOpenFocusRef} />,
      false,
      onCloseRef,
    );
  };

  return {openSituation};
};
