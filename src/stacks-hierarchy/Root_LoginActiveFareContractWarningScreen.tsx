import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {SimpleFareContract} from '@atb/fare-contracts';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useTimeContextState} from '@atb/time';
import {TransitionPresets} from '@react-navigation/stack';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_LoginActiveFareContractWarningScreen'>;

export const Root_LoginActiveFareContractWarningScreen = ({
  navigation,
}: Props) => {
  const {enable_vipps_login} = useRemoteConfig();
  const {t} = useTranslation();
  const styles = useStyles();
  const focusRef = useFocusOnLoad();
  const {fareContracts} = useTicketingState();
  const {serverNow} = useTimeContextState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );
  const firstActiveFc = activeFareContracts[0];

  const onNext = async () => {
    if (enable_vipps_login) {
      navigation.navigate('Root_LoginOptionsScreen', {
        showGoBack: true,
      });
    } else {
      navigation.navigate('Root_LoginPhoneInputScreen', {
        transitionPreset: TransitionPresets.ModalSlideFromBottomIOS,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        setFocusOnLoad={false}
        color={themeColor}
        title={t(LoginTexts.activeFareContractPrompt.header)}
      />

      <ScrollView centerContent={true} contentContainerStyle={styles.mainView}>
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            type="body__primary--big--bold"
            style={styles.title}
            color={themeColor}
          >
            {t(LoginTexts.activeFareContractPrompt.title)}
          </ThemeText>
        </View>
        <View accessible={true}>
          <ThemeText
            style={styles.description}
            color={themeColor}
            isMarkdown={true}
          >
            {t(LoginTexts.activeFareContractPrompt.body)}
          </ThemeText>
        </View>
        <View style={styles.fareContract}>
          {firstActiveFc && (
            <SimpleFareContract
              fareContract={firstActiveFc}
              now={serverNow}
              showSummarisedFareContract={true}
            />
          )}
        </View>
        <Button
          interactiveColor="interactive_destructive"
          onPress={onNext}
          text={t(LoginTexts.activeFareContractPrompt.logInAndDeleteButton)}
        />
        <Button
          onPress={navigation.goBack}
          text={t(LoginTexts.activeFareContractPrompt.cancelButton)}
          interactiveColor="interactive_0"
          style={styles.logInAndDeleteButton}
        />
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
  fareContract: {
    marginVertical: theme.spacings.large,
    paddingHorizontal: theme.spacings.medium,
  },
  illustation: {
    alignSelf: 'center',
    marginVertical: theme.spacings.medium,
  },
  logInAndDeleteButton: {
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.xLarge,
  },
}));
