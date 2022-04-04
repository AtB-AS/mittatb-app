import React from 'react';
import {Linking, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import Button from '../button';
import ThemeText from '@atb/components/text';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import Intercom from 'react-native-intercom';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {Chat, Support} from '@atb/assets/svg/mono-icons/actions';
import {FeedbackQuestionsViewContext} from './FeedbackContext';
import {Opinions} from '.';

type SubmittedComponentProps = {
  viewContext: FeedbackQuestionsViewContext;
  opinion: Opinions;
  selectedTextAlternatives: (string | undefined)[];
  firebaseId?: string;
};

const SubmittedComponent = ({
  viewContext,
  opinion,
  selectedTextAlternatives,
  firebaseId,
}: SubmittedComponentProps) => {
  const styles = useSubmittedComponentStyles();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();
  const {customer_service_url, enable_intercom} = useRemoteConfig();

  const handleButtonClick = () => {
    if (enable_intercom) {
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
    } else {
      Linking.openURL(customer_service_url);
    }
  };

  return (
    <View style={styles.container}>
      <View accessible={true} accessibilityRole="header" ref={focusRef}>
        <ThemeText
          type="body__primary--bold"
          style={[styles.questionText, styles.centerText]}
        >
          {t(FeedbackTexts.submittedText.thanks)}
        </ThemeText>
      </View>
      <View accessible={true}>
        <ThemeText style={styles.centerText}>
          {t(FeedbackTexts.additionalFeedback.text)}
        </ThemeText>
      </View>

      <View style={styles.button}>
        {enable_intercom ? (
          <Button
            onPress={handleButtonClick}
            text={t(FeedbackTexts.additionalFeedback.intercomButton)}
            icon={Chat}
            color="primary_2"
            iconPosition="right"
          />
        ) : (
          <Button
            onPress={handleButtonClick}
            text={t(FeedbackTexts.additionalFeedback.contactsheetButton)}
            icon={Support}
            color="primary_2"
            iconPosition="right"
          />
        )}
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
