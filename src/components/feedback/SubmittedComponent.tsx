import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import Button from '../button';
import ThemeText from '@atb/components/text';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import Intercom from 'react-native-intercom';
import {Chat} from '@atb/assets/svg/mono-icons/actions';

const SubmittedComponent = () => {
  const styles = useSubmittedComponentStyles();
  const {t} = useTranslation();

  const handleButtonClick = () => {
    console.log('clickity');
    Intercom.displayMessenger;
  };

  return (
    <View style={[styles.container]}>
      <ThemeText
        type="body__primary--bold"
        style={[styles.questionText, styles.centerText]}
      >
        {t(FeedbackTexts.submittedText.thanks)}
      </ThemeText>
      <ThemeText style={styles.centerText}>
        {t(FeedbackTexts.additionalFeedback.text)}
      </ThemeText>
      <View style={styles.button}>
        <Button
          onPress={handleButtonClick}
          text={t(FeedbackTexts.additionalFeedback.button)}
          mode="primary"
          icon={Chat}
          iconPosition="right"
        />
      </View>
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
  centerText: {
    textAlign: 'center',
  },
  questionText: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.large,
  },
  button: {
    marginTop: theme.spacings.large,
  },
}));

export default SubmittedComponent;
