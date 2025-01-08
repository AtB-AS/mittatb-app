import React from 'react';
import {Linking, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Theme} from '@atb/theme/colors';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {FeedbackTexts, useTranslation} from '@atb/translations';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import Intercom from '@intercom/intercom-react-native';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {FeedbackQuestionsViewContext} from './FeedbackContext';
import {Opinions} from './Feedback';

type SubmittedComponentProps = {
  viewContext: FeedbackQuestionsViewContext;
  opinion: Opinions;
  selectedTextAlternatives: (string | undefined)[];
  firebaseId?: string;
};

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];
const getInteractiveColor = (theme: Theme) => theme.color.interactive[2];

export const SubmittedComponent = ({
  viewContext,
  opinion,
  selectedTextAlternatives,
  firebaseId,
}: SubmittedComponentProps) => {
  const styles = useSubmittedComponentStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const focusRef = useFocusOnLoad();
  const {customer_service_url, enable_intercom} = useRemoteConfigContext();

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
      Intercom.presentMessageComposer();
    } else {
      Linking.openURL(customer_service_url);
    }
  };

  return (
    <View style={styles.container}>
      <View accessible={true} accessibilityRole="header" ref={focusRef}>
        <ThemeText
          typography="body__primary--bold"
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
            expanded={true}
            onPress={handleButtonClick}
            text={t(FeedbackTexts.additionalFeedback.intercomButton)}
            rightIcon={{svg: Chat}}
            interactiveColor={getInteractiveColor(theme)}
          />
        ) : (
          <Button
            expanded={true}
            onPress={handleButtonClick}
            text={t(FeedbackTexts.additionalFeedback.contactsheetButton)}
            rightIcon={{svg: ExternalLink}}
            accessibilityRole="link"
            interactiveColor={getInteractiveColor(theme)}
          />
        )}
      </View>
    </View>
  );
};

const useSubmittedComponentStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacing.xLarge,
  },
  centerText: {
    textAlign: 'center',
  },
  questionText: {
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  button: {
    marginTop: theme.spacing.large,
  },
}));
