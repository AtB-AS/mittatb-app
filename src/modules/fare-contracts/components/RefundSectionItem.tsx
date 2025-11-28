import {TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {useRef} from 'react';
import {RefundBottomSheet} from './RefundBottomSheet';
import {FareContractState} from '@atb-as/utils';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';

type RefundSectionItemProps = SectionItemProps<{
  orderId: string;
  fareProductType: string | undefined;
  state: FareContractState;
}>;

export function RefundSectionItem({
  orderId,
  fareProductType,
  state,
  ...sectionProps
}: RefundSectionItemProps): React.JSX.Element {
  const {t} = useTranslation();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const onPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <LinkSectionItem
        text={t(FareContractTexts.refund.refund)}
        onPress={onPress}
        rightIcon={{svg: TicketInvalid}}
        ref={onCloseFocusRef}
        {...sectionProps}
      />
      <RefundBottomSheet
        orderId={orderId}
        fareProductType={fareProductType}
        state={state}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
    </>
  );
}
