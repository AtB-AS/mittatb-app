import {LinkSectionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext.tsx';
import {useAuthContext} from '@atb/auth';

type ProfileProps = ProfileScreenProps<'Profile_SettingsScreen'>;

export const Profile_SettingsScreen = ({navigation}: ProfileProps) => {
  const style = useStyle();
  const {t} = useTranslation();
  const {isPushNotificationsEnabled} = useFeatureTogglesContext();
  const {disable_travelcard} = useRemoteConfigContext();
  const {isTravelAidEnabled} = useFeatureTogglesContext();
  const {enable_ticketing} = useRemoteConfigContext();
  const {authenticationType} = useAuthContext();

  return (
    <FullScreenView
      headerProps={{
        title: t(ProfileTexts.sections.settings.heading),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(ProfileTexts.sections.settings.heading)}
        />
      )}
    >
      <View
        testID="profileHomeScrollView"
        importantForAccessibility="no"
        style={style.contentContainer}
      >
        <ContentHeading
          text={t(ProfileTexts.sections.settings.groups.profileSettings)}
        />
        <Section>
          {isTravelAidEnabled ? (
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.travelAid.label,
              )}
              onPress={() => navigation.navigate('Profile_TravelAidScreen')}
              testID="travelAidButton"
            />
          ) : null}

          {enable_ticketing ? (
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.userProfile
                  .label,
              )}
              onPress={() =>
                navigation.navigate('Profile_DefaultUserProfileScreen')
              }
              testID="defaultTravellerButton"
            />
          ) : null}

          {authenticationType === 'phone' && (
            <LinkSectionItem
              text={
                disable_travelcard
                  ? t(
                      ProfileTexts.sections.settings.linkSectionItems
                        .travelToken.labelWithoutTravelcard,
                    )
                  : t(
                      ProfileTexts.sections.settings.linkSectionItems
                        .travelToken.label,
                    )
              }
              onPress={() => navigation.navigate('Profile_TravelTokenScreen')}
              testID="travelTokenButton"
            />
          )}
        </Section>

        <ContentHeading
          text={t(ProfileTexts.sections.settings.groups.appSettings)}
        />
        <Section>
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.appearance.label,
            )}
            onPress={() => navigation.navigate('Profile_AppearanceScreen')}
            testID="appearanceButton"
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.startScreen.label,
            )}
            onPress={() =>
              navigation.navigate('Profile_SelectStartScreenScreen')
            }
            testID="startScreenButton"
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.language.label,
            )}
            onPress={() => navigation.navigate('Profile_LanguageScreen')}
            testID="languageButton"
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.privacy.label,
            )}
            onPress={() => navigation.navigate('Profile_PrivacyScreen')}
            testID="privacyButton"
          />
          {isPushNotificationsEnabled && (
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .label,
              )}
              onPress={() => navigation.navigate('Profile_NotificationsScreen')}
              testID="notificationsButton"
            />
          )}
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  contentContainer: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
  },
}));
