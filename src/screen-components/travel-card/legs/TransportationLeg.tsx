import {Leg} from '@atb/api/types/trips';
import {TransportationIconBox} from '@atb/components/icon-box';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';
import {useThemeContext} from '@atb/theme';
import React from 'react';
import {getNotificationSvgForLeg} from '@atb/modules/situations';

export const TransportationLeg = ({leg}: {leg: Leg}) => {
  const {themeName} = useThemeContext();
  const notification = getNotificationSvgForLeg(leg, themeName);
  return (
    <TransportationIconBox
      mode={leg.mode}
      subMode={leg.line?.transportSubmode}
      isFlexible={isLineFlexibleTransport(leg.line)}
      lineNumber={leg.line?.publicCode}
      type="standard"
      testID={`${leg.mode}Leg`}
      notification={notification}
    />
  );
};
