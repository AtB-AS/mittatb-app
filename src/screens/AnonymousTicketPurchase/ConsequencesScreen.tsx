import React from 'react';
import {ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import AnonymousTicketPurchases from '@atb/translations/screens/subscreens/AnonymousTicketPurchases';
import {getStaticColor, StaticColorByType} from '@atb/theme/colors';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Support} from '@atb/assets/svg/mono-icons/actions';
import {OnboardingStackParams} from '@atb/screens/Onboarding';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import Actions from '@atb/screens/AnonymousTicketPurchase/components/Actions';
import Consequence from '@atb/screens/AnonymousTicketPurchase/components/Consequence';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {Receipt} from '@atb/assets/svg/mono-icons/ticketing';
import ThemeIcon from '@atb/components/theme-icon';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {useFinishOnboarding} from '@atb/screens/Onboarding/use-finish-onboarding';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type ConsequencesScreenRouteProps = RouteProp<
  OnboardingStackParams,
  'ConsequencesFromOnboarding'
>;

const ConsequencesScreen = ({
  route,
  navigation,
}: {
  route: ConsequencesScreenRouteProps;
  navigation: MaterialTopTabNavigationProp<OnboardingStackParams>;
}) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const focusRef = useFocusOnLoad();
  const isCallerRouteOnboarding = route?.name === 'ConsequencesFromOnboarding';
  const fillColor = getStaticColor(themeName, themeColor).text;
  const finishOnboarding = useFinishOnboarding();
  const {enable_vipps_login} = useRemoteConfig();
  const navigateTologIn = async () => {
    navigation.navigate('LoginInApp', {
      screen: enable_vipps_login ? 'LoginOptionsScreen' : 'PhoneInputInApp',
      params: {
        afterLogin: {
          routeName: 'TabNavigator',
          routeParams: isCallerRouteOnboarding ? {} : {screen: 'Ticketing'},
        },
      },
    });
  };

  const secondaryAction = () =>
    isCallerRouteOnboarding ? finishOnboarding() : navigation.goBack();

  return (
    <>
      {!isCallerRouteOnboarding && (
        <FullScreenHeader
          leftButton={{type: 'cancel'}}
          setFocusOnLoad={false}
        />
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        ref={focusRef}
      >
        <ThemeText
          type="heading--jumbo"
          color={themeColor}
          style={styles.header}
        >
          {t(AnonymousTicketPurchases.consequences.title)}
        </ThemeText>
        <View>
          <Consequence
            value={t(AnonymousTicketPurchases.consequences.messages[0])}
            icon={<ThemeIcon svg={Phone} fill={fillColor} size="large" />}
          />
          <Consequence
            value={t(AnonymousTicketPurchases.consequences.messages[1])}
            icon={<ThemeIcon svg={Receipt} fill={fillColor} size="large" />}
          />
          <Consequence
            value={t(AnonymousTicketPurchases.consequences.messages[2])}
            icon={<ThemeIcon svg={Support} fill={fillColor} size="large" />}
          />
        </View>
        <View style={styles.buttons}>
          <Actions
            primaryAction={navigateTologIn}
            secondaryAction={secondaryAction}
          />
        </View>
      </ScrollView>
    </>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    paddingHorizontal: theme.spacings.xLarge,
    paddingTop: theme.spacings.xLarge,
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  header: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  buttons: {
    marginVertical: theme.spacings.xLarge,
  },
}));

export default ConsequencesScreen;
