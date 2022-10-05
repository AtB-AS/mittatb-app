import {TripPattern} from '@atb/api/types/trips';
import {Warning} from '@atb/assets/svg/color/situations';
import {useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import RailReplacementBusTexts from '@atb/translations/components/RailReplacementBusMessage';
import {TransportSubmode} from '@entur/sdk/lib/journeyPlanner/types';
import React from 'react';

const WarnWhenRailReplacementBus: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  return tripPattern.legs.some(
    (leg) => leg.transportSubmode === TransportSubmode.RailReplacementBus,
  ) ? (
    <Warning
      accessibilityLabel={t(
        RailReplacementBusTexts.tripIncludesRailReplacementBus,
      )}
      style={{marginLeft: theme.spacings.small}}
    />
  ) : null;
};

export default WarnWhenRailReplacementBus;
