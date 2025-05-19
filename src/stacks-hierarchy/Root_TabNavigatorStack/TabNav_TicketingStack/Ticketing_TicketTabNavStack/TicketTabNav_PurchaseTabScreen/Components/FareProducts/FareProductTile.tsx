import React from 'react';

import {
  FareProductTypeConfig,
  ProductTypeTransportModes,
} from '@atb/modules/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {TicketingTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TicketingTile';

export const FareProductTile = ({
  accented = false,
  onPress,
  testID,
  config,
  productGroupTransportModes,
}: {
  accented?: boolean;
  onPress: () => void;
  testID: string;
  config: FareProductTypeConfig;
  productGroupTransportModes: ProductTypeTransportModes[];
}) => {
  const transportColor = useTransportColor(
    productGroupTransportModes[0]?.mode,
    productGroupTransportModes[0]?.subMode,
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
