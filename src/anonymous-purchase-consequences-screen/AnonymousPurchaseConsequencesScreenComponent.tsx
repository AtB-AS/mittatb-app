import {Support} from '@atb/assets/svg/mono-icons/actions';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Receipt} from '@atb/assets/svg/mono-icons/ticketing';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import Actions from '@atb/anonymous-purchase-consequences-screen/components/Actions';
import Consequence from '@atb/anonymous-purchase-consequences-screen/components/Consequence';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColorByType} from '@atb/theme/colors';
import {AnonymousPurchasesTexts, useTranslation} from '@atb/translations';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import React from 'react';
import {ScrollView, View} from 'react-native';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

// type ConsequencesScreenProps =
//   RootStackScreenProps<'Root_ConsequencesFromPurchase'>;
//
// type ConsequencesFromOnboardingScreenProps =
//   OnboardingScreenProps<'ConsequencesFromOnboarding'>;
//
// type ConsequencesFromPurchaseScreenProps =
//   PurchaseScreenProps<'ConsequencesFromPurchase'>;
//
// type ConsequencesPropsInternal =
//   | ConsequencesScreenProps
//   | ConsequencesFromOnboardingScreenProps
//   | ConsequencesFromPurchaseScreenProps;
//
// type NavigationProps = ConsequencesScreenProps['navigation'] &
//   ConsequencesFromOnboardingScreenProps['navigation'] &
//   ConsequencesFromPurchaseScreenProps['navigation'];
//
// // Having issues doing proper typing where the navigation
// // gets all overlapping types of routes as this is used from
// // several places. For routes and properties this works
// // but having to _combine_ everything for navigation to work.
// type ConsequencesProps = ConsequencesPropsInternal & {
//   navigation: NavigationProps;
// };

type Props = {
  onPressLogin: () => void;
  onPressContinueWithoutLogin: () => void;
  showHeader: boolean;
};

export const AnonymousPurchaseConsequencesScreenComponent = ({
  showHeader,
  onPressLogin,
  onPressContinueWithoutLogin,
}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const focusRef = useFocusOnLoad();

  // const isCallerRouteOnboarding = route?.name === 'ConsequencesFromOnboarding';
  const fillColor = getStaticColor(themeName, themeColor).text;
  // const finishOnboarding = useFinishOnboarding();
  // const {enable_vipps_login} = useRemoteConfig();
  // const navigateTologIn = async () => {
  //   navigation.navigate('LoginInApp', {
  //     screen: enable_vipps_login ? 'LoginOptionsScreen' : 'PhoneInputInApp',
  //     params: {
  //       afterLogin: isCallerRouteOnboarding
  //         ? {
  //             screen: 'Root_TabNavigatorStack',
  //             params: {
  //               screen: 'TabNav_DashboardStack',
  //               params: {
  //                 screen: 'Dashboard_RootScreen',
  //                 params: {},
  //               },
  //             },
  //           }
  //         : {
  //             screen: 'Root_TabNavigatorStack',
  //             params: {
  //               screen: 'TabNav_TicketingStack',
  //               params: {
  //                 screen: 'PurchaseTab',
  //               },
  //             },
  //           },
  //     },
  //   });
  // };

  // const secondaryAction = () =>
  //   isCallerRouteOnboarding ? finishOnboarding() : navigation.goBack();

  return (
    <>
      {showHeader && (
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
          {t(AnonymousPurchasesTexts.consequences.title)}
        </ThemeText>
        <View>
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
        <View style={styles.buttons}>
          <Actions
            primaryAction={onPressLogin}
            secondaryAction={onPressContinueWithoutLogin}
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
