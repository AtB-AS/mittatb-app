import {Support} from '@atb/assets/svg/mono-icons/actions';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Receipt} from '@atb/assets/svg/mono-icons/ticketing';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';

import {Consequence} from './components/Consequence';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {AnonymousPurchasesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {OnboardingFullScreenView} from '@atb/onboarding-screen';
import {LeftButtonProps} from '@atb/components/screen-header';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const consequencesIcons = [Phone, Receipt, Support];

type Props = {
  onPressContinueWithoutLogin: () => void;
  onPressLogin?: () => void;
  leftButton: LeftButtonProps;
};

export const AnonymousPurchaseConsequencesScreenComponent = ({
  onPressContinueWithoutLogin,
  onPressLogin,
  leftButton,
}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();

  const loginButton = {
    onPress: onPressLogin || (() => {}),
    text: t(AnonymousPurchasesTexts.consequences.button.login.label),
    accessibilityHint: t(
      AnonymousPurchasesTexts.consequences.button.login.a11yHint,
    ),
  };

  const continueWithoutLoginButton = {
    onPress: onPressContinueWithoutLogin,
    text: t(AnonymousPurchasesTexts.consequences.button.accept.label),
    accessibilityHint: t(
      AnonymousPurchasesTexts.consequences.button.accept.a11yHint,
    ),
    rightIcon: onPressLogin ? undefined : {svg: ArrowRight},
  };

  return (
    <OnboardingFullScreenView
      fullScreenHeaderProps={{leftButton}}
      footerButton={onPressLogin ? loginButton : continueWithoutLoginButton}
      secondaryFooterButton={
        onPressLogin ? continueWithoutLoginButton : undefined
      }
    >
      <ThemeText type="heading--big" color={themeColor} style={styles.header}>
        {t(AnonymousPurchasesTexts.consequences.title)}
      </ThemeText>

      {
        // eslint-disable-next-line rulesdir/translations-warning
        AnonymousPurchasesTexts.consequences.messages.map(
          (consequenceMessage, i) => (
            <Consequence
              key={t(consequenceMessage)}
              value={t(consequenceMessage)}
              icon={
                <ThemeIcon
                  svg={consequencesIcons[i]}
                  colorType={themeColor}
                  size="large"
                />
              }
            />
          ),
        )
      }
    </OnboardingFullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    marginHorizontal: theme.spacings.xLarge,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    margin: theme.spacings.xLarge,
    textAlign: 'center',
    fontWeight: '700',
  },
  button: {
    marginHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.medium,
  },
}));
