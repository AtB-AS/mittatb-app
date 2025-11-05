import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Check as CheckDark} from '@atb/assets/svg/color/icons/status/dark';
import {Check as CheckLight} from '@atb/assets/svg/color/icons/status/light';
import {Button} from '@atb/components/button';
import {dictionary, useTranslation} from '@atb/translations';
import {ScreenContainer} from '@atb/components/PhotoCapture';

type ConfirmationScreenComponentProps = {
  onClose: () => void;
  title: string;
  description: string;
};

export const ConfirmationScreenComponent = ({
  onClose,
  title,
  description,
}: ConfirmationScreenComponentProps) => {
  const styles = useStyles();
  const {theme, themeName} = useThemeContext();
  const {t} = useTranslation();
  const themeColor = theme.color.background.accent[0];

  const icon = themeName === 'dark' ? CheckDark : CheckLight;

  const iconColorProps = {
    color: theme.color.status.valid.secondary.foreground.primary,
  };

  return (
    <ScreenContainer rightHeaderButton={{type: 'close', onPress: onClose}}>
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
            typography="heading__xl"
            accessibilityRole="header"
          >
            {title}
          </ThemeText>
          <ThemeText style={styles.description} color={themeColor}>
            {description}
          </ThemeText>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            expanded={true}
            text={t(dictionary.appNavigation.close.text)}
            accessibilityHint={t(dictionary.appNavigation.close.a11yHint)}
            onPress={onClose}
          />
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
