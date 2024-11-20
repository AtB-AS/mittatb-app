import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useTheme} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ConsumeCarnetBottomSheet} from './ConsumeCarnetBottomSheet';

type ConsumeCarnetSectionItemProps = SectionItemProps<{
  fareContractId: string;
}>;

export function ConsumeCarnetSectionItem({
  fareContractId,
  ...sectionProps
}: ConsumeCarnetSectionItemProps): JSX.Element {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const interactiveColor = theme.color.interactive[0];

  const {open} = useBottomSheet();
  const onPress = () => {
    open(() => <ConsumeCarnetBottomSheet fareContractId={fareContractId} />);
  };

  return (
    <LinkSectionItem
      text={t(FareContractTexts.carnet.activateCarnet)}
      onPress={onPress}
      icon={<ThemeIcon svg={TicketValid} color={interactiveColor.default} />}
      interactiveColor={interactiveColor}
      {...sectionProps}
    />
  );
}
