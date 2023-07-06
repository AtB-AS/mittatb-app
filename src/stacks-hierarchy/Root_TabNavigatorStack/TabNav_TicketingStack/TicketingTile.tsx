import {TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React, {Children, ReactNode, cloneElement} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';

import {TicketingTexts, useTranslation} from '@atb/translations';
import {
  getStaticColor,
  getTransportationColor,
  StaticColor,
  TransportColor,
} from '@atb/theme/colors';

import {BetaTag} from '@atb/components/beta-tag';

import {FareProductTypeConfig} from '@atb/configuration';
import {FareProductIllustration} from './Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/FareProducts/FareProductIllustration';

export const TicketingTile = ({
  accented = false,
  onPress,
  testID,
  config,
  transportColor,
  title,
  description,
  accessibilityLabel,
  showBetaTag = false,
  children,
}: {
  accented?: boolean;
  onPress: () => void;
  testID: string;
  config?: FareProductTypeConfig;
  transportColor: TransportColor;
  title?: string;
  description?: string;
  accessibilityLabel?: string;
  showBetaTag?: boolean;
  children?: ReactNode;
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
    <View
      style={[
        styles.fareProduct,
        {
          backgroundColor: themeColor.background,
          borderBottomColor: themePrimaryColor.background,
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
        {children ? (
          Children.map(children, (child: any) =>
            cloneElement(child, {
              fill: themeSecondaryColor.background,
              width: theme.icon.size.large,
              height: theme.icon.size.large,
            }),
          )
        ) : (
          <FareProductIllustration
            style={styles.illustration}
            config={config}
            fill={themeSecondaryColor.background}
            width={theme.icon.size.large}
            height={theme.icon.size.large}
          />
        )}
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
  betaTag: {
    marginBottom: theme.spacings.xSmall,
  },
  betaTagContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacings.small,
  },
}));
