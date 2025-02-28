import {FareContractTexts, useTranslation} from '@atb/translations';
import type {ContrastColor} from '@atb-as/theme';
import {TravelRightDirection} from '@atb-as/utils';
import {BorderedFromToBox} from './BorderedFromToBox';

type SchoolFromToProps = {
  schoolName: string;
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

export const SchoolFromTo = ({
  schoolName,
  mode,
  backgroundColor,
}: SchoolFromToProps) => {
  const {t} = useTranslation();

  return (
    <BorderedFromToBox
      fromText={t(FareContractTexts.school.home)}
      toText={schoolName}
      direction={TravelRightDirection.Both}
      mode={mode}
      backgroundColor={backgroundColor}
    />
  );
};
