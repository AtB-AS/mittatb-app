import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColor, getStaticColor} from '@atb/theme/colors';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useTextForLanguage} from '@atb/translations/utils';
import {FareProductTypeConfig} from '../FareContracts/utils';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TransportMode from '../FareContracts/Component/TransportMode';
import {ThemeText} from '@atb/components/text';
import {FareProductIllustration} from '../FareProducts/AvailableFareProducts/FareProductIllustration';

type TicketAssistantProps = {
  accented?: boolean;
  onPress: () => void;
  testID: string;
  config: {
    name: string;
    description: string;
  };
};
const TicketAssistant: React.FC<TicketAssistantProps> = ({
  accented,
  onPress,
  config,
  testID,
}) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);

  return (
    <View
      style={[styles.fareProduct, {backgroundColor: themeColor.background}]}
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
            accessibilityLabel={config.name}
            color={themeColor}
            testID={testID + 'Title'}
          >
            Ticket assistant
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={'secondary'}
          >
            {config.description}
          </ThemeText>
        </View>
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
    borderRadius: theme.border.radius.regular,
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
    marginTop: theme.spacings.medium,
  },
  description: {marginBottom: theme.spacings.small},
}));

export default TicketAssistant;
