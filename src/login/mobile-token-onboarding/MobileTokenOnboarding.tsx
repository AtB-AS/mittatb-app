import {StyleSheet} from '@atb/theme';
import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {ActiveTicketCard} from '@atb/screens/Ticketing/Tickets/TravelCardInformation';
import Button from '@atb/components/button';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import _ from 'lodash';

const themeColor: ThemeColor = 'background_accent';

export function Info1(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          Hva er et reisebevis?
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          Et reisebevis kan være et t:kort eller en spesifikk mobiltelefon. Det
          er du bruker for å kunne fremvise gyldig billett.
        </ThemeText>
      </View>
      <Button
        color={'primary_2'}
        style={styles.marginVertical}
        onPress={() => {
          navigation.navigate('Info2');
        }}
        text="Neste"
      />
    </View>
  );
}

export function Info2(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          Mer fleksibel reisehverdag
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          Valg av reisebevis gir deg fleksibilitet til å velge det som passer
          deg. Bare husk å alltid ha med deg ditt valgte reisebevis.
        </ThemeText>
      </View>
      <Button
        color={'primary_2'}
        style={styles.marginVertical}
        onPress={() => {
          navigation.navigate('Info3');
        }}
        text="Neste"
      />
    </View>
  );
}

export function Info3(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          Hva med billettene mine?
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          Billettene dine er tilknyttet din profil, så om du mister eller bytter
          reisebevis vil du fortsatt ha tilgang på billettene dine.
        </ThemeText>
      </View>
      <Button
        color={'primary_2'}
        style={styles.marginVertical}
        onPress={() => {
          navigation.navigate('ChangeTokenInfo');
        }}
        text="Neste"
      />
    </View>
  );
}

export function PhoneInfoBox({phoneName}: {phoneName: string}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View>
      <View accessible={true} accessibilityRole="header">
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(LoginTexts.assignMobileToken.phoneIsSet)}
        </ThemeText>
      </View>
      <View>
        <ThemeText style={styles.description} color={themeColor}>
          {t(LoginTexts.assignMobileToken.bringPhone)}
        </ThemeText>
      </View>
      <View style={styles.phoneInfoBox}>
        <View style={styles.phoneLine}></View>
        <View style={styles.phoneInfoBoxInner}>
          <ThemeText type="heading__title">{phoneName}</ThemeText>
        </View>
      </View>
    </View>
  );
}

function TCardInfoBox({travelCardId}: {travelCardId: string}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View>
      <View accessible={true} accessibilityRole="header">
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(LoginTexts.assignMobileToken.tcardIsSet)}
        </ThemeText>
      </View>
      <View>
        <ThemeText style={styles.description} color={themeColor}>
          {t(LoginTexts.assignMobileToken.bringTcard)}
        </ThemeText>
      </View>
      <View style={styles.tcardContainer}>
        <ActiveTicketCard
          cardId={travelCardId}
          color="background_3"
          type="large"
        ></ActiveTicketCard>
      </View>
    </View>
  );
}

function NoToken(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View>
      <View accessible={true} accessibilityRole="header">
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          Det ser ut som det tar litt tid..
        </ThemeText>
      </View>
      <View>
        <ThemeText style={styles.description} color={themeColor}>
          Vi forsøker å opprette et reisebevis til deg, men det ser ut som det
          tar litt tid. Du kan sjekke om du har nettilgang og hvis ikke så vil
          appen forsøke å opprette det neste gang du får tilgang.
        </ThemeText>
      </View>
    </View>
  );
}

export function ChangeTokenInfo(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          Endre reisebevis
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          Du kan enkelt bytte reisebevis fra Mitt AtB i appen eller i
          nettbutikken. Du kan ha ett aktivt reisebevis til enhver tid.
        </ThemeText>
      </View>
      <Button
        color={'primary_2'}
        style={styles.marginVertical}
        onPress={() => {}}
        text="OK"
      />
      <Button
        onPress={() => {}}
        text="Endre reisebevis"
        mode="secondary"
        color="secondary_1"
      ></Button>
    </View>
  );
}

export function PageIndicator(props: MaterialTopTabBarProps) {
  const styles = useThemeStyles();
  const count = props.state.routes.length;
  const index = props.state.index;

  return (
    <View style={styles.pageIndicator}>
      {_.times(count, (i) => (
        <View
          key={i}
          style={[styles.pageDot, index === i && styles.activeDot]}
        ></View>
      ))}
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
    flex: 1,
    paddingHorizontal: theme.spacings.medium,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  alignCenter: {
    textAlign: 'center',
  },
  marginVertical: {
    marginBottom: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.large,
    textAlign: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  tcardContainer: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge * 3,
    alignSelf: 'center',
  },
  phoneInfoBox: {
    marginVertical: theme.spacings.xLarge,
    alignSelf: 'center',
    backgroundColor: theme.colors.background_3.backgroundColor,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.circle,
    minHeight: 300,
    minWidth: 200,
  },
  phoneLine: {
    width: theme.spacings.xLarge * 2,
    borderRadius: theme.border.radius.regular,
    height: theme.spacings.small,
    backgroundColor: theme.colors.secondary_2.backgroundColor,
    alignSelf: 'center',
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.small + theme.spacings.xLarge,
  },
  phoneInfoBoxInner: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.large,
    alignSelf: 'center',
  },
  pageIndicator: {
    marginVertical: theme.spacings.xLarge,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageDot: {
    height: theme.spacings.medium,
    width: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium / 2,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.colors.secondary_2.backgroundColor,
  },
  activeDot: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
  },
}));
