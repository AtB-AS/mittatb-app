import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import ConfirmSvg from '@atb/assets/svg/mono-icons/actions/Confirm';
import {useEffect} from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Theme} from '@atb/theme/colors';

type Props = RootStackScreenProps<'Root_ConfirmationScreen'>;

const DEFAULT_DELAY_BEFORE_COMPLETED = 5000;
const CIRCLE_SIZE = 80;
const getThemeColor = (theme: Theme) => theme.color.background.accent[0];
const getCircleColor = (theme: Theme) => theme.color.interactive[2];

export const Root_ConfirmationScreen = ({
  navigation,
  route: {
    params: {message, delayBeforeCompleted, nextScreen},
  },
}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);
  const circleColor = getCircleColor(theme);

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
        typography="heading--jumbo"
        color={themeColor}
        style={styles.message}
      >
        {message}
      </ThemeText>
      <View style={styles.circle}>
        <ThemeIcon size="large" svg={ConfirmSvg} color={circleColor.outline} />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: getThemeColor(theme).background,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xLarge,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: getCircleColor(theme).outline.background,
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xLarge,
  },
}));
