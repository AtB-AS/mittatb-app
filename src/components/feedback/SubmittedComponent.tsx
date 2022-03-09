import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import ThemeText from '@atb/components/text';
import {useTranslation, FeedbackTexts} from '@atb/translations';

const SubmittedComponent = () => {
  const styles = useSubmittedComponentStyles();
  const {t} = useTranslation();

  return (
    <View style={[styles.container, styles.submittedView]}>
      <ThemeText
        type="body__primary--bold"
        style={[styles.questionText, styles.centerText]}
      >
        {t(FeedbackTexts.submittedText.thanks)}
      </ThemeText>
      <ThemeText>🎉</ThemeText>
    </View>
  );
};

const useSubmittedComponentStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    borderRadius: theme.border.radius.regular,
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
    marginVertical: theme.spacings.medium,
  },
  submittedView: {
    flex: 1,
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  questionText: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.large,
  },
}));

export default SubmittedComponent;
