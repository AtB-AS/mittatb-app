import ScreenHeader from '@atb/components/screen-header';
import {Section, RadioSection, GenericItem} from '@atb/components/sections';
import {usePreferences} from '@atb/preferences';
import {StyleSheet, Theme} from '@atb/theme';
import {UserProfileSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {UserProfile} from '@atb/reference-data/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {getReferenceDataName} from '@atb/reference-data/utils';
import ThemeText from '@atb/components/text';

export default function DefaultUserProfile() {
  const {
    setPreference,
    preferences: {defaultUserTypeString},
  } = usePreferences();

  const styles = useStyles();
  const {t, language} = useTranslation();

  const {user_profiles: userProfiles} = useRemoteConfig();
  const selectedProfile =
    userProfiles.find((u) => u.userTypeString === defaultUserTypeString) ??
    userProfiles[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t(UserProfileSettingsTexts.header.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView style={styles.scrollView}>
        <ThemeText style={styles.description}>
          {t(UserProfileSettingsTexts.description)}
        </ThemeText>

        <RadioSection<UserProfile>
          items={userProfiles}
          keyExtractor={(u) => u.id}
          itemToText={(u) => getReferenceDataName(u, language)}
          selected={selectedProfile}
          onSelect={(u) =>
            setPreference({defaultUserTypeString: u.userTypeString})
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
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
