import {FareContractTexts, useTranslation} from '@atb/translations';
import type {ContrastColor} from '@atb-as/theme';
import {TravelRightDirection} from '@atb-as/utils';
import {FromToBox} from './FromToBox';
import {Size} from '../utils';

type SchoolFromToProps = {
  schoolName: string;
  size: Size;
  backgroundColor: ContrastColor;
};

export const SchoolFromTo = ({
  schoolName,
  size,
  backgroundColor,
}: SchoolFromToProps) => {
  const {t} = useTranslation();

  return (
    <FromToBox
      fromText={t(FareContractTexts.school.home)}
      toText={schoolName}
      direction={TravelRightDirection.Both}
      size={size}
      backgroundColor={backgroundColor}
    />
  );
};
