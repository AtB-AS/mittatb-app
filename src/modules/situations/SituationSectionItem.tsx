import React from 'react';
import {dictionary, useTranslation} from '@atb/translations';
import {MessageSectionItem, SectionItemProps} from '@atb/components/sections';
import {getMessageTypeForSituation, getSituationSummary} from './utils';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {SituationBottomSheet} from './SituationBottomSheet';
import {View} from 'react-native';
import {BottomSheetModalMethods} from '@atb/components/bottom-sheet';

type Props = SectionItemProps<{
  situation: SituationFragment;
}>;

export const SituationSectionItem = ({situation, ...sectionProps}: Props) => {
  const {t, language} = useTranslation();
  const situationText = getSituationSummary(situation, language);
  const onCloseFocusRef = React.useRef<View | null>(null);
  const bottomSheetModalRef = React.useRef<BottomSheetModalMethods | null>(
    null,
  );

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
        {...sectionProps}
      />
      <SituationBottomSheet
        situation={situation}
        onCloseFocusRef={onCloseFocusRef}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
};
