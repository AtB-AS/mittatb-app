import React, {useRef} from 'react';
import {View, useWindowDimensions, Linking, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../ScreenHeader';
import useChatIcon from '../../../chat/use-chat-icon';
import {ShinyTicketBanner} from '../../../assets/svg/illustrations';
import {StyleSheet} from '../../../theme';
import LogoOutline from '../../../ScreenHeader/LogoOutline';
import {useNavigateHome} from '../../../utils/navigation';
import InviteModal from './InviteModal';
import {Modalize} from 'react-native-modalize';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import Text from '../../../components/text';
import ThemeIcon from '../../../components/themed-icon';

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
  const {refresh} = useRemoteConfig();
  const chatIcon = useChatIcon();
  const {width: windowWidth} = useWindowDimensions();
  const navigateHome = useNavigateHome();
  const modalRef = useRef<Modalize>(null);
  const styles = useStyles();

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
      <View style={styles.textContainer}>
        <Text style={[styles.text, styles.bold]}>
          Billettkjøp i app kommer snart!
        </Text>
        <Text style={styles.text}>
          Her kan du snart kjøpe og administrere billetter til reisen din.
        </Text>
        <Text style={styles.text}>
          Frem til da kan du kjøpe billett fra{'\n'}
          <Text onPress={openOtherTicketingApp} style={styles.underline}>
            AtB Mobillett
          </Text>
        </Text>
        <Text style={styles.text}>
          Hvis du har en kode for å melde deg inn i beta for billettkjøp -{' '}
          <Text
            onPress={() => modalRef.current?.open()}
            style={styles.underline}
          >
            trykk her
          </Text>
        </Text>
      </View>
      <View style={styles.bannerContainer}>
        <ShinyTicketBanner
          width={windowWidth}
          height={windowWidth / 2}
        ></ShinyTicketBanner>
      </View>
      <InviteModal ref={modalRef} onEnrolled={onEnrolled} />
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: theme.background.accent},
  textContainer: {
    paddingHorizontal: theme.spacings.large,
    paddingVertical: 40,
    alignItems: 'center',
  },
  text: {
    fontSize: theme.text.sizes.body,
    lineHeight: theme.text.lineHeight.body,
    textAlign: 'center',
    marginBottom: 20,
  },
  bold: {fontWeight: 'bold'},
  bannerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  underline: {textDecorationLine: 'underline'},
}));
