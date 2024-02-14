import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import ConfirmSvg from '@atb/assets/svg/mono-icons/actions/Confirm';
import {useEffect} from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {InteractiveColor, StaticColor} from '@atb/theme/colors';
import {useTranslation} from '@atb/translations';
import {ConfirmationTexts} from '@atb/translations/screens/subscreens/PurchaseConfirmation';
import {ConfirmationScreenResolver} from '@atb/stacks-hierarchy/Root_ConfirmationScreen';

type Props = RootStackScreenProps<'Root_ConfirmationScreen'>;

const DEFAULT_DELAY_BEFORE_COMPLETED = 3000;
const DEFAULT_NEXT_SCREEN: keyof typeof ConfirmationScreenResolver =
  'myTickets';
const DEFAULT_MESSAGE: keyof typeof ConfirmationTexts = 'ticketHasBeenSent';
const CIRCLE_SIZE = 80;
const themeColor: StaticColor = 'background_accent_0';
const circleColor: InteractiveColor = 'interactive_2';

export const Root_ConfirmationScreen = ({
  navigation,
  route: {
    params: {message, delayBeforeCompleted, nextScreen},
  },
}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const destinationScreen =
    ConfirmationScreenResolver[nextScreen ?? DEFAULT_NEXT_SCREEN];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate(destinationScreen.screen, destinationScreen.params);
    }, delayBeforeCompleted ?? DEFAULT_DELAY_BEFORE_COMPLETED);
    return () => clearTimeout(timer);
  }, [delayBeforeCompleted, navigation, destinationScreen]);

  return (
    <View style={styles.container}>
      <ThemeText
        type="heading--jumbo"
        color={themeColor}
        style={styles.message}
      >
        {t(ConfirmationTexts[message ?? DEFAULT_MESSAGE])}
      </ThemeText>
      <View style={styles.circle}>
        <ThemeIcon
          size="large"
          svg={ConfirmSvg}
          colorType={theme.interactive[circleColor].outline}
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.static.background[themeColor].background,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacings.xLarge,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: theme.interactive[circleColor].outline.background,
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
}));
