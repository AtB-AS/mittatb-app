import {Linking, TouchableOpacity, View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {InformationTexts, useTranslation} from '@atb/translations';
import {ScrollView} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import ThemeText from '@atb/components/text';

export default function PaymentInformation() {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(InformationTexts.payment.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
          {t(InformationTexts.payment.texts.part1Heading)}
        </ThemeText>
        <ThemeText>{t(InformationTexts.payment.texts.part1Text)}</ThemeText>
        <ThemeText style={styles.paragraphHeading} type="heading__paragraph">
          {t(InformationTexts.payment.texts.part2Heading)}
        </ThemeText>
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
}));
