import React from 'react';
import {Linking, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
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

type Props = ProfileScreenProps<'Profile_TravelAidScreen'>;

export const Profile_TravelAidScreen = ({}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {appTexts} = useFirestoreConfiguration();
  const {contact_phone_number} = useRemoteConfig();
  const {setPreference, preferences} = usePreferences();

  const firestoreSubText = getTextForLanguage(
    appTexts?.getAppText('travelAidSubText'),
    language,
  )?.replace(/\\n/g, '\n'); // need this to remove escape characters

  const subtext = firestoreSubText || t(TravelAidSettingsTexts.toggle.subText);

  return (
    <FullScreenView
      headerProps={{
        title: t(TravelAidSettingsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(TravelAidSettingsTexts.header.title)}
        />
      )}
    >
      <View style={styles.content}>
        <Section>
          <ToggleSectionItem
            text={t(TravelAidSettingsTexts.toggle.title)}
            subtext={subtext}
            subtextMarkdown={true}
            value={preferences.travelAid}
            onValueChange={(checked) => setPreference({travelAid: checked})}
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
                onPress={() => {}}
              />
              <Button
                mode="secondary"
                backgroundColor="background_0"
                text={t(TravelAidSettingsTexts.button.contact.title)}
                accessibilityHint={t(
                  TravelAidSettingsTexts.button.contact.a11yHint,
                )}
                accessibilityRole="button"
                testID="travelAidContactCustomerServiceButton"
                onPress={() => {
                  Linking.openURL(`tel:${contact_phone_number}`);
                }}
              />
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
