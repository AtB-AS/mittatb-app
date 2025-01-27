import React from 'react';
import {View} from 'react-native';
import {RadioGroupSection} from '@atb/components/sections';
import {usePreferencesContext} from '@atb/preferences';
import {StyleSheet, Theme} from '@atb/theme';
import {UserProfileSettingsTexts, useTranslation} from '@atb/translations';
import {
  getReferenceDataName,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/configuration';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useThemeContext} from '@atb/theme';

export const Profile_DefaultUserProfileScreen = () => {
  const {
    setPreference,
    preferences: {defaultUserTypeString},
  } = usePreferencesContext();

  const styles = useStyles();
  const {t, language} = useTranslation();

  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];

  const {userProfiles} = useFirestoreConfigurationContext();

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
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(UserProfileSettingsTexts.header.title)}
        />
      )}
    >
      <View style={styles.content}>
        <ContentHeading text={t(UserProfileSettingsTexts.description)} />
        <RadioGroupSection<UserProfile>
          items={selectableUserProfiles}
          keyExtractor={(u) => u.id}
          itemToText={(u) => getReferenceDataName(u, language)}
          selected={selectedProfile}
          color={interactiveColor}
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
    margin: theme.spacing.medium,
    rowGap: theme.spacing.small,
  },
}));
