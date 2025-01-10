import {Support} from '@atb/assets/svg/mono-icons/actions';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Receipt} from '@atb/assets/svg/mono-icons/ticketing';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';

import {Consequence} from './components/Consequence';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {AnonymousPurchasesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {OnboardingFullScreenView} from '@atb/onboarding';
import {View} from 'react-native';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {LeftButtonProps} from '@atb/components/screen-header';
import {Theme} from '@atb/theme/colors';

type Props = {
  onPressContinueWithoutLogin: () => void;
  onPressLogin?: () => void;
  leftButton: LeftButtonProps;
};

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const AnonymousPurchaseConsequencesScreenComponent = ({
  onPressContinueWithoutLogin,
  onPressLogin,
  leftButton,
}: Props) => {
  const styles = useStyle();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();

  const themeColor = getThemeColor(theme);

  const loginButton = {
    onPress: onPressLogin || (() => {}),
    text: t(AnonymousPurchasesTexts.consequences.button.login.label),
    accessibilityHint: t(
      AnonymousPurchasesTexts.consequences.button.login.a11yHint,
    ),
    expanded: false,
  };

  const continueWithoutLoginButton = {
    onPress: onPressContinueWithoutLogin,
    text: t(AnonymousPurchasesTexts.consequences.button.accept.label),
    accessibilityHint: t(
      AnonymousPurchasesTexts.consequences.button.accept.a11yHint,
    ),
    rightIcon: onPressLogin ? undefined : {svg: ArrowRight},
    expanded: false,
  };

  return (
    <OnboardingFullScreenView
      fullScreenHeaderProps={{leftButton}}
      footerButton={onPressLogin ? loginButton : continueWithoutLoginButton}
      secondaryFooterButton={
        onPressLogin ? continueWithoutLoginButton : undefined
      }
      testID={onPressLogin ? 'logIn' : 'acceptLimitations'}
      secondaryTestID={onPressLogin ? 'acceptLimitations' : ''}
    >
      <View ref={focusRef} accessible>
        <ThemeText
          typography="heading--big"
          color={themeColor}
          style={styles.header}
        >
          {t(AnonymousPurchasesTexts.consequences.title)}
        </ThemeText>
      </View>
      <Consequence
        value={t(AnonymousPurchasesTexts.consequences.messages[0])}
        icon={<ThemeIcon svg={Phone} color={themeColor} size="large" />}
      />
      <Consequence
        value={t(AnonymousPurchasesTexts.consequences.messages[1])}
        icon={<ThemeIcon svg={Receipt} color={themeColor} size="large" />}
      />
      <Consequence
        value={t(AnonymousPurchasesTexts.consequences.messages[2])}
        icon={<ThemeIcon svg={Support} color={themeColor} size="large" />}
      />
    </OnboardingFullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    marginHorizontal: theme.spacing.xLarge,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    margin: theme.spacing.xLarge,
    textAlign: 'center',
    fontWeight: '700',
  },
  button: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
}));
