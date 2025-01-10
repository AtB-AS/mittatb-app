import {
  FareContract,
  getLastUsedAccess,
  isCarnetTravelRight,
  isNormalTravelRight,
} from '@atb/ticketing';
import React from 'react';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {fullDateTime} from '@atb/utils/date';
import {getValidityStatus} from '@atb/fare-contracts';
import {useThemeContext} from '@atb/theme';
import {useTimeContext} from '@atb/time';

type Props = {
  fc: FareContract;
};

export const ValidTo = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const {serverNow} = useTimeContext();
  const travelRight = fc.travelRights[0];
  if (!isNormalTravelRight(travelRight)) return null;
  if (!(getValidityStatus(serverNow, fc) === 'valid')) return null;

  const endDateTime = (() => {
    if (isCarnetTravelRight(travelRight)) {
      const validTo = getLastUsedAccess(
        serverNow,
        travelRight.usedAccesses,
      )?.validTo;
      if (validTo) return new Date(validTo);
    }
    return travelRight.endDateTime;
  })();

  return (
    <ThemeText
      typography="body__secondary"
      color={theme.color.foreground.dynamic.secondary}
      style={{}}
    >
      {t(
        FareContractTexts.details.validTo(fullDateTime(endDateTime, language)),
      )}
    </ThemeText>
  );
};
