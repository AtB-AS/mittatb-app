import {Leg} from '@atb/api/types/trips';
import {TransportationIconBox} from '@atb/components/icon-box';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';
import {useTranslation, TravelCardTexts} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {View} from 'react-native';
import {useThemeContext} from '@atb/theme';
import React from 'react';
import {getNotificationSvgForLeg, getA11yLabelForLeg} from '@atb/modules/situations';
import {isDefined} from '@atb/utils/presence';

export const TransportationLeg = ({leg}: {leg: Leg}) => {
  const {t} = useTranslation();
  const {themeName} = useThemeContext();
  const modeName = t(
    getTranslatedModeName(leg.mode, leg.line?.transportSubmode),
  );
  const publicCode = leg.line?.publicCode;
  const a11yLabel = [
    t(TravelCardTexts.legs.transportation.a11yLabel(modeName, publicCode ?? '')),
    getA11yLabelForLeg(leg, t),
  ]
    .filter(isDefined)
    .join('. ');
  const notification = getNotificationSvgForLeg(leg, themeName);
  return (
    <View accessible={true} accessibilityLabel={a11yLabel}>
      <TransportationIconBox
        mode={leg.mode}
        subMode={leg.line?.transportSubmode}
        isFlexible={isLineFlexibleTransport(leg.line)}
        lineNumber={leg.line?.publicCode}
        type="standard"
        testID={`${leg.mode}Leg`}
        notification={notification}
      />
    </View>
  );
};
