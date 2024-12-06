import {CarVehicleTypeFragment} from '@atb/api/types/generated/fragments/stations';
import {ThemeText} from '@atb/components/text';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import React from 'react';

type Props = {vehicleType: CarVehicleTypeFragment};
export const CarName = ({vehicleType}: Props) => {
  const {language} = useTranslation();

  if (vehicleType.make && vehicleType.model) {
    return (
      <ThemeText typography="body__primary--bold">
        {vehicleType.make} {vehicleType.model}
      </ThemeText>
    );
  }

  return (
    <ThemeText typography="body__primary--bold">
      {vehicleType.name &&
        getTextForLanguage(vehicleType.name.translation, language)}
    </ThemeText>
  );
};
