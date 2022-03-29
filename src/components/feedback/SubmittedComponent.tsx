import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import Button from '../button';
import ThemeText from '@atb/components/text';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import Intercom from 'react-native-intercom';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {FeedbackQuestionsViewContext} from './FeedbackContext';
import {Opinions} from '.';

type SubmittedComponentProps = {
  viewContext: FeedbackQuestionsViewContext;
  opinion: Opinions;
  selectedTextAlternatives: (string | undefined)[];
  firebaseId?: string;
  style?: StyleProp<ViewStyle>;
};

const SubmittedComponent = ({
  viewContext,
  opinion,
  selectedTextAlternatives,
  firebaseId,
  style,
}: SubmittedComponentProps) => {
  const styles = useSubmittedComponentStyles();
  const {t} = useTranslation();

  const handleButtonClick = () => {
    const alternativeArrayConvertedToString =
      selectedTextAlternatives.join(', ');
    Intercom.logEvent('feedback-given', {
      viewContext: `Bruker har gitt feedback på ${viewContext}.`,
      mainImpression: `Hovedinntrykket var ${opinion}.`,
      selectedAlternatives:
        alternativeArrayConvertedToString || 'Ingen alternativer valgt.',
      firebaseId,
    });
    Intercom.displayMessageComposer();
  };

  return (
    <View style={[styles.container, style]}>
      <ThemeText type="body__primary--bold" style={styles.questionText}>
        {t(FeedbackTexts.submittedText.thanks)}
      </ThemeText>
      <ThemeText style={styles.centerText}>
        {t(FeedbackTexts.additionalFeedback.text)}
      </ThemeText>
      <View style={styles.button}>
        <Button
          onPress={handleButtonClick}
          text={t(FeedbackTexts.additionalFeedback.button)}
          icon={Chat}
          color="primary_2"
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
    padding: theme.spacings.xLarge,
  },
  centerText: {
    textAlign: 'center',
  },
  questionText: {
    textAlign: 'center',
    marginBottom: theme.spacings.large,
  },
  button: {
    marginTop: theme.spacings.large,
  },
}));

export default SubmittedComponent;
