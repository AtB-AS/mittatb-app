import {StyleSheet, useTheme} from '@atb/theme';
import {
  getStaticColor,
  getTransportationColor,
  StaticColor,
} from '@atb/theme/colors';
import {TouchableOpacity, View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import React from 'react';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {TicketMultiple} from '@atb/assets/svg/mono-icons/ticketing';
import {FareProductTypeConfig} from '@atb-as/config-specs';
import {useFirestoreConfiguration} from '@atb/configuration';
import {isProductSellableInApp} from '@atb/reference-data/utils';
import {BetaTag} from '@atb/components/beta-tag';
import {useTicketingState} from '@atb/ticketing';

type TicketAssistantProps = {
  accented?: boolean;
  onPress: (preassignedFareProduct: FareProductTypeConfig) => void;
  testID: string;
};
export const TicketAssistantTile: React.FC<TicketAssistantProps> = ({
  accented,
  onPress,
  testID,
}) => {
  const styles = useStyles();
  const {theme, themeName} = useTheme();
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);
  const {t} = useTranslation();

  const transportThemePrimaryColor = getTransportationColor(
    themeName,
    'transport_other',
    'primary',
  );

  const transportThemeSecondaryColor = getTransportationColor(
    themeName,
    'transport_other',
    'secondary',
  );

  const {fareProductTypeConfigs, preassignedFareProducts} =
    useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();

  const sellableProductsInApp = preassignedFareProducts.filter((product) =>
    isProductSellableInApp(product, customerProfile),
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );

  const requiresLoginConfig = sellableFareProductTypeConfigs.find(
    (config) => config.configuration.requiresLogin,
  );

  const title = t(TicketingTexts.ticketAssistantTile.title);
  const description = t(TicketingTexts.ticketAssistantTile.description);
  const accessibilityLabel = [title, 'Beta', description].join(
    screenReaderPause,
  );

  return (
    <View
      style={[
        styles.tipsAndInformation,
        {
          backgroundColor: themeColor.background,
          borderBottomColor: transportThemePrimaryColor.background,
        },
      ]}
      testID={testID}
    >
      {requiresLoginConfig && (
        <TouchableOpacity
          onPress={() => onPress(requiresLoginConfig)}
          accessible={true}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={t(TicketingTexts.ticketAssistantTile.a11yHint)}
          style={styles.spreadContent}
        >
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <BetaTag style={styles.betaTag} />
            </View>
            <View style={styles.titleContainer}>
              <ThemeText
                type="body__secondary--bold"
                accessibilityLabel={t(TicketingTexts.ticketAssistantTile.title)}
                color={themeColor}
                testID={testID + 'Title'}
              >
                {title}
              </ThemeText>
            </View>

            <ThemeText
              type="body__tertiary"
              color={'secondary'}
              style={styles.description}
            >
              {t(TicketingTexts.ticketAssistantTile.description)}
            </ThemeText>
          </View>
          <TicketMultiple
            style={styles.illustration}
            fill={transportThemeSecondaryColor.background}
            width={theme.icon.size.large}
            height={theme.icon.size.large}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  tipsAndInformation: {
    flexShrink: 1,
    alignSelf: 'stretch',
    padding: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge - 2 * theme.border.width.medium,
    borderBottomWidth: 2 * theme.border.width.medium,
    borderRadius: theme.border.radius.small,

    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.large,
  },
  betaTag: {
    marginBottom: theme.spacings.xSmall,
  },
  illustration: {
    marginTop: theme.spacings.small,
  },
  description: {marginBottom: theme.spacings.small},
  iconBox: {
    backgroundColor: theme.static.status.info.background,
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
    marginRight: theme.spacings.xSmall,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacings.small,
  },

  contentContainer: {
    flexShrink: 1,
  },
  spreadContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
}));
