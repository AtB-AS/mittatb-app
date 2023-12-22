import React from 'react';
import {View} from 'react-native';
import {RadioGroupSection} from '@atb/components/sections';
import {usePreferences} from '@atb/preferences';
import {StyleSheet, Theme} from '@atb/theme';
import {UserProfileSettingsTexts, useTranslation} from '@atb/translations';
import {
  getReferenceDataName,
  useFirestoreConfiguration,
  UserProfile,
} from '@atb/configuration';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';

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
    <FullScreenView
      headerProps={{
        title: t(UserProfileSettingsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={() => (
        <ScreenHeading text={t(UserProfileSettingsTexts.header.title)} />
      )}
    >
      <View style={styles.content}>
        <ContentHeading text={t(UserProfileSettingsTexts.description)} />
        <RadioGroupSection<UserProfile>
          items={selectableUserProfiles}
          keyExtractor={(u) => u.id}
          itemToText={(u) => getReferenceDataName(u, language)}
          selected={selectedProfile}
          onSelect={(u) =>
            setPreference({defaultUserTypeString: u.userTypeString})
          }
        />
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    margin: theme.spacings.medium,
    rowGap: theme.spacings.small,
  },
}));
