import React from 'react';

import {
  FareContractTexts,
  useTranslation,
  TranslateFunction,
} from '@atb/translations';

import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';

import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import {TransportModePair} from '@atb/components/transportation-modes';
import {TicketingTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TicketingTile';

const modesDisplayLimit = 2;

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
  const {t} = useTranslation();

  const transportModes = config.transportModes;

  const transportColor = useThemeColorForTransportMode(
    transportModes[0]?.mode,
    transportModes[0]?.subMode,
  );

  const transportModesText = getFareProductTravelModesText(
    transportModes,
    t,
    modesDisplayLimit,
  );

  const title = useTextForLanguage(config.name) + ', ' + transportModesText;
  const description = useTextForLanguage(config.description);
  const accessibilityLabel = [title, description].join('. ');

  return (
    <TicketingTile
      accented={accented}
      onPress={onPress}
      testID={testID}
      config={config}
      transportColor={transportColor}
      title={title}
      description={description}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

const getFareProductTravelModesText = (
  modes: TransportModePair[],
  t: TranslateFunction,
  modesDisplayLimit = 2,
): string => {
  const modesCount = modes.length;

  if (!modes) return '';
  if (modesCount > modesDisplayLimit) {
    return t(FareContractTexts.transportModes.multipleTravelModes);
  }

  const travelModes = modes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode, tm.subMode)))
    .filter((value, index, array) => array.indexOf(value) === index); // remove duplicates

  if (travelModes.length < 2) {
    return travelModes[0] || '';
  } else {
    return (
      travelModes.splice(0, travelModes.length - 1).join(', ') +
      ` ${t(FareContractTexts.transportModes.concatListWord)} ` + // add " and " between the last two
      travelModes
    );
  }
};
