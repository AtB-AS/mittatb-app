import {TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {FareProductIllustration} from './FareProductIllustration';
import {
  FareContractTexts,
  TicketingTexts,
  useTranslation,
  TranslateFunction,
} from '@atb/translations';
import {
  getStaticColor,
  getTransportationColor,
  StaticColor,
  TransportColor,
} from '@atb/theme/colors';

import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

// eslint-disable-next-line no-restricted-imports
import {TransportModePair} from '@atb/components/transportation-modes/TransportModes';

type TransportModesType = {
  mode: TransportMode;
  subMode?: TransportSubmode;
};

const modesDisplayLimit: number = 2;

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
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();

  const transportModes = config.transportModes;

  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);

  const transportColor = getTransportColorFromModes(
    transportModes as TransportModesType[],
  );
  const transportThemePrimaryColor = getTransportationColor(
    themeName,
    transportColor,
    'primary',
  );
  const transportThemeSecondaryColor = getTransportationColor(
    themeName,
    transportColor,
    'secondary',
  );

  const title = useTextForLanguage(config.name);
  const description = useTextForLanguage(config.description);

  const transportModesText: string = getFareProductTravelModesText(
    transportModes,
    t,
    modesDisplayLimit,
  );
  const accessibilityLabel = [title, transportModesText, description].join(
    '. ',
  );

  return (
    <View
      style={[styles.fareProduct, {backgroundColor: themeColor.background}]}
      testID={testID}
    >
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t(
          TicketingTexts.availableFareProducts.navigateToBuy,
        )}
        style={styles.spreadContent}
      >
        <View style={styles.contentContainer}>
          <ThemeText
            type="body__secondary--bold"
            style={styles.title}
            accessibilityLabel={title}
            color={themeColor}
            testID={testID + 'Title'}
          >
            {title + ', ' + transportModesText}
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={'secondary'}
          >
            {description}
          </ThemeText>
        </View>
        <FareProductIllustration
          style={styles.illustration}
          config={config}
          fill={transportThemeSecondaryColor.background}
          width={28}
          height={28}
        />
      </TouchableOpacity>
      <View
        style={[
          styles.coloredBottomLine,
          {backgroundColor: transportThemePrimaryColor.background},
        ]}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  fareProduct: {
    width: '100%',
    flexShrink: 1,
    alignSelf: 'stretch',
    marginRight: theme.spacings.medium,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.small,
    overflow: 'hidden',
  },
  contentContainer: {
    flexShrink: 1,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spreadContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {marginLeft: theme.spacings.xSmall},
  illustration: {
    marginTop: theme.spacings.small,
  },
  title: {
    marginBottom: theme.spacings.small,
  },
  description: {marginBottom: theme.spacings.small},
  coloredBottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2 * theme.border.width.medium,
  },
}));

const getTransportColorFromModes = (
  transportModes: TransportModesType[],
): TransportColor => {
  if (transportModes.length < 1) {
    return 'transport_other';
  } else {
    const {mode, subMode} = transportModes[0];

    switch (mode) {
      case 'air':
        return 'transport_plane';
      case 'water':
        return 'transport_boat';
      case 'coach':
        return 'transport_region';

      case 'bus':
        if (subMode === 'localBus') {
          return 'transport_city';
        } else if (subMode === 'regionalBus') {
          return 'transport_region';
        } else if (subMode === 'expressBus') {
          return 'transport_airport_express';
        } else {
          return 'transport_city';
        }

      case 'metro':
      case 'monorail':
      case 'rail':
      case 'tram':
      case 'trolleybus':
        return 'transport_train';

      case 'unknown':
      case 'cableway':
      case 'funicular':
      case 'lift':
        return 'transport_other';
      default:
        return 'transport_other';
    }
  }
};

const getFareProductTravelModesText = (
  modes: TransportModePair[],
  t: TranslateFunction,
  modesDisplayLimit: number = 2,
): string => {
  const modesCount: number = modes.length;

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
