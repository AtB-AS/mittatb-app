import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useTheme} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ConsumeCarnetBottomSheet} from './ConsumeCarnetBottomSheet';

type ConsumeCarnetButtonProps = SectionItemProps<{
  fareContractId: string;
}>;

export function ConsumeCarnetSectionItem({
  fareContractId,
  ...sectionProps
}: ConsumeCarnetButtonProps): JSX.Element {
  const {t} = useTranslation();
  const {theme} = useTheme();

  const {open} = useBottomSheet();
  const onPress = () => {
    open(() => <ConsumeCarnetBottomSheet fareContractId={fareContractId} />);
  };

  return (
    <LinkSectionItem
      text={t(FareContractTexts.carnet.activateCarnet)}
      onPress={onPress}
      icon={
        <ThemeIcon
          svg={TicketValid}
          fill={theme.interactive.interactive_0.default.text}
        />
      }
      interactiveColor="interactive_0"
      {...sectionProps}
    />
  );
}
