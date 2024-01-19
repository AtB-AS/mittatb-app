import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import ConfirmSvg from '@atb/assets/svg/mono-icons/actions/Confirm';
import {useEffect} from 'react';
import {getStaticColor} from '@atb/theme/colors';
import {ThemeIcon} from '@atb/components/theme-icon';

type Props = RootStackScreenProps<'Root_ConfirmationScreen'>;

const DEFAULT_DELAY_BEFORE_COMPLETED = 5000;
const CIRCLE_SIZE = 80;

export const Root_ConfirmationScreen = ({
  route: {
    params: {message, delayBeforeCompleted, onCompleted},
  },
}: Props) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const themeColor = getStaticColor(themeName, 'background_accent_0');
  const circleColor = getStaticColor(themeName, 'background_accent_1');

  useEffect(() => {
    const timer = setTimeout(
      onCompleted,
      delayBeforeCompleted ?? DEFAULT_DELAY_BEFORE_COMPLETED,
    );
    return () => clearTimeout(timer);
  }, [onCompleted, delayBeforeCompleted]);
  return (
    <View style={[styles.container, {backgroundColor: themeColor.background}]}>
      <ThemeText
        type="heading--jumbo"
        color={themeColor}
        style={styles.message}
      >
        {message}
      </ThemeText>
      <View
        style={[
          styles.circle,
          {backgroundColor: circleColor.background},
        ]}
      >
        <ThemeIcon size="large" svg={ConfirmSvg} fill={themeColor.text} />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacings.xLarge,
    borderRadius: CIRCLE_SIZE / 2,
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
}));
