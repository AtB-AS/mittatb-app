import React from 'react';
import {Linking, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
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
import {usePreferences} from '@atb/preferences';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {ProfileScreenProps} from './navigation-types';
import Bugsnag from '@bugsnag/react-native';

type Props = ProfileScreenProps<'Profile_TravelAidScreen'>;

export const Profile_TravelAidScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {contact_phone_number, enable_travel_aid_stop_button} =
    useRemoteConfig();
  const {setPreference, preferences} = usePreferences();

  const hasContactPhoneNumber =
    typeof contact_phone_number === 'string' &&
    contact_phone_number.trim() !== '';

  const travelAidToggleTitle = t(TravelAidSettingsTexts.toggle.title);
  const travelAidSubtext = t(TravelAidSettingsTexts.toggle.subText);

  const toggleValue = !enable_travel_aid_stop_button
    ? false
    : preferences.travelAid;

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
            value={toggleValue}
            onValueChange={(checked) => setPreference({travelAid: checked})}
            subtext={travelAidSubtext}
            disabled={!enable_travel_aid_stop_button}
            isSubtextMarkdown
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
