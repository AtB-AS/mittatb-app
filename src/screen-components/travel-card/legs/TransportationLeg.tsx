import {Leg} from '@atb/api/types/trips';
import {TransportationIconBox} from '@atb/components/icon-box';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';

export const TransportationLeg = ({leg}: {leg: Leg}) => {
  return (
    <TransportationIconBox
      mode={leg.mode}
      subMode={leg.line?.transportSubmode}
      isFlexible={isLineFlexibleTransport(leg.line)}
      lineNumber={leg.line?.publicCode}
      type="standard"
      testID={`${leg.mode}Leg`}
    />
  );
};
