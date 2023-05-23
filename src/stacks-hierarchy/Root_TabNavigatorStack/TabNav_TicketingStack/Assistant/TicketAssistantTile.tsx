import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import {TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TicketMultiple} from '@atb/assets/svg/mono-icons/ticketing';
import {FareProductTypeConfig} from '@atb-as/config-specs';
import {useFirestoreConfiguration} from '@atb/configuration';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {BetaTag} from '@atb/components/beta-tag';

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
  const {themeName} = useTheme();
  const iconColor: StaticColor = 'background_accent_2';
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);
  const {t} = useTranslation();

  const {fareProductTypeConfigs, preassignedFareProducts} =
    useFirestoreConfiguration();

  const sellableProductsInApp = preassignedFareProducts.filter(
    productIsSellableInApp,
  );

  const sellableFareProductTypeConfigs = fareProductTypeConfigs.filter(
    (config) => sellableProductsInApp.some((p) => p.type === config.type),
  );

  const requiresLoginConfig = sellableFareProductTypeConfigs.find(
    (config) => config.configuration.requiresLogin,
  );

  const title = t(TicketingTexts.ticketAssistantTile.title);
  const description = t(TicketingTexts.ticketAssistantTile.description);
  const accessibilityLabel = [title, 'Beta', description].join('. ');

  return (
    <View
      style={[
        styles.tipsAndInformation,
        {backgroundColor: themeColor.background},
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
              <View style={styles.iconBox}>
                <ThemeIcon
                  size={'small'}
                  svg={TicketMultiple}
                  colorType={iconColor}
                  testID={testID}
                />
              </View>
              <ThemeText
                type="label__uppercase"
                accessible={false}
                color={'secondary'}
              >
                {t(TicketingTexts.ticketAssistantTile.label)}
              </ThemeText>
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
              <BetaTag style={styles.betaTag} />
            </View>

            <ThemeText type="body__tertiary" color={'secondary'}>
              {t(TicketingTexts.ticketAssistantTile.description)}
            </ThemeText>
          </View>
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
    borderRadius: theme.border.radius.regular,
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.large,
  },
  betaTag: {
    marginHorizontal: theme.spacings.small,
  },
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
    alignItems: 'center',
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
