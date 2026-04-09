import {Leg} from '@atb/api/types/trips';
import {TransportationIconBox} from '@atb/components/icon-box';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';
import React from 'react';
import {SvgProps} from 'react-native-svg';

export const TransportationLeg = ({
  leg,
  notification,
}: {
  leg: Leg;
  notification?: (props: SvgProps) => React.JSX.Element;
}) => (
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
