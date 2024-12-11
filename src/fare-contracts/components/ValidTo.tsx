import {FareContract, isNormalTravelRight} from '@atb/ticketing';
import React from 'react';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {fullDateTime} from '@atb/utils/date';
import {useTheme} from '@atb/theme';

type Props = {
  fc: FareContract;
};

export const ValidTo = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const travelRight = fc.travelRights[0];
  if (!isNormalTravelRight(travelRight)) return null;

  return (
    <ThemeText
      typography="body__secondary"
      color={theme.color.foreground.dark.secondary}
      style={{}}
    >
      {t(
        FareContractTexts.details.validTo(
          fullDateTime(travelRight.endDateTime, language),
        ),
      )}
    </ThemeText>
  );
};
