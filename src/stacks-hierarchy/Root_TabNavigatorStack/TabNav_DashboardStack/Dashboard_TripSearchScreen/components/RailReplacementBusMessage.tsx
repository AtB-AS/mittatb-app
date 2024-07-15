import {TripPattern} from '@atb/api/types/trips';
import {useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import RailReplacementBusTexts from '@atb/translations/components/RailReplacementBusMessage';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';

export const RailReplacementBusMessage: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const {t} = useTranslation();
  const {theme, themeName} = useTheme();
  return tripPattern.legs.some(
    (leg) => leg.transportSubmode === TransportSubmode.RailReplacementBus,
  ) ? (
    <ThemeIcon
      svg={messageTypeToIcon('warning', true, themeName)}
      accessibilityLabel={t(
        RailReplacementBusTexts.tripIncludesRailReplacementBus,
      )}
      style={{marginLeft: theme.spacings.small}}
    />
  ) : null;
};
