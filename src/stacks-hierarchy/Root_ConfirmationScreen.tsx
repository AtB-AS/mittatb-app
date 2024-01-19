import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import ConfirmSvg from '@atb/assets/svg/mono-icons/actions/Confirm';
import {useEffect} from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {InteractiveColor, StaticColor} from '@atb/theme/colors';

type Props = RootStackScreenProps<'Root_ConfirmationScreen'>;

const DEFAULT_DELAY_BEFORE_COMPLETED = 5000;
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

  useEffect(() => {
    const timer = setTimeout(
      () => navigation.navigate(nextScreen.screen, nextScreen.params),
      delayBeforeCompleted ?? DEFAULT_DELAY_BEFORE_COMPLETED,
    );
    return () => clearTimeout(timer);
  }, [delayBeforeCompleted, navigation, nextScreen]);

  return (
    <View style={styles.container}>
      <ThemeText
        type="heading--jumbo"
        color={themeColor}
        style={styles.message}
      >
        {message}
      </ThemeText>
      <View style={styles.circle}>
        <ThemeIcon size="large" svg={ConfirmSvg} colorType={theme.interactive[circleColor].outline} />
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
