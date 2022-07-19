import React from 'react';
import {ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import AnonymousTicketPurchases from '@atb/translations/screens/subscreens/AnonymousTicketPurchases';
import {StaticColorByType} from '@atb/theme/colors';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Support} from '@atb/assets/svg/mono-icons/actions';
import {OnboardingStackParams} from '@atb/screens/Onboarding';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import Actions from '@atb/screens/AnonymousTicketPurchase/components/Actions';
import Consequence from '@atb/screens/AnonymousTicketPurchase/components/Consequence';
import FullScreenHeader from '@atb/components/screen-header/full-header';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type ConsequencesScreenRouteParams = {
  callerRoute: CallerRoute;
};

type ConsequencesScreenRouteProps = RouteProp<
  OnboardingStackParams,
  'ConsequencesScreen'
>;

export type ConsequencesScreenProps = {
  navigation: MaterialTopTabNavigationProp<OnboardingStackParams>;
};

export type CallerRoute =
  | 'app-onboarding'
  | 'logout'
  | 'warning'
  | 'login-onboarding';
const ConsequencesScreen = ({
  route,
  navigation,
}: {
  route: ConsequencesScreenRouteProps;
  navigation: ConsequencesScreenProps;
}) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {theme} = useTheme();

  const isCallerRouteOnboarding =
    route?.params?.callerRoute === 'app-onboarding';

  return (
    <>
      {!isCallerRouteOnboarding && (
        <FullScreenHeader leftButton={{type: 'cancel'}} />
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
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
            icon={
              <Phone fill={theme.static.background.background_0.background} />
            }
          />
          <Consequence
            value={t(AnonymousTicketPurchases.consequences.messages[1])}
            icon={
              <Phone fill={theme.static.background.background_0.background} />
            }
          />
          <Consequence
            value={t(AnonymousTicketPurchases.consequences.messages[2])}
            icon={
              <Support fill={theme.static.background.background_0.background} />
            }
          />
        </View>
        <View style={styles.buttons}>
          <Actions
            callerRoute={route?.params?.callerRoute}
            navigation={navigation}
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
