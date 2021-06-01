import {Linking, TouchableOpacity, View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {InformationTexts, useTranslation} from '@atb/translations';
import {ScrollView} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import ThemeText from '@atb/components/text';

export default function TicketInspectionInformation() {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(InformationTexts.inspection.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView style={styles.content}>
        <ThemeText>{t(InformationTexts.inspection.texts.part1Text1)}</ThemeText>
        <ThemeText style={styles.bullet}>
          {t(InformationTexts.inspection.texts.part1Bullet1)}
        </ThemeText>
        <ThemeText style={styles.bullet}>
          {t(InformationTexts.inspection.texts.part1Bullet2)}
        </ThemeText>
        <ThemeText style={styles.bullet}>
          {t(InformationTexts.inspection.texts.part1Bullet3)}
        </ThemeText>
        <ThemeText style={styles.paragraphSpace}>
          {t(InformationTexts.inspection.texts.part1Text2)}
        </ThemeText>
        <ThemeText style={styles.paragraphSpace}>
          {t(InformationTexts.inspection.texts.part1Text3)}
        </ThemeText>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            Linking.openURL(t(InformationTexts.inspection.texts.part1Link1.url))
          }
          accessibilityRole="button"
        >
          <ThemeText type="body__primary--underline">
            {t(InformationTexts.inspection.texts.part1Link1.text)}
          </ThemeText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            Linking.openURL(t(InformationTexts.inspection.texts.part1Link2.url))
          }
          accessibilityRole="button"
        >
          <ThemeText type="body__primary--underline">
            {t(InformationTexts.inspection.texts.part1Link2.text)}
          </ThemeText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  content: {
    padding: theme.spacings.medium,
  },
  paragraphHeading: {
    marginVertical: theme.spacings.medium,
  },
  bullet: {
    marginTop: theme.spacings.medium,
  },
  paragraphSpace: {
    marginTop: theme.spacings.medium,
  },
  link: {
    marginTop: theme.spacings.medium,
  },
}));
