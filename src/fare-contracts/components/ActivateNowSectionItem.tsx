import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ActivateNowBottomSheet} from './ActivateNowBottomSheet';

type ActivateNowSectionItemProps = SectionItemProps<{
  fareContractId: string;
}>;

export function ActivateNowSectionItem({
  fareContractId,
  ...sectionProps
}: ActivateNowSectionItemProps): JSX.Element {
  const {t} = useTranslation();
  const {open} = useBottomSheet();
  const onPress = () => {
    open(() => <ActivateNowBottomSheet fareContractId={fareContractId} />);
  };

  return (
    <LinkSectionItem
      text={t(FareContractTexts.activateNow.startNow)}
      onPress={onPress}
      icon={<ThemeIcon svg={TicketValid} />}
      {...sectionProps}
    />
  );
}
