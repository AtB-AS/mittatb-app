import {getLastUsedAccess} from '@atb/ticketing';
import {FareContract} from '@atb-as/utils';
import React from 'react';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {fullDateTime} from '@atb/utils/date';
import {getValidityStatus} from '@atb/fare-contracts';
import {useThemeContext} from '@atb/theme';
import {useTimeContext} from '@atb/time';
import {flattenTravelRightAccesses} from '@atb-as/utils';

type Props = {
  fc: FareContract;
};

export const ValidTo = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const {serverNow} = useTimeContext();
  const firstTravelRight = fc.travelRights[0];
  if (getValidityStatus(serverNow, fc) !== 'valid') return null;

  let endDateTime = firstTravelRight.endDateTime;
  const flattenedAccesses = flattenTravelRightAccesses(fc.travelRights);
  if (flattenedAccesses) {
    const {validTo: usedAccessValidTo} = getLastUsedAccess(
      serverNow,
      flattenedAccesses.usedAccesses,
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
