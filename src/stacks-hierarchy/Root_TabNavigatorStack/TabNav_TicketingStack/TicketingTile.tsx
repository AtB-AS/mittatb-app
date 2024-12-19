import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';

import {TicketingTexts, useTranslation} from '@atb/translations';
import {TransportColor} from '@atb/theme/colors';

import {TicketingTileIllustration} from './TicketingTileIllustration';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export const TicketingTile = ({
  accented = false,
  onPress,
  testID,
  illustrationName,
  transportColor,
  title,
  description,
  accessibilityLabel,
}: {
  accented?: boolean;
  onPress: () => void;
  testID: string;
  illustrationName: string;
  transportColor: TransportColor['city'];
  title?: string;
  description?: string;
  accessibilityLabel?: string;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  const themeColor = accented
    ? theme.color.background.accent[3]
    : theme.color.background.neutral[0];
  const themePrimaryColor = transportColor.primary;
  const themeSecondaryColor = transportColor.secondary;

  return (
    <PressableOpacity
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
          <ThemeText
            typography="body__secondary--bold"
            style={styles.title}
            accessibilityLabel={title}
            color={themeColor}
            testID={testID + 'Title'}
          >
            {title}
          </ThemeText>
          <ThemeText
            typography="body__tertiary"
            style={styles.description}
            color="secondary"
          >
            {description}
          </ThemeText>
        </View>
        <TicketingTileIllustration
          illustrationName={illustrationName}
          style={styles.illustration}
          fill={themeSecondaryColor.background}
          width={theme.icon.size.large}
          height={theme.icon.size.large}
        />
      </View>
    </PressableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  fareProduct: {
    width: '100%',
    flexShrink: 1,
    alignSelf: 'stretch',
    marginRight: theme.spacing.medium,
    padding: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge - 2 * theme.border.width.medium,
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
  label: {marginLeft: theme.spacing.xSmall},
  illustration: {
    marginTop: theme.spacing.small,
  },
  title: {
    marginBottom: theme.spacing.small,
  },
  description: {marginBottom: theme.spacing.small},
}));
