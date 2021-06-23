import {useAppState} from '@atb/AppContext';
import {TicketsTexts, useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import Button from '@atb/components/button';
import {ScrollView, View} from 'react-native';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {Confirm} from '@atb/assets/svg/icons/actions';
import {ThemeColor} from '@atb/theme/colors';
import FullScreenHeader from '@atb/components/screen-header/full-header';

const themeColor: ThemeColor = 'background_gray';

export default function TicketInformationalOverlay() {
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
        title={t(TicketsTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={{type: 'home'}}
      />
      <ScrollView style={styles.scrollView}>
        <ThemeText color={themeColor} type="body__primary--jumbo--bold">
          {t(TicketsTexts.informational.title)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.xLarge}}
        >
          {t(TicketsTexts.informational.description)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          type="heading__paragraph"
          style={{marginTop: theme.spacings.xLarge}}
        >
          {t(TicketsTexts.informational.paragraphHeading)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.medium}}
        >
          {t(TicketsTexts.informational.bullet1)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.medium}}
        >
          {t(TicketsTexts.informational.bullet2)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.medium}}
        >
          {t(TicketsTexts.informational.bullet3)}
        </ThemeText>
        <ThemeText
          color={themeColor}
          style={{marginTop: theme.spacings.medium}}
        >
          {t(TicketsTexts.informational.bullet4)}
        </ThemeText>
        <View style={{marginVertical: theme.spacings.xLarge}}>
          <Button
            text={t(TicketsTexts.informational.button)}
            icon={Confirm}
            iconPosition="right"
            color="primary_2"
            onPress={onAccept}
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
    backgroundColor: theme.colors[themeColor].backgroundColor,
  },
}));
