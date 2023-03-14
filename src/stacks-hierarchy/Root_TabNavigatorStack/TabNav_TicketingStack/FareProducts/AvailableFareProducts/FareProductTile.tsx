import {TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {FareProductIllustration} from './FareProductIllustration';
import {
  FareContractTexts,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import {TransportMode} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Component/TransportMode';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {useTextForLanguage} from '@atb/translations/utils';

const FareProductTile = ({
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
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);
  const title = useTextForLanguage(config.name);
  const description = useTextForLanguage(config.description);
  const transportModesText = config.transportModes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode)))
    .join('/');
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
          <TransportMode modes={config.transportModes} iconSize={'small'} />
          <ThemeText
            type="body__secondary--bold"
            style={styles.title}
            accessibilityLabel={title}
            color={themeColor}
            testID={testID + 'Title'}
          >
            {title}
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={'secondary'}
          >
            {description}
          </ThemeText>
        </View>
        <FareProductIllustration style={styles.illustration} config={config} />
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
    borderRadius: theme.border.radius.regular,
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
    marginTop: theme.spacings.medium,
  },
  description: {marginBottom: theme.spacings.small},
}));

export default FareProductTile;
