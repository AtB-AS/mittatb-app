import React from 'react';
import {Linking, View} from 'react-native';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import TravelAidSettingsTexts from '@atb/translations/screens/subscreens/TravelAidSettingsTexts';
import {
  GenericSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {Button} from '@atb/components/button';
import {usePreferencesContext} from '@atb/modules/preferences';
import Bugsnag from '@bugsnag/react-native';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {CustomerServiceText} from '@atb/translations/screens/subscreens/CustomerService';
import {ThemeText} from '@atb/components/text';
import {useOnboardingContext} from '@atb/modules/onboarding';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';

type Props = ProfileScreenProps<'Profile_TravelAidScreen'>;

export const Profile_TravelAidScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {setPreference, preferences} = usePreferencesContext();
  const {contactPhoneNumber} = useFirestoreConfigurationContext();
  const {isTravelAidStopButtonEnabled} = useFeatureTogglesContext();
  const analytics = useAnalyticsContext();
  const screenReaderEnabled = useIsScreenReaderEnabled();
  const {completeOnboardingSection} = useOnboardingContext();

  const backgroundColor = theme.color.background.neutral[0];
  const hasContactPhoneNumber = !!contactPhoneNumber;

  const focusRef = useFocusOnLoad(navigation);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(TravelAidSettingsTexts.header.accessibility.title),
        leftButton: {type: 'back'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(TravelAidSettingsTexts.header.accessibility.title)}
        />
      )}
    >
      <View style={styles.content}>
        <Section>
          <ToggleSectionItem
            text={t(TravelAidSettingsTexts.toggle.title)}
            value={preferences.journeyAidEnabled}
            onValueChange={(checked) => {
              analytics.logEvent(
                'Journey aid',
                'Journey aid preference toggled',
                {
                  enabled: checked,
                  screenReaderEnabled,
                },
              );
              completeOnboardingSection('travelAid');
              setPreference({journeyAidEnabled: checked});
            }}
            testID="toggleTravelAid"
          />
          <GenericSectionItem>
            <ThemeText isMarkdown={true} typography="body__s">
              {isTravelAidStopButtonEnabled
                ? t(TravelAidSettingsTexts.descriptionWithStopButton)
                : t(TravelAidSettingsTexts.descriptionWithoutStopButton)}
            </ThemeText>
          </GenericSectionItem>
          {hasContactPhoneNumber && (
            <GenericSectionItem style={styles.buttonContainer}>
              <View style={styles.buttonContainer}>
                <Button
                  expanded={true}
                  mode="secondary"
                  backgroundColor={backgroundColor}
                  text={t(CustomerServiceText.contact.title)}
                  accessibilityHint={t(CustomerServiceText.contact.a11yHint)}
                  accessibilityRole="button"
                  testID="travelAidContactCustomerServiceButton"
                  onPress={async () => {
                    const phoneNumber = `tel:${contactPhoneNumber}`;
                    if (await Linking.canOpenURL(phoneNumber)) {
                      Linking.openURL(phoneNumber);
                    } else {
                      Bugsnag.notify(
                        new Error(
                          'Could not open phone number in accessiblity settings' +
                            contactPhoneNumber,
                        ),
                      );
                    }
                  }}
                />
              </View>
            </GenericSectionItem>
          )}
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    margin: theme.spacing.medium,
    rowGap: theme.spacing.small,
  },
  buttonContainer: {
    rowGap: theme.spacing.medium,
    flex: 1,
  },
}));
