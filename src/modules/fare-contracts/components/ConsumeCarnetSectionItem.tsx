import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useThemeContext} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {RefObject, useRef} from 'react';
import {ConsumeCarnetBottomSheet} from './ConsumeCarnetBottomSheet';

type ConsumeCarnetSectionItemProps = SectionItemProps<{
  fareContractId: string;
  fareProductType: string | undefined;
}>;

export function ConsumeCarnetSectionItem({
  fareContractId,
  fareProductType,
  ...sectionProps
}: ConsumeCarnetSectionItemProps): JSX.Element {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {open} = useBottomSheetContext();
  const onPress = () => {
    open(
      () => (
        <ConsumeCarnetBottomSheet
          fareContractId={fareContractId}
          fareProductType={fareProductType}
        />
      ),
      onCloseFocusRef,
    );
  };

  return (
    <LinkSectionItem
      text={t(FareContractTexts.carnet.activateCarnet)}
      onPress={onPress}
      icon={<ThemeIcon svg={TicketValid} color={interactiveColor.default} />}
      interactiveColor={interactiveColor}
      ref={onCloseFocusRef}
      {...sectionProps}
    />
  );
}
