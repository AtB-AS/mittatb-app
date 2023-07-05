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
} from '@atb/theme/colors';

import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';

import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import {TransportModePair} from '@atb/components/transportation-modes';

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
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();

  const transportModes = config.transportModes;

  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);

  const transportColor = useThemeColorForTransportMode(
    transportModes[0]?.mode,
    transportModes[0]?.subMode,
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

  const transportModesText = getFareProductTravelModesText(
    transportModes,
    t,
    modesDisplayLimit,
  );
  const accessibilityLabel = [title, transportModesText, description].join(
    '. ',
  );

  return (
    <View
      style={[
        styles.fareProduct,
        {
          backgroundColor: themeColor.background,
          borderBottomColor: transportThemePrimaryColor.background,
        },
      ]}
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
    paddingBottom: theme.spacings.xLarge - 2 * theme.border.width.medium,
    borderBottomWidth: 2 * theme.border.width.medium,
    borderRadius: theme.border.radius.small,
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
}));

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
