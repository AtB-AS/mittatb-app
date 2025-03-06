import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {RefObject, useRef} from 'react';
import {ActivateNowBottomSheet} from './ActivateNowBottomSheet';

type ActivateNowSectionItemProps = SectionItemProps<{
  fareContractId: string;
  fareProductType: string | undefined;
}>;

export function ActivateNowSectionItem({
  fareContractId,
  fareProductType,
  ...sectionProps
}: ActivateNowSectionItemProps): JSX.Element {
  const {t} = useTranslation();
  const {open} = useBottomSheetContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const onPress = () => {
    open(
      () => (
        <ActivateNowBottomSheet
          fareContractId={fareContractId}
          fareProductType={fareProductType}
        />
      ),
      onCloseFocusRef,
    );
  };

  return (
    <LinkSectionItem
      text={t(FareContractTexts.activateNow.startNow)}
      onPress={onPress}
      icon={<ThemeIcon svg={TicketValid} />}
      ref={onCloseFocusRef}
      {...sectionProps}
    />
  );
}
