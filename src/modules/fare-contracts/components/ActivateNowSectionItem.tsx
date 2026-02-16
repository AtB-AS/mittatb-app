import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {useRef} from 'react';
import {ActivateNowBottomSheet} from './ActivateNowBottomSheet';
import {useThemeContext} from '@atb/theme';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {
  GenericSectionItem,
  type SectionItemProps,
} from '@atb/components/sections';

type ActivateNowButtonProps = SectionItemProps<{
  fareContractId: string;
  fareProductType: string | undefined;
}>;

export function ActivateNowSectionItem({
  fareContractId,
  fareProductType,
  ...sectionProps
}: ActivateNowButtonProps): React.JSX.Element {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const onPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <GenericSectionItem {...sectionProps}>
      <Button
        expanded={true}
        text={t(FareContractTexts.activateNow.startNow)}
        onPress={onPress}
        interactiveColor={theme.color.interactive[0]}
        rightIcon={{
          svg: TicketValid,
        }}
        ref={onCloseFocusRef}
      />
      <ActivateNowBottomSheet
        fareContractId={fareContractId}
        fareProductType={fareProductType}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
    </GenericSectionItem>
  );
}
