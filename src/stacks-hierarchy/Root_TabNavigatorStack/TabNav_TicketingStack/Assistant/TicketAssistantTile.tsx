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
  // Period ticket Config
  const config = sellableFareProductTypeConfigs.find(
    (config) => config.configuration.requiresLogin,
  );

  return (
    <View
      style={[
        styles.tipsAndInformation,
        {backgroundColor: themeColor.background},
      ]}
      testID={testID}
    >
      {config && (
        <TouchableOpacity
          onPress={() => onPress(config)}
          accessible={true}
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
              <ThemeText type="label__uppercase" color={'secondary'}>
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
                {t(TicketingTexts.ticketAssistantTile.title)}
              </ThemeText>
              <View style={styles.betaLabel}>
                <ThemeText
                  color="background_accent_3"
                  style={styles.betaLabelText}
                >
                  BETA
                </ThemeText>
              </View>
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
  iconBox: {
    backgroundColor: theme.static.status.info.background,
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
    marginRight: theme.spacings.xSmall,
  },
  betaLabel: {
    backgroundColor: theme.static.background.background_accent_3.background,
    marginHorizontal: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    flexShrink: 1,
  },
  betaLabelText: {
    fontSize: 8,
    lineHeight: 9,
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
