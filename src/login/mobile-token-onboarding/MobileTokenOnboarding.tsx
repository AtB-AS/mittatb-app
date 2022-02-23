import {StyleSheet} from '@atb/theme';
import {MobileTokenOnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {ThemeColor} from '@atb/theme/colors';
import {useNavigation} from '@react-navigation/native';
import {ActiveTicketCard} from '@atb/screens/Ticketing/Tickets/TravelCardInformation';
import Button from '@atb/components/button';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import _ from 'lodash';
import {ScrollView} from 'react-native-gesture-handler';

const themeColor: ThemeColor = 'background_accent';

export function Info1(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView centerContent={true}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(MobileTokenOnboardingTexts.info1.heading)}
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          {t(MobileTokenOnboardingTexts.info1.description)}
        </ThemeText>
      </ScrollView>
      <Button
        color="primary_2"
        style={styles.marginVertical}
        onPress={() => {
          navigation.navigate('Info2');
        }}
        text={t(MobileTokenOnboardingTexts.next)}
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
      <ScrollView centerContent={true}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(MobileTokenOnboardingTexts.info2.heading)}
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          {t(MobileTokenOnboardingTexts.info2.description)}
        </ThemeText>
      </ScrollView>
      <Button
        color="primary_2"
        style={styles.marginVertical}
        onPress={() => {
          navigation.navigate('Info3');
        }}
        text={t(MobileTokenOnboardingTexts.next)}
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
      <ScrollView centerContent={true}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(MobileTokenOnboardingTexts.info3.heading)}
        </ThemeText>
        <ThemeText
          style={styles.description}
          color={themeColor}
          isMarkdown={true}
        >
          {t(MobileTokenOnboardingTexts.info3.description)}
        </ThemeText>
      </ScrollView>
      <Button
        color="primary_2"
        style={styles.marginVertical}
        onPress={() => {}}
        text={t(MobileTokenOnboardingTexts.next)}
      />
    </View>
  );
}

export function PhoneInfoBox({phoneName}: {phoneName: string}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView centerContent={true}>
        <ThemeText
          type="body__primary--jumbo"
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
          isMarkdown={true}
        >
          {t(MobileTokenOnboardingTexts.phone.heading)}
        </ThemeText>
        <View style={styles.phoneInfoBox}>
          <View style={styles.phoneLine}></View>
          <View style={styles.phoneInfoBoxInner}>
            <ThemeText type="heading__title">{phoneName}</ThemeText>
          </View>
        </View>
        <View>
          <ThemeText style={styles.description} color={themeColor}>
            {t(MobileTokenOnboardingTexts.phone.description)}
          </ThemeText>
        </View>
      </ScrollView>
      <View>
        <Button
          color="primary_2"
          style={styles.marginVertical}
          onPress={() => {}}
          text={t(MobileTokenOnboardingTexts.ok)}
        />
        <Button
          onPress={() => {}}
          style={styles.marginVertical}
          text={t(MobileTokenOnboardingTexts.phone.button)}
          mode="secondary"
          color="secondary_3"
        ></Button>
      </View>
    </View>
  );
}

export function TCardInfoBox({
  travelCardId,
}: {
  travelCardId: string;
}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView centerContent={true}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
          isMarkdown={true}
        >
          {t(MobileTokenOnboardingTexts.tCard.heading)}
        </ThemeText>
        <View style={styles.tcardContainer}>
          <ActiveTicketCard
            cardId={travelCardId}
            color="background_3"
            type="large"
          ></ActiveTicketCard>
        </View>
        <ThemeText style={styles.description} color={themeColor}>
          {t(MobileTokenOnboardingTexts.tCard.description)}
        </ThemeText>
      </ScrollView>
      <View>
        <Button
          color="primary_2"
          style={styles.marginVertical}
          onPress={() => {}}
          text={t(MobileTokenOnboardingTexts.ok)}
        />
        <Button
          onPress={() => {}}
          style={styles.marginVertical}
          text={t(MobileTokenOnboardingTexts.tCard.button)}
          mode="secondary"
          color="secondary_3"
        ></Button>
      </View>
    </View>
  );
}

export function NoToken(): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView centerContent={true}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={[styles.alignCenter, styles.marginVertical]}
          color={themeColor}
        >
          {t(MobileTokenOnboardingTexts.error.heading)}
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          {t(MobileTokenOnboardingTexts.error.description)}
        </ThemeText>
      </ScrollView>
      <Button
        onPress={() => {}}
        text={t(MobileTokenOnboardingTexts.ok)}
        color="primary_2"
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
    paddingHorizontal: theme.spacings.xLarge,
  },
  alignCenter: {
    textAlign: 'center',
  },
  marginVertical: {
    marginTop: theme.spacings.medium,
  },
  description: {
    marginVertical: theme.spacings.large,
    textAlign: 'center',
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
    backgroundColor: theme.colors.secondary_3.color,
  },
  activeDot: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
  },
}));
