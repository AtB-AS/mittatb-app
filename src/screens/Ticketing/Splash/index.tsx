import React, {useRef} from 'react';
import {View, useWindowDimensions, Text, Linking, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../ScreenHeader';
import useChatIcon from '../../../chat/use-chat-icon';
import {ShinyTicketBanner} from '../../../assets/svg/illustrations';
import {StyleSheet, useStyle} from '../../../theme';
import LogoOutline from '../../../ScreenHeader/LogoOutline';
import {useNavigateHome} from '../../../utils/navigation';
import InviteModal from './InviteModal';
import {Modalize} from 'react-native-modalize';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import Button from '../../../components/button';
import {ScrollView} from 'react-native-gesture-handler';
function openOtherTicketingApp() {
  const url =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/no/app/atb-mobillett/id472214198'
      : 'https://play.google.com/store/apps/details?id=no.wtw.atb';
  if (Linking.canOpenURL(url)) {
    Linking.openURL(url);
  }
}

export default function Splash() {
  const styles = useStyles();
  const {refresh} = useRemoteConfig();
  const chatIcon = useChatIcon();
  const {width: windowWidth} = useWindowDimensions();
  const navigateHome = useNavigateHome();
  const modalRef = useRef<Modalize>(null);

  function onEnrolled() {
    refresh();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Billetter"
        rightButton={chatIcon}
        leftButton={{
          icon: <ThemeIcon svg={LogoOutline} />,
          onPress: navigateHome,
          accessibilityLabel: 'Gå til startskjerm',
        }}
      />
      <View style={styles.bannerContainer}>
        <ShinyTicketBanner
          width={windowWidth}
          height={windowWidth / 2}
        ></ShinyTicketBanner>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.textContent}>
            <ThemeText style={[styles.text, styles.bold]}>
              Billettkjøp i app kommer snart!
            </ThemeText>
            <ThemeText style={styles.text}>
              Her kan du snart kjøpe og administrere billetter til reisen din.
            </ThemeText>
            <ThemeText style={styles.text}>
              Frem til da kan du kjøpe billett fra{'\n'}
              <Text onPress={openOtherTicketingApp} style={styles.underline}>
                AtB Mobillett
              </Text>
            </ThemeText>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="primary2"
              onPress={() => modalRef.current?.open()}
              text="Jeg har kode til beta for billettkjøp"
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>

      <InviteModal ref={modalRef} onEnrolled={onEnrolled} />
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: theme.background.accent},
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingVertical: theme.spacings.xLarge,
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    paddingHorizontal: theme.spacings.large,
    backgroundColor: theme.background.accent,
    marginBottom: theme.spacings.xLarge,
    boxShadow: 'inset 0',
  },
  buttonContainer: {
    paddingHorizontal: theme.spacings.large,
    width: '100%',
    marginBottom: theme.spacings.medium,
  },
  text: {
    textAlign: 'center',
    marginBottom: theme.spacings.large,
  },
  bold: {fontWeight: 'bold'},
  bannerContainer: {
    position: 'absolute',
    bottom: theme.spacings.large,
  },
  underline: {textDecorationLine: 'underline'},
  button: {marginBottom: theme.spacings.small},
}));
