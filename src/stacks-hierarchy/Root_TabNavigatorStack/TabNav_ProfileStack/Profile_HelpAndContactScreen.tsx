import {
  getTextForLanguage,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {Linking, View} from 'react-native';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {Button} from '@atb/components/button';
import Bugsnag from '@bugsnag/react-native';
import {Support} from '@atb/assets/svg/mono-icons/actions';
import {CustomerServiceText} from '@atb/translations/screens/subscreens/CustomerService';
import {ThemedContactIllustration} from '@atb/theme/ThemedAssets';
import {ExternalLinksTexts} from '@atb/translations/ExternalLinks';

export const Profile_HelpAndContactScreen = () => {
  const style = useStyle();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const {contactPhoneNumber, configurableLinks} =
    useFirestoreConfigurationContext();

  const contactFormUrl = getTextForLanguage(
    configurableLinks?.contactFormUrl,
    language,
  );
  const lostAndFoundUrl = getTextForLanguage(
    configurableLinks?.lostAndFoundUrl,
    language,
  );
  const frequentlyAskedQuestionsUrl = getTextForLanguage(
    configurableLinks?.frequentlyAskedQuestionsUrl,
    language,
  );
  const refundInfoUrl = getTextForLanguage(
    configurableLinks?.refundInfo,
    language,
  );

  const hasContactPhoneNumber = !!contactPhoneNumber;
  const backgroundColor = theme.color.background.neutral[1];

  return (
    <>
      <FullScreenView
        headerProps={{
          title: t(ProfileTexts.sections.contact.heading),
          leftButton: {type: 'back', withIcon: true},
        }}
        parallaxContent={(focusRef) => (
          <ScreenHeading
            ref={focusRef}
            text={t(ProfileTexts.sections.contact.helpAndContact)}
          />
        )}
      >
        <View
          testID="profileContactScrollView"
          importantForAccessibility="no"
          style={style.contentContainer}
        >
          <ThemedContactIllustration style={style.contactIllustration} />
          <Section>
            {!!contactFormUrl?.trim() && (
              <LinkSectionItem
                text={t(ProfileTexts.sections.contact.contactForm)}
                icon="external-link"
                onPress={() => openLink(contactFormUrl)}
                accessibility={{
                  accessibilityHint: t(
                    ExternalLinksTexts.a11yHintForExternalContent,
                  ),
                  accessibilityRole: 'link',
                }}
                testID="contactInformationButton"
              />
            )}
            {!!lostAndFoundUrl?.trim() && (
              <LinkSectionItem
                text={t(ProfileTexts.sections.contact.lostAndFound)}
                icon="external-link"
                onPress={() => openLink(lostAndFoundUrl)}
                accessibility={{
                  accessibilityHint: t(
                    ExternalLinksTexts.a11yHintForExternalContent,
                  ),
                  accessibilityRole: 'link',
                }}
                testID="lostAndFoundButton"
              />
            )}
            {!!refundInfoUrl?.trim() && (
              <LinkSectionItem
                text={t(ProfileTexts.sections.contact.refund)}
                icon="external-link"
                onPress={() => openLink(refundInfoUrl)}
                accessibility={{
                  accessibilityHint: t(
                    ExternalLinksTexts.a11yHintForExternalContent,
                  ),
                  accessibilityRole: 'link',
                }}
                testID="refundButton"
              />
            )}
            {!!frequentlyAskedQuestionsUrl?.trim() && (
              <LinkSectionItem
                text={t(ProfileTexts.sections.contact.frequentlyAskedQuestions)}
                icon="external-link"
                onPress={() => openLink(frequentlyAskedQuestionsUrl)}
                accessibility={{
                  accessibilityHint: t(
                    ExternalLinksTexts.a11yHintForExternalContent,
                  ),
                  accessibilityRole: 'link',
                }}
                testID="frequentlyAskedQuestionsButton"
              />
            )}
          </Section>
          {hasContactPhoneNumber && (
            <View style={style.buttonContainer}>
              <Button
                expanded={true}
                mode="secondary"
                backgroundColor={backgroundColor}
                text={t(CustomerServiceText.contact.title)}
                accessibilityHint={t(CustomerServiceText.contact.a11yHint)}
                rightIcon={{svg: Support}}
                accessibilityRole="button"
                testID="contactCustomerServiceButton"
                onPress={async () => openLink(`tel:${contactPhoneNumber}`)}
              />
            </View>
          )}
        </View>
      </FullScreenView>
    </>
  );
};

const openLink = async (url: string) => {
  if (await Linking.canOpenURL(url)) {
    Linking.openURL(url);
  } else {
    Bugsnag.notify(new Error(`Could not open URL: ${url}`));
  }
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  contentContainer: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
  },
  buttonContainer: {
    marginTop: theme.spacing.medium,
    flex: 1,
  },
  contactIllustration: {
    alignSelf: 'center',
  },
}));
