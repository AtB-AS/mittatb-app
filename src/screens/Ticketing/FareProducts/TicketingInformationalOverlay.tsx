import {useAppState} from '@atb/AppContext';
import {TicketingTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import Button from '@atb/components/button';
import {ScrollView, View} from 'react-native';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StaticColorByType} from '@atb/theme/colors';
import FullScreenHeader from '@atb/components/screen-header/full-header';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export default function TicketingInformationalOverlay() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const styles = useStyles();
  const appContext = useAppState();

  if (appContext.ticketingAccepted) {
    return null;
  }

  const onAccept = () => {
    appContext.acceptTicketing();
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketingTexts.header.title)}
        rightButton={{type: 'chat'}}
      />
      <ScrollView style={styles.scrollView}>
        <ThemeText color={themeColor} type="body__primary--jumbo--bold">
          {t(TicketingTexts.informational.title)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.xLarge}}
        >
          {t(TicketingTexts.informational.description)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          type="heading__paragraph"
          style={{marginTop: theme.spacings.xLarge}}
        >
          {t(TicketingTexts.informational.paragraphHeading)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.medium}}
        >
          {t(TicketingTexts.informational.bullet1)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.medium}}
        >
          {t(TicketingTexts.informational.bullet2)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.medium}}
        >
          {t(TicketingTexts.informational.bullet3)}
        </ThemeText>
        <View style={{marginVertical: theme.spacings.xLarge}}>
          <Button
            text={t(TicketingTexts.informational.button)}
            icon={Confirm}
            iconPosition="right"
            interactiveColor="interactive_0"
            onPress={onAccept}
            testID="acceptTicketingButton"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    padding: theme.spacings.xLarge,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
