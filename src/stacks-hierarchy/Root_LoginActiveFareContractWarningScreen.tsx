import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingContext,
} from '@atb/ticketing';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useTimeContext} from '@atb/time';
import {TransitionPresets} from '@react-navigation/stack';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_LoginActiveFareContractWarningScreen'>;

export const Root_LoginActiveFareContractWarningScreen = ({
  navigation,
}: Props) => {
  const {enable_vipps_login} = useRemoteConfigContext();
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const focusRef = useFocusOnLoad();
  const {fareContracts, reservations} = useTicketingContext();
  const {serverNow} = useTimeContext();
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
            typography="body__primary--big--bold"
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
            {reservations.length > 0 && !firstActiveFc
              ? t(LoginTexts.activeFareContractPrompt.ticketReservationBody)
              : t(LoginTexts.activeFareContractPrompt.body)}
          </ThemeText>
        </View>
        <View style={styles.fareContract}>
          {(firstActiveFc || reservations.length > 0) && (
            <FareContractOrReservation
              fcOrReservation={firstActiveFc || reservations[0]}
              isStatic={true}
              onPressFareContract={() => {}}
              now={serverNow}
              index={0}
            />
          )}
        </View>
      </ScrollView>
      <FullScreenFooter>
        <Button
          expand={true}
          interactiveColor={theme.color.interactive.destructive}
          onPress={onNext}
          text={t(LoginTexts.activeFareContractPrompt.logInAndDeleteButton)}
          style={styles.logInAndDeleteButton}
        />
        <Button
          expand={true}
          onPress={navigation.goBack}
          text={t(LoginTexts.activeFareContractPrompt.cancelButton)}
          interactiveColor={theme.color.interactive[0]}
        />
      </FullScreenFooter>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
  fareContract: {
    marginTop: theme.spacing.large,
    marginHorizontal: theme.spacing.medium,
    opacity: 0.6,
    pointerEvents: 'none',
  },
  logInAndDeleteButton: {
    marginBottom: theme.spacing.medium,
  },
}));
