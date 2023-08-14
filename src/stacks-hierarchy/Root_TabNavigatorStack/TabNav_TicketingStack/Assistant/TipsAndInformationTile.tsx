import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Unknown} from '@atb/assets/svg/mono-icons/status';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type TicketAssistantProps = {
  accented?: boolean;
  onPress: () => void;
  testID: string;
};
export const TipsAndInformationTile: React.FC<TicketAssistantProps> = ({
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
      <PressableOpacity
        onPress={onPress}
        accessible={true}
        style={styles.spreadContent}
      >
        <View style={styles.contentContainer}>
          <ThemeIcon svg={Unknown} />
          <ThemeText
            type="body__secondary--bold"
            style={styles.title}
            accessibilityLabel={t(
              TicketingTexts.tipsAndInformationTile.a11yHint,
            )}
            color={themeColor}
            testID={testID + 'Title'}
          >
            {t(TicketingTexts.tipsAndInformationTile.title)}
          </ThemeText>
        </View>
      </PressableOpacity>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  tipsAndInformation: {
    flexShrink: 1,
    marginTop: theme.spacings.large,
    padding: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    marginLeft: theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },
  title: {
    marginLeft: theme.spacings.small,
  },

  contentContainer: {flex: 1, flexDirection: 'row'},
  spreadContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
}));
