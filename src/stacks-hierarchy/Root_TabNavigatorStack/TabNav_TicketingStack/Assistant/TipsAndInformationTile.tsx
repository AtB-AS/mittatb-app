import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColor, getStaticColor} from '@atb/theme/colors';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Unknown} from '@atb/assets/svg/mono-icons/status';

type TicketAssistantProps = {
  accented?: boolean;
  onPress: () => void;
  testID: string;
  config: {
    name: string;
    description: string;
  };
};
const TipsAndInformationTile: React.FC<TicketAssistantProps> = ({
  accented,
  onPress,
  testID,
}) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);

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
          <ThemeIcon svg={Unknown} />
          <ThemeText
            type="body__secondary--bold"
            style={styles.title}
            accessibilityLabel={'Tips og'}
            color={themeColor}
            testID={testID + 'Title'}
          >
            {'Tips og informasjon om billetter'}
          </ThemeText>
        </View>
      </TouchableOpacity>
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

export default TipsAndInformationTile;
