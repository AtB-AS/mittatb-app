import {TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';

type RefundSectionItemProps = SectionItemProps<{
  onCloseFocusRef: React.RefObject<View | null>;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}>;

export function RefundSectionItem({
  bottomSheetModalRef,
  onCloseFocusRef,
  ...sectionProps
}: RefundSectionItemProps): React.JSX.Element {
  const {t} = useTranslation();

  const onPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <LinkSectionItem
      text={t(FareContractTexts.refund.refund)}
      onPress={onPress}
      rightIcon={{svg: TicketInvalid}}
      ref={onCloseFocusRef}
      {...sectionProps}
    />
  );
}
