import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColor, getStaticColor} from '@atb/theme/colors';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {translation as _, useTranslation} from '@atb/translations';

type TicketAssistantProps = {
  accented?: boolean;
  onPress: () => void;
  testID: string;
};
const TicketAssistantTile: React.FC<TicketAssistantProps> = ({
  accented,
  onPress,
  testID,
}) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);
  const {t} = useTranslation();

  const texts = {
    title: _('Bilettveileder', 'Ticket assistant'),
    description: _(
      'Få hjelp til å velge billetten som passer deg best.',
      'Get help choosing the ticket that suits you the best',
    ),
    a11yHint: _(
      'Aktiver for å åpne bilettveilederen',
      'Activate to get tips and information about tickets',
    ),
  };

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
          <ThemeText
            type="body__secondary--bold"
            style={styles.title}
            accessibilityLabel={t(texts.title)}
            color={themeColor}
            testID={testID + 'Title'}
          >
            {t(texts.title)}
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={'secondary'}
          >
            {t(texts.description)}
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
    marginLeft: theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },

  title: {
    marginBottom: theme.spacings.small,
  },
  description: {},

  contentContainer: {
    flexShrink: 1,
  },
  spreadContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
}));

export default TicketAssistantTile;
