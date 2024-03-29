import React from 'react';

import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';

import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import {TicketingTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TicketingTile';

export const FareProductTile = ({
  accented = false,
  onPress,
  testID,
  config,
}: {
  accented?: boolean;
  onPress: () => void;
  testID: string;
  config: FareProductTypeConfig;
}) => {
  const transportModes = config.transportModes;

  const transportColor = useThemeColorForTransportMode(
    transportModes[0]?.mode,
    transportModes[0]?.subMode,
  );
  const title = useTextForLanguage(config.name);
  const description = useTextForLanguage(config.description);
  const accessibilityLabel = [title, description].join('. ');

  return (
    <TicketingTile
      accented={accented}
      onPress={onPress}
      testID={testID}
      illustrationName={config.illustration || 'unknown'}
      transportColor={transportColor}
      title={title}
      description={description}
      accessibilityLabel={accessibilityLabel}
    />
  );
};
