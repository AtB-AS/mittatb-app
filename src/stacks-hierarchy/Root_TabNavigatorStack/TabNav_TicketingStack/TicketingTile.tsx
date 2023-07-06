import {TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';

import {TicketingTexts, useTranslation} from '@atb/translations';
import {
  getStaticColor,
  getTransportationColor,
  StaticColor,
  TransportColor,
} from '@atb/theme/colors';

import {BetaTag} from '@atb/components/beta-tag';

import {TicketingTileIllustration} from './TicketingTileIllustration';

export const TicketingTile = ({
  accented = false,
  onPress,
  testID,
  illustrationName,
  isPeriodTicket = false,
  transportColor,
  title,
  description,
  accessibilityLabel,
  showBetaTag = false,
}: {
  accented?: boolean;
  onPress: () => void;
  testID: string;
  illustrationName: string;
  isPeriodTicket?: boolean;
  transportColor: TransportColor;
  title?: string;
  description?: string;
  accessibilityLabel?: string;
  showBetaTag?: boolean;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme, themeName} = useTheme();

  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);

  const themePrimaryColor = getTransportationColor(
    themeName,
    transportColor,
    'primary',
  );
  const themeSecondaryColor = getTransportationColor(
    themeName,
    transportColor,
    'secondary',
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={t(TicketingTexts.availableFareProducts.navigateToBuy)}
      style={[
        styles.fareProduct,
        {
          backgroundColor: themeColor.background,
          borderBottomColor: themePrimaryColor.background,
        },
      ]}
    >
      <View style={styles.spreadContent} testID={testID}>
        <View style={styles.contentContainer}>
          {showBetaTag && (
            <View style={styles.betaTagContainer}>
              <BetaTag style={styles.betaTag} />
            </View>
          )}
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
        <TicketingTileIllustration
          illustrationName={illustrationName}
          isPeriodTicket={isPeriodTicket}
          style={styles.illustration}
          fill={themeSecondaryColor.background}
          width={theme.icon.size.large}
          height={theme.icon.size.large}
        />
      </View>
    </TouchableOpacity>
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
  betaTag: {
    marginBottom: theme.spacings.xSmall,
  },
  betaTagContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacings.small,
  },
}));
