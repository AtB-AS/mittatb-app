import {TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {RefObject, useRef} from 'react';
import {RefundBottomSheet} from './RefundBottomSheet';

type RefundSectionItemProps = SectionItemProps<{
  orderId: string;
  fareProductType: string | undefined;
}>;

export function RefundSectionItem({
  orderId,
  fareProductType,
  ...sectionProps
}: RefundSectionItemProps): JSX.Element {
  const {t} = useTranslation();
  const {open} = useBottomSheetContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const onPress = () => {
    open(
      () => (
        <RefundBottomSheet
          orderId={orderId}
          fareProductType={fareProductType}
        />
      ),
      onCloseFocusRef,
    );
  };

  return (
    <LinkSectionItem
      text={t(FareContractTexts.refund.refund)}
      onPress={onPress}
      icon={<ThemeIcon svg={TicketInvalid} />}
      ref={onCloseFocusRef}
      {...sectionProps}
    />
  );
}
