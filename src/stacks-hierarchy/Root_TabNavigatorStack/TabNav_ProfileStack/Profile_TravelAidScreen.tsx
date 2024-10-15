import React from 'react';
import {Linking, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {getUnescapedTextForLanguage, useTranslation} from '@atb/translations';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import TravelAidSettingsTexts from '@atb/translations/screens/subscreens/TravelAidSettingsTexts';
import {
  GenericSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {useFirestoreConfiguration} from '@atb/configuration';
import {Button} from '@atb/components/button';
import {usePreferences} from '@atb/preferences';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {ProfileScreenProps} from './navigation-types';
import Bugsnag from '@bugsnag/react-native';

type Props = ProfileScreenProps<'Profile_TravelAidScreen'>;

export const Profile_TravelAidScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {appTexts} = useFirestoreConfiguration();
  const {contact_phone_number} = useRemoteConfig();
  const {setPreference, preferences} = usePreferences();

  const hasContactPhoneNumber =
    typeof contact_phone_number === 'string' &&
    contact_phone_number.trim() !== '';

  const profileTravelAidSubtext = getUnescapedTextForLanguage(
    appTexts?.getAppText('travelAidSubText'),
    language,
  );

  const travelAidToggleTitle = t(TravelAidSettingsTexts.toggle.title);
  const travelAidSubtext =
    profileTravelAidSubtext ?? t(TravelAidSettingsTexts.toggle.subText);

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
            value={preferences.travelAid}
            onValueChange={(checked) => setPreference({travelAid: checked})}
            subtext={travelAidSubtext}
            isMarkdown
            testID="toggleTravelAid"
          />
          <GenericSectionItem style={styles.buttonContainer}>
            <View style={styles.buttonContainer}>
              <Button
                mode="secondary"
                backgroundColor="background_0"
                text={t(TravelAidSettingsTexts.button.importantInfo.title)}
                accessibilityHint={t(
                  TravelAidSettingsTexts.button.importantInfo.a11yHint,
                )}
                accessibilityRole="button"
                testID="travelAidImportantInformationButton"
                onPress={() => {
                  navigation.navigate('Profile_TravelAidInformationScreen');
                }}
              />
              {hasContactPhoneNumber && (
                <Button
                  mode="secondary"
                  backgroundColor="background_0"
                  text={t(TravelAidSettingsTexts.button.contact.title)}
                  accessibilityHint={t(
                    TravelAidSettingsTexts.button.contact.a11yHint,
                  )}
                  accessibilityRole="button"
                  testID="travelAidContactCustomerServiceButton"
                  onPress={async () => {
                    const phoneNumber = `tel:${contact_phone_number}`;
                    if (await Linking.canOpenURL(phoneNumber)) {
                      Linking.openURL(phoneNumber);
                    } else {
                      Bugsnag.notify(
                        new Error(
                          'Could not open phone number in accessiblity settings',
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
    margin: theme.spacings.medium,
    rowGap: theme.spacings.small,
  },
  buttonContainer: {
    rowGap: theme.spacings.medium,
    flex: 1,
  },
}));
