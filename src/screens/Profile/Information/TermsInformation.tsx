import {Linking, TouchableOpacity, View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {InformationTexts, useTranslation} from '@atb/translations';
import {ScrollView} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import ThemeText from '@atb/components/text';

export default function TermsInformation() {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(InformationTexts.terms.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <ThemeText>{t(InformationTexts.terms.texts.part1Text)}</ThemeText>
        <ThemeText style={styles.bullet}>
          {t(InformationTexts.terms.texts.part1Bullet1)}
        </ThemeText>
        <ThemeText style={styles.bullet}>
          {t(InformationTexts.terms.texts.part1Bullet2)}
        </ThemeText>
        <ThemeText style={styles.bullet}>
          {t(InformationTexts.terms.texts.part1Bullet3)}
        </ThemeText>
        <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
          {t(InformationTexts.terms.texts.part2Heading)}
        </ThemeText>
        <ThemeText>{t(InformationTexts.terms.texts.part2Text)}</ThemeText>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            Linking.openURL(t(InformationTexts.terms.texts.part2Link1.url))
          }
          accessibilityRole="button"
        >
          <ThemeText type="body__primary--underline">
            {t(InformationTexts.terms.texts.part2Link1.text)}
          </ThemeText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            Linking.openURL(t(InformationTexts.terms.texts.part2Link2.url))
          }
          accessibilityRole="button"
        >
          <ThemeText type="body__primary--underline">
            {t(InformationTexts.terms.texts.part2Link2.text)}
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
  link: {
    marginTop: theme.spacings.medium,
  },
}));
