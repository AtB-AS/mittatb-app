import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {useRef} from 'react';
import {ConsumeCarnetBottomSheet} from './ConsumeCarnetBottomSheet';
import {View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

type ConsumeCarnetSectionItemProps = SectionItemProps<{
  fareContractId: string;
  fareProductType: string | undefined;
}>;

export function ConsumeCarnetSectionItem({
  fareContractId,
  fareProductType,
  ...sectionProps
}: ConsumeCarnetSectionItemProps): React.JSX.Element {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const onPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <LinkSectionItem
        text={t(FareContractTexts.carnet.activateCarnet)}
        onPress={onPress}
        rightIcon={{svg: TicketValid, color: interactiveColor.default}}
        interactiveColor={interactiveColor}
        ref={onCloseFocusRef}
        {...sectionProps}
      />
      <ConsumeCarnetBottomSheet
        fareContractId={fareContractId}
        fareProductType={fareProductType}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
    </>
  );
}
