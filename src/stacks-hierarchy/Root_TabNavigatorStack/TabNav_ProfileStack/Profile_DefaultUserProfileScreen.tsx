import {RadioGroupSection} from '@atb/components/sections';
import {usePreferences} from '@atb/preferences';
import {StyleSheet, Theme} from '@atb/theme';
import {UserProfileSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {
  UserProfile,
  useFirestoreConfiguration,
  getReferenceDataName,
} from '@atb/configuration';
import {ThemeText} from '@atb/components/text';
import {View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';

export const Profile_DefaultUserProfileScreen = () => {
  const {
    setPreference,
    preferences: {defaultUserTypeString},
  } = usePreferences();

  const styles = useStyles();
  const {t, language} = useTranslation();

  const {userProfiles} = useFirestoreConfiguration();

  const selectedProfile =
    userProfiles.find(
      (userProfile) => userProfile.userTypeString === defaultUserTypeString,
    ) ?? userProfiles[0];

  const selectableUserProfiles = userProfiles.filter(
    (profile) => !profile.hideFromDefaultTravellerSelection,
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(UserProfileSettingsTexts.header.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView style={styles.scrollView}>
        <ThemeText style={styles.description}>
          {t(UserProfileSettingsTexts.description)}
        </ThemeText>

        <RadioGroupSection<UserProfile>
          items={selectableUserProfiles}
          keyExtractor={(u) => u.id}
          itemToText={(u) => getReferenceDataName(u, language)}
          selected={selectedProfile}
          onSelect={(u) =>
            setPreference({defaultUserTypeString: u.userTypeString})
          }
        />
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  scrollView: {
    margin: theme.spacings.medium,
  },
  description: {
    marginBottom: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
}));
