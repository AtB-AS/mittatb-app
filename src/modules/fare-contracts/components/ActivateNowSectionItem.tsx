import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {RefObject, useRef} from 'react';
import {ActivateNowBottomSheet} from './ActivateNowBottomSheet';
import {useThemeContext} from '@atb/theme';

type ActivateNowSectionItemProps = SectionItemProps<{
  fareContractId: string;
  fareProductType: string | undefined;
}>;

export function ActivateNowSectionItem({
  fareContractId,
  fareProductType,
  ...sectionProps
}: ActivateNowSectionItemProps): React.JSX.Element {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
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
      interactiveColor={theme.color.interactive[0]}
      rightIcon={{svg: TicketValid, color: theme.color.interactive[0].default}}
      ref={onCloseFocusRef}
      {...sectionProps}
    />
  );
}
