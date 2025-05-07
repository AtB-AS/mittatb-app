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
import {usePreferencesContext} from '@atb/preferences';
import Bugsnag from '@bugsnag/react-native';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

export const Profile_TravelAidScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {setPreference, preferences} = usePreferencesContext();
  const {contactPhoneNumber} = useFirestoreConfigurationContext();
  const analytics = useAnalyticsContext();
  const screenReaderEnabled = useIsScreenReaderEnabled();

  const backgroundColor = theme.color.background.neutral[0];
  const hasContactPhoneNumber = !!contactPhoneNumber;

  const travelAidToggleTitle = t(TravelAidSettingsTexts.toggle.title);
  const travelAidSubtext = t(TravelAidSettingsTexts.toggle.subText);

  return (
    <FullScreenView
      headerProps={{
        title: t(TravelAidSettingsTexts.header.accessibility.title),
        leftButton: {type: 'back', withIcon: true},
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
            text={travelAidToggleTitle}
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
              setPreference({journeyAidEnabled: checked});
            }}
            subtext={travelAidSubtext}
            isSubtextMarkdown
            testID="toggleTravelAid"
          />
          <GenericSectionItem style={styles.buttonContainer}>
            <View style={styles.buttonContainer}>
              {hasContactPhoneNumber && (
                <Button
                  expanded={true}
                  mode="secondary"
                  backgroundColor={backgroundColor}
                  text={t(TravelAidSettingsTexts.button.contact.title)}
                  accessibilityHint={t(
                    TravelAidSettingsTexts.button.contact.a11yHint,
                  )}
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
              )}
            </View>
          </GenericSectionItem>
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
