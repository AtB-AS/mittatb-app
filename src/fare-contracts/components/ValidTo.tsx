import {
  FareContract,
  flattenCarnetTravelRightAccesses,
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
  const firstTravelRight = fc.travelRights[0];
  if (!isNormalTravelRight(firstTravelRight)) return null;
  if (!(getValidityStatus(serverNow, fc) === 'valid')) return null;

  let endDateTime = firstTravelRight.endDateTime;
  const {usedAccesses} = flattenCarnetTravelRightAccesses(
    fc.travelRights.filter(isCarnetTravelRight),
  );
  if (usedAccesses.length) {
    const {validTo: usedAccessValidTo} = getLastUsedAccess(
      serverNow,
      usedAccesses,
    );
    if (usedAccessValidTo) {
      endDateTime = new Date(usedAccessValidTo);
    }
  }

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
