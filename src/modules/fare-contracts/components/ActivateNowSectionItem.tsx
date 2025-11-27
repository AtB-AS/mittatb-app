import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React, {useRef} from 'react';
import {ActivateNowBottomSheet} from './ActivateNowBottomSheet';
import {useThemeContext} from '@atb/theme';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {View} from 'react-native';

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
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const onPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <LinkSectionItem
        text={t(FareContractTexts.activateNow.startNow)}
        onPress={onPress}
        interactiveColor={theme.color.interactive[0]}
        rightIcon={{
          svg: TicketValid,
          color: theme.color.interactive[0].default,
        }}
        ref={onCloseFocusRef}
        {...sectionProps}
      />
      <ActivateNowBottomSheet
        fareContractId={fareContractId}
        fareProductType={fareProductType}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
    </>
  );
}
