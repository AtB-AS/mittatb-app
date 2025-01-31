import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Check as CheckDark} from '@atb/assets/svg/color/icons/status/dark';
import {Check as CheckLight} from '@atb/assets/svg/color/icons/status/light';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  ScreenContainer,
  getThemeColor,
} from '@atb/stacks-hierarchy/Root_ParkingViolationsReporting/components/ScreenContainer';
import {Button} from '@atb/components/button';

type ConfirmationScreenProps = {
  onClose: () => void;
  title: string;
  description: string;
  accessibilityLabel: string;
};

export const ConfirmationScreen = ({
  onClose,
  title,
  description,
  accessibilityLabel,
}: ConfirmationScreenProps) => {
  const styles = useStyles();
  const {theme, themeName} = useThemeContext();
  const themeColor = getThemeColor(theme);

  const close = () => {
    onClose();
  };

  const icon = themeName === 'dark' ? CheckDark : CheckLight;

  const iconColorProps = {
    color: theme.color.status.valid.secondary.foreground.primary,
  };
  const textColor = theme.color.status.valid.secondary.foreground.primary;

  return (
    <ScreenContainer rightHeaderButton={{type: 'close', onPress: close}}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <ThemeIcon
            style={styles.icon}
            svg={icon}
            {...iconColorProps}
            customSize={54}
          />
          <ThemeText
            style={styles.title}
            color={themeColor}
            typography="heading--big"
          >
            {title}
          </ThemeText>
          <ThemeText style={styles.description} color={themeColor}>
            {description}
          </ThemeText>
        </View>
        <View style={styles.buttonContainer}>
          <Button expanded={true} text={'Lukk'} onPress={close} />
        </View>
      </View>
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingBottom: theme.spacing.xLarge,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    marginVertical: theme.spacing.medium,
    textAlign: 'center',
  },
  icon: {
    marginBottom: theme.spacing.large,
  },
}));
