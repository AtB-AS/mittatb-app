import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import {TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {TicketingTexts, useTranslation} from '@atb/translations';

type TicketAssistantProps = {
  accented?: boolean;
  onPress: () => void;
  testID: string;
};
export const TicketAssistantTile: React.FC<TicketAssistantProps> = ({
  accented,
  onPress,
  testID,
}) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);
  const {t} = useTranslation();

  return (
    <View
      style={[
        styles.tipsAndInformation,
        {backgroundColor: themeColor.background},
      ]}
      testID={testID}
    >
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        style={styles.spreadContent}
      >
        <View style={styles.contentContainer}>
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
