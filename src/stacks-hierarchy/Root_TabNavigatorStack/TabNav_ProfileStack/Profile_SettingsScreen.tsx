import {LinkSectionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useAuthContext} from '@atb/modules/auth';
import {AccesstbilityCircle} from '@atb/assets/svg/mono-icons/miscellaneous';
import {Travellers} from '@atb/assets/svg/mono-icons/ticketing';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Profile} from '@atb/assets/svg/mono-icons/tab-bar';
import {
  Language,
  Notification,
  Privacy,
  Theme as ThemeIcon,
} from '@atb/assets/svg/mono-icons/profile';
import {House} from '@atb/assets/svg/mono-icons/places';

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
        leftButton: {type: 'back'},
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
              leftIcon={{svg: AccesstbilityCircle}}
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
              leftIcon={{svg: Travellers}}
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
              leftIcon={{svg: Phone}}
              onPress={() => navigation.navigate('Profile_TravelTokenScreen')}
              testID="travelTokenButton"
            />
          )}
          {authenticationType === 'phone' && (
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.account.linkSectionItems.editProfile
                  .label,
              )}
              leftIcon={{svg: Profile}}
              onPress={() => navigation.navigate('Profile_EditProfileScreen')}
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
            leftIcon={{svg: ThemeIcon}}
            onPress={() => navigation.navigate('Profile_AppearanceScreen')}
            testID="appearanceButton"
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.startScreen.label,
            )}
            leftIcon={{svg: House}}
            onPress={() =>
              navigation.navigate('Profile_SelectStartScreenScreen')
            }
            testID="startScreenButton"
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.language.label,
            )}
            leftIcon={{svg: Language}}
            onPress={() => navigation.navigate('Profile_LanguageScreen')}
            testID="languageButton"
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.privacy.label,
            )}
            leftIcon={{svg: Privacy}}
            onPress={() => navigation.navigate('Profile_PrivacyScreen')}
            testID="privacyButton"
          />
          {isPushNotificationsEnabled && (
            <LinkSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .label,
              )}
              leftIcon={{svg: Notification}}
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
