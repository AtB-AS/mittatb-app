import {ProfileTexts, useTranslation} from '@atb/translations';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {Linking, View} from 'react-native';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {Button} from '@atb/components/button';
import Bugsnag from '@bugsnag/react-native';
import {Support} from '@atb/assets/svg/mono-icons/actions';
import {CustomerServiceText} from '@atb/translations/screens/subscreens/CustomerService';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

export const Profile_HelpAndContactScreen = () => {
  const style = useStyle();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {contactPhoneNumber} = useFirestoreConfigurationContext();
  const {
    contact_form_url,
    lost_and_found_url,
    refound_url,
    frequently_asked_questions,
  } = useRemoteConfigContext();

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
          <Section>
            {contact_form_url && contact_form_url !== '' && (
              <LinkSectionItem
                text={t(ProfileTexts.sections.contact.contactForm)}
                icon={<ThemeIcon svg={ExternalLink} />}
                onPress={() => openLink(contact_form_url)}
                testID="contactInformationButton"
              />
            )}
            {lost_and_found_url && lost_and_found_url !== '' && (
              <LinkSectionItem
                text={t(ProfileTexts.sections.contact.lostAndFound)}
                icon={<ThemeIcon svg={ExternalLink} />}
                onPress={undefined}
                testID="lostAndFoundButton"
              />
            )}
            {refound_url && refound_url !== '' && (
              <LinkSectionItem
                text={t(ProfileTexts.sections.contact.refound)}
                icon={<ThemeIcon svg={ExternalLink} />}
                onPress={() => openLink(refound_url)}
                testID="refoundButton"
              />
            )}
            {frequently_asked_questions &&
              frequently_asked_questions !== '' && (
                <LinkSectionItem
                  text={t(
                    ProfileTexts.sections.contact.frequentlyAskedQuestions,
                  )}
                  icon={<ThemeIcon svg={ExternalLink} />}
                  onPress={() => openLink(frequently_asked_questions)}
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
}));
