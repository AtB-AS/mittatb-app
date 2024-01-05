import {TripPattern} from '@atb/api/types/trips';
import {Warning} from '@atb/assets/svg/color/icons/status';
import {useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import RailReplacementBusTexts from '@atb/translations/components/RailReplacementBusMessage';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';

export const RailReplacementBusMessage: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  return tripPattern.legs.some(
    (leg) => leg.transportSubmode === TransportSubmode.RailReplacementBus,
  ) ? (
    <ThemeIcon
      svg={Warning}
      accessibilityLabel={t(
        RailReplacementBusTexts.tripIncludesRailReplacementBus,
      )}
      style={{marginLeft: theme.spacings.small}}
    />
  ) : null;
};
