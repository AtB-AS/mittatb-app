import React from 'react';
import {dictionary, useTranslation} from '@atb/translations';
import {MessageSectionItem} from '@atb/components/sections';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {SituationType} from './types';
import {SituationBottomSheet} from './SituationBottomSheet';
import {View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

type Props = {
  situation: SituationType;
};

export const SituationSectionItem = ({situation}: Props) => {
  const {t, language} = useTranslation();
  const situationText = getSituationSummary(situation, language);
  const onCloseFocusRef = React.useRef<View | null>(null);
  const bottomSheetModalRef = React.useRef<BottomSheetModal | null>(null);

  if (!situationText) return null;

  return (
    <>
      <MessageSectionItem
        messageType={getMessageTypeForSituation(situation)}
        message={situationText}
        onPressConfig={{
          text: t(dictionary.readMore),
          action: () => bottomSheetModalRef.current?.present(),
        }}
        focusRef={onCloseFocusRef}
      />
      <SituationBottomSheet
        situation={situation}
        onCloseFocusRef={onCloseFocusRef}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
};
