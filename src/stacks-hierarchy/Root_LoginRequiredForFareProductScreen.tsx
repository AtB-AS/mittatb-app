import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useGetHasReservationOrAvailableFareContract} from '@atb/modules/ticketing';
import {ThemedTicket} from '@atb/theme/ThemedAssets';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LogIn} from '@atb/assets/svg/mono-icons/profile';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_LoginRequiredForFareProductScreen'>;

export const Root_LoginRequiredForFareProductScreen = ({navigation}: Props) => {
  const {enable_vipps_login} = useRemoteConfigContext();
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {theme} = useThemeContext();
  const focusRef = useFocusOnLoad(navigation);

  const themeColor = getThemeColor(theme);

  const getHasReservationOrAvailableFareContract =
    useGetHasReservationOrAvailableFareContract();

  const onNext = async () => {
    if (await getHasReservationOrAvailableFareContract()) {
      navigation.navigate('Root_LoginAvailableFareContractWarningScreen', {
        transitionOverride: 'slide-from-bottom',
      });
    } else {
      if (enable_vipps_login) {
        navigation.navigate('Root_LoginOptionsScreen', {
          showGoBack: true,
          transitionOverride: 'slide-from-right',
        });
      } else {
        navigation.navigate('Root_LoginPhoneInputScreen', {});
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <ThemedTicket style={styles.illustration} width={100} height={87} />
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            typography="heading__3xl"
            style={styles.title}
            color={themeColor}
          >
            {t(LoginTexts.onboarding.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText
            style={styles.description}
            color={themeColor}
            testID="logInPurchaseDescription"
          >
            {t(LoginTexts.onboarding.description)}
          </ThemeText>
        </View>
      </View>
      <View style={styles.buttonView}>
        <Button
          expanded={true}
          interactiveColor={theme.color.interactive[0]}
          onPress={onNext}
          text={t(LoginTexts.onboarding.button)}
          rightIcon={{svg: LogIn}}
          testID="logInButton"
        />
        <Button
          expanded={true}
          mode="secondary"
          backgroundColor={theme.color.background.neutral[2]}
          onPress={navigation.goBack}
          text={t(LoginTexts.onboarding.laterButton)}
          testID="logInLaterButton"
        />
      </View>
    </SafeAreaView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacing.medium,
  },
  description: {
    marginVertical: theme.spacing.medium,
    textAlign: 'center',
  },
  errorMessage: {
    marginBottom: theme.spacing.medium,
  },
  buttonView: {
    marginTop: theme.spacing.medium,
    gap: theme.spacing.medium,
    padding: theme.spacing.xLarge,
  },
  illustration: {
    alignSelf: 'center',
    marginVertical: theme.spacing.medium,
  },
  laterButton: {
    marginTop: theme.spacing.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.xLarge,
  },
  laterButtonText: {textAlign: 'center'},
  carrotInfo: {
    margin: theme.spacing.xLarge,
    marginBottom: theme.spacing.xLarge,
  },
  carrotTitle: {
    marginVertical: theme.spacing.medium,
  },
}));
