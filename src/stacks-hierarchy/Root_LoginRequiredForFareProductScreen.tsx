import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';
import {Psst} from '@atb/assets/svg/color/illustrations';
import {Ticket} from '@atb/assets/svg/color/images';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTextForLanguage} from '@atb/translations/utils';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginRequiredForFareProductScreen'>;

export const Root_LoginRequiredForFareProductScreen = ({
  navigation,
  route,
}: Props) => {
  const {fareProductTypeConfig, afterLogin} = route.params;
  const {enable_vipps_login} = useRemoteConfig();
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();

  const {fareContracts} = useTicketingState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts);
  const onNext = async () => {
    const hasActiveFareContracts = activeFareContracts.length > 0;
    if (hasActiveFareContracts) {
      navigation.navigate('Root_LoginActiveFareContractWarningScreen', {
        afterLogin,
      });
    } else {
      navigation.navigate(
        enable_vipps_login
          ? 'Root_LoginOptionsScreen'
          : 'Root_LoginPhoneInputScreen',
        {
          afterLogin,
        },
      );
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
            type={'body__primary--jumbo--bold'}
            style={styles.title}
            color={themeColor}
          >
            {productName + ' - ' + t(LoginTexts.onboarding.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText style={styles.description} color={themeColor}>
            {t(LoginTexts.onboarding.description)}
          </ThemeText>
        </View>
        <Ticket style={styles.illustration} />
        <View style={styles.buttonView}>
          <Button
            interactiveColor="interactive_0"
            onPress={onNext}
            text={t(LoginTexts.onboarding.button)}
            rightIcon={{svg: ArrowRight}}
            testID="loginButton"
          />
        </View>
        <TouchableOpacity
          style={styles.laterButton}
          onPress={navigation.goBack}
          accessibilityRole="button"
          testID="loginLaterButton"
        >
          <ThemeText
            style={styles.laterButtonText}
            type="body__primary"
            color={themeColor}
          >
            {t(LoginTexts.onboarding.laterButton)}
          </ThemeText>
        </TouchableOpacity>
        <View style={styles.carrotInfo}>
          <Psst></Psst>
          <ThemeText
            style={styles.carrotTitle}
            type="body__primary--bold"
            color={themeColor}
          >
            {t(LoginTexts.onboarding.carrotTitle)}
          </ThemeText>
          <ThemeText type="body__primary" color={themeColor}>
            {t(LoginTexts.onboarding.carrotBody)}
          </ThemeText>
        </View>
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {
    padding: theme.spacings.large,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.medium,
    textAlign: 'center',
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  illustration: {
    alignSelf: 'center',
    marginVertical: theme.spacings.medium,
  },
  laterButton: {
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.xLarge,
  },
  laterButtonText: {textAlign: 'center'},
  carrotInfo: {
    margin: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge,
  },
  carrotTitle: {
    marginVertical: theme.spacings.medium,
  },
}));
