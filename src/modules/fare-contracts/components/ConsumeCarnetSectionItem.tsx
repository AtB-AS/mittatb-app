import {TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {LinkSectionItem, SectionItemProps} from '@atb/components/sections';
import {useThemeContext} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {RefObject, useRef} from 'react';
import {ConsumeCarnetBottomSheet} from './ConsumeCarnetBottomSheet';
import {useSchoolCarnetInfoQuery} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {ValidityStatus} from '../utils';

type ConsumeCarnetSectionItemProps = SectionItemProps<{
  fareContract: FareContractType;
  fareProductType: string | undefined;
  validityStatus: ValidityStatus;
}>;

export function ConsumeCarnetSectionItem({
  fareContract,
  fareProductType,
  validityStatus,
  ...sectionProps
}: ConsumeCarnetSectionItemProps) {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {data: schoolCarnetInfo, isFetching: isSchoolCarnetInfoFetching} =
    useSchoolCarnetInfoQuery(fareContract, validityStatus);
  const {open} = useBottomSheetContext();

  if (schoolCarnetInfo?.nextConsumableDateTime) return null;

  const onPress = () => {
    open(
      () => (
        <ConsumeCarnetBottomSheet
          fareContractId={fareContract.id}
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
      rightIcon={{svg: TicketValid, color: interactiveColor.default}}
      interactiveColor={interactiveColor}
      disabled={isSchoolCarnetInfoFetching}
      ref={onCloseFocusRef}
      {...sectionProps}
    />
  );
}
