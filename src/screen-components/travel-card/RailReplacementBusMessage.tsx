import {TripPattern} from '@atb/api/types/trips';
import {useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import RailReplacementBusTexts from '@atb/translations/components/RailReplacementBusMessage';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';

export const RailReplacementBusMessage: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const {t} = useTranslation();
  const {theme, themeName} = useThemeContext();
  return tripPattern.legs.some(
    (leg) => leg.transportSubmode === TransportSubmode.RailReplacementBus,
  ) ? (
    <ThemeIcon
      svg={statusTypeToIcon('warning', true, themeName)}
      accessibilityLabel={t(
        RailReplacementBusTexts.tripIncludesRailReplacementBus,
      )}
      style={{marginLeft: theme.spacing.small}}
    />
  ) : null;
};
