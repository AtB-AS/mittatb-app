import React from 'react';
import {Text, View, useWindowDimensions, Linking, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../ScreenHeader';
import useChatIcon from '../../chat/use-chat-icon';
import colors from '../../theme/colors';
import {ShinyTicketBanner} from '../../assets/svg/illustrations';
import {StyleSheet} from '../../theme';

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
  const {icon: chatIcon, openChat} = useChatIcon();
  const {width: windowWidth} = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Billetter"
        rightButton={{icon: chatIcon, onPress: openChat}}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.text, styles.bold]}>
          Billettkjøp i app kommer snart!
        </Text>
        <Text style={styles.text}>
          Her kan du snart kjøpe og administrere billetter til reisen din.
        </Text>
        <Text style={[styles.text, {marginBottom: 0}]}>
          Frem til da kan du kjøpe billett fra{'\n'}
          <Text onPress={openOtherTicketingApp} style={styles.underline}>
            AtB Mobillett
          </Text>
        </Text>
      </View>
      <View style={styles.bannerContainer}>
        <ShinyTicketBanner
          width={windowWidth}
          height={windowWidth / 2}
        ></ShinyTicketBanner>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.secondary.cyan},
  textContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  text: {fontSize: 16, lineHeight: 20, textAlign: 'center', marginBottom: 20},
  bold: {fontWeight: 'bold'},
  bannerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  underline: {textDecorationLine: 'underline'},
});
