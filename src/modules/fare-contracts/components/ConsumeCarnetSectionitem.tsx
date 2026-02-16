import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useThemeContext} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {useRef} from 'react';
import {ConsumeCarnetBottomSheet} from './ConsumeCarnetBottomSheet';
import {View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Button} from '@atb/components/button';
import {
  GenericSectionItem,
  type SectionItemProps,
} from '@atb/components/sections';

type ConsumeCarnetSectionItemProps = SectionItemProps<{
  fareContractId: string;
  fareProductType: string | undefined;
}>;

export function ConsumeCarnetSectionitem({
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
    <GenericSectionItem {...sectionProps}>
      <Button
        text={t(FareContractTexts.carnet.activateCarnet)}
        ref={onCloseFocusRef}
        rightIcon={{svg: TicketValid}}
        interactiveColor={interactiveColor}
        onPress={onPress}
        expanded={true}
      />
      <ConsumeCarnetBottomSheet
        fareContractId={fareContractId}
        fareProductType={fareProductType}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
    </GenericSectionItem>
  );
}
