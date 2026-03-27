import {Leg} from '@atb/api/types/trips';
import {TransportationIconBox} from '@atb/components/icon-box';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';
import {View} from 'react-native';

export const TransportationLeg = ({leg}: {leg: Leg}) => {
  return (
    <View>
      <TransportationIconBox
        mode={leg.mode}
        subMode={leg.line?.transportSubmode}
        isFlexible={isLineFlexibleTransport(leg.line)}
        lineNumber={leg.line?.publicCode}
        type="standard"
        testID={`${leg.mode}Leg`}
      />
    </View>
  );
};
