import React, {useCallback, useRef} from 'react';
import {Text, View, useWindowDimensions, Linking, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../ScreenHeader';
import useChatIcon from '../../../chat/use-chat-icon';
import colors from '../../../theme/colors';
import {ShinyTicketBanner} from '../../../assets/svg/illustrations';
import {StyleSheet, useStyle} from '../../../theme';
import LogoOutline from '../../../ScreenHeader/LogoOutline';
import {useNavigateHome} from '../../../utils/navigation';
import InviteModal from './InviteModal';
import {Modalize} from 'react-native-modalize';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import Button from '../../../components/button';

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
          icon: <LogoOutline />,
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
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => modalRef.current?.open()}
            text="Jeg har kode til lukket beta"
            mode="secondary"
            style={styles.button}
          />
        </View>
      </View>
      <InviteModal ref={modalRef} onEnrolled={onEnrolled} />
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: colors.secondary.cyan},
  textContainer: {
    paddingHorizontal: theme.spacings.large,
    paddingVertical: theme.spacings.xLarge,
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: theme.text.sizes.body,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: theme.spacings.large,
  },
  bold: {fontWeight: 'bold'},
  bannerContainer: {
    position: 'absolute',
    bottom: theme.spacings.large,
  },
  underline: {textDecorationLine: 'underline'},
  buttonContainer: {
    position: 'absolute',
    bottom: theme.spacings.medium,
    width: '100%',
  },
  button: {backgroundColor: colors.secondary.blue},
}));
