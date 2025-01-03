import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Psst} from '@atb/assets/svg/color/illustrations';
import {Ticket} from '@atb/assets/svg/color/images';
import {useTextForLanguage} from '@atb/translations/utils';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {TransitionPresets} from '@react-navigation/stack';
import {useHasReservationOrAvailableFareContract} from '@atb/ticketing';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_LoginRequiredForFareProductScreen'>;

export const Root_LoginRequiredForFareProductScreen = ({
  navigation,
  route,
}: Props) => {
  const {fareProductTypeConfig} = route.params;
  const {enable_vipps_login} = useRemoteConfigContext();
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {theme} = useThemeContext();
  const focusRef = useFocusOnLoad();

  const themeColor = getThemeColor(theme);

  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();

  const onNext = async () => {
    if (hasReservationOrAvailableFareContract) {
      navigation.navigate('Root_LoginAvailableFareContractWarningScreen', {
        transitionPreset: TransitionPresets.ModalSlideFromBottomIOS,
      });
    } else {
      if (enable_vipps_login) {
        navigation.navigate('Root_LoginOptionsScreen', {
          showGoBack: true,
          transitionPreset: TransitionPresets.ModalSlideFromBottomIOS,
        });
      } else {
        navigation.navigate('Root_LoginPhoneInputScreen', {});
      }
    }
  };

  const productName = useTextForLanguage(fareProductTypeConfig.name);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'cancel'}}
        setFocusOnLoad={false}
        color={themeColor}
      />

      <ScrollView centerContent={true} contentContainerStyle={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            typography="body__primary--jumbo--bold"
            style={styles.title}
            color={themeColor}
          >
            {productName + ' - ' + t(LoginTexts.onboarding.title)}
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
        <Ticket style={styles.illustration} />
        <View style={styles.buttonView}>
          <Button
            interactiveColor={theme.color.interactive[0]}
            onPress={onNext}
            text={t(LoginTexts.onboarding.button)}
            rightIcon={{svg: ArrowRight}}
            testID="logInButton"
          />
        </View>
        <PressableOpacity
          style={styles.laterButton}
          onPress={navigation.goBack}
          accessibilityRole="button"
          testID="logInLaterButton"
        >
          <ThemeText
            style={styles.laterButtonText}
            typography="body__primary"
            color={themeColor}
          >
            {t(LoginTexts.onboarding.laterButton)}
          </ThemeText>
        </PressableOpacity>
        <View style={styles.carrotInfo}>
          <Psst />
          <ThemeText
            style={styles.carrotTitle}
            typography="body__primary--bold"
            color={themeColor}
          >
            {t(LoginTexts.onboarding.carrotTitle)}
          </ThemeText>
          <ThemeText typography="body__primary" color={themeColor}>
            {t(LoginTexts.onboarding.carrotBody)}
          </ThemeText>
        </View>
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {
    padding: theme.spacing.large,
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
