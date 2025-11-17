import {getLastUsedAccess} from '@atb/modules/ticketing';
import React from 'react';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {fullDateTime} from '@atb/utils/date';
import {useThemeContext} from '@atb/theme';
import {useTimeContext} from '@atb/modules/time';
import {FareContractInfo} from '../use-fare-contract-info';

type Props = {
  fc: FareContractInfo;
};

export const ValidTo = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const {serverNow} = useTimeContext();
  if (fc.getValidityInfo(serverNow).validityStatus !== 'valid') return null;
  const {endDateTime} = fc.mostSignificantTicket;

  let endDateTimeComputed = endDateTime;

  const {usedAccesses} = fc.accesses ?? {};
  if (usedAccesses) {
    const {validTo: usedAccessValidTo} = getLastUsedAccess(
      serverNow,
      usedAccesses,
    );
    if (usedAccessValidTo) {
      endDateTimeComputed = new Date(usedAccessValidTo);
    }
  }

  return (
    <ThemeText
      typography="body__s"
      color={theme.color.foreground.dynamic.secondary}
      style={{}}
    >
      {t(
        FareContractTexts.details.validTo(
          fullDateTime(endDateTimeComputed, language),
        ),
      )}
    </ThemeText>
  );
};
