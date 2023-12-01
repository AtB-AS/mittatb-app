import {Support} from '@atb/assets/svg/mono-icons/actions';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Receipt} from '@atb/assets/svg/mono-icons/ticketing';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';

import {Consequence} from './components/Consequence';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColorByType} from '@atb/theme/colors';
import {AnonymousPurchasesTexts, useTranslation} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {FullScreenFooter} from '@atb/components/screen-footer';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = {
  onPressContinueWithoutLogin: () => void;
  onPressLogin?: () => void;
};

export const AnonymousPurchaseConsequencesScreen = ({
  onPressContinueWithoutLogin,
  onPressLogin,
}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const focusRef = useFocusOnLoad();

  const fillColor = getStaticColor(themeName, themeColor).text;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: onPressLogin ? 'cancel' : 'back'}}
        setFocusOnLoad={false}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        ref={focusRef}
      >
        <View style={styles.mainContent}>
          <ThemeText
            type="heading--big"
            color={themeColor}
            style={styles.header}
          >
            {t(AnonymousPurchasesTexts.consequences.title)}
          </ThemeText>
          <Consequence
            value={t(AnonymousPurchasesTexts.consequences.messages[0])}
            icon={<ThemeIcon svg={Phone} fill={fillColor} size="large" />}
          />
          <Consequence
            value={t(AnonymousPurchasesTexts.consequences.messages[1])}
            icon={<ThemeIcon svg={Receipt} fill={fillColor} size="large" />}
          />
          <Consequence
            value={t(AnonymousPurchasesTexts.consequences.messages[2])}
            icon={<ThemeIcon svg={Support} fill={fillColor} size="large" />}
          />
        </View>
      </ScrollView>
      <FullScreenFooter>
        {onPressLogin && (
          <Button
            interactiveColor="interactive_0"
            mode="primary"
            onPress={onPressLogin}
            style={styles.button}
            text={t(AnonymousPurchasesTexts.consequences.button.login.label)}
            accessibilityHint={t(
              AnonymousPurchasesTexts.consequences.button.login.a11yHint,
            )}
            testID="loginButton"
          />
        )}
        <Button
          interactiveColor="interactive_0"
          mode={onPressLogin ? 'secondary' : 'primary'}
          onPress={onPressContinueWithoutLogin}
          style={styles.button}
          text={t(AnonymousPurchasesTexts.consequences.button.accept.label)}
          accessibilityHint={t(
            AnonymousPurchasesTexts.consequences.button.accept.a11yHint,
          )}
          rightIcon={onPressLogin ? undefined : {svg: ArrowRight}}
          testID="acceptConsequencesButton"
        />
      </FullScreenFooter>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
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
