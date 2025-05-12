import React, {useEffect} from 'react';
import {FullScreenView} from '@atb/components/screen-view';
import {
  MessageSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {Linking, Platform, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Processing} from '@atb/components/loading';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {
  useNotificationsContext,
  isConfigEnabled,
} from '@atb/modules/notifications';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {NotificationConfigGroup} from '@atb/modules/notifications';
import {ContentHeading} from '@atb/components/heading';
import {useProfileQuery} from '@atb/queries';
import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {useAuthContext} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

type NotificationsScreenProps =
  ProfileScreenProps<'Profile_NotificationsScreen'>;

export const Profile_NotificationsScreen = ({
  navigation,
}: NotificationsScreenProps) => {
  const style = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.accent[0];
  const isFocusedAndActive = useIsFocusedAndActive();
  const {
    permissionStatus,
    config,
    requestPermissions,
    checkPermissions,
    updateConfig,
  } = useNotificationsContext();
  const {notificationConfig} = useFirestoreConfigurationContext();
  const profileQuery = useProfileQuery();
  const {authenticationType} = useAuthContext();
  const {disable_email_field_in_profile_page} = useRemoteConfigContext();

  useEffect(() => {
    if (isFocusedAndActive) {
      checkPermissions();
    }
  }, [isFocusedAndActive, checkPermissions]);

  const hasNoEmail = profileQuery.isSuccess && profileQuery.data.email === '';
  const mailEnabled = isConfigEnabled(config?.modes, 'mail');
  const pushEnabled = isConfigEnabled(config?.modes, 'push');
  const anyModeEnabled = mailEnabled || pushEnabled;

  // Prompt for push permissions on iOS, since it won't appear in the system
  // settings until we do. On Android we don't know if we have asked for
  // permissions before, but the option will always appear in the system
  // settings, so we can always redirect the user there.
  const shouldPromptForPushPermission =
    Platform.OS === 'ios' && pushEnabled && permissionStatus === 'undetermined';

  // Redirect to system settings if we need permissions, but are not able to
  // prompt the user for it.
  const shouldRedirectToSettings =
    !shouldPromptForPushPermission &&
    pushEnabled &&
    permissionStatus === 'denied';

  const handleModeToggle = async (id: string, enabled: boolean) => {
    if (id === 'push' && enabled) {
      await requestPermissions();
    }
    updateConfig({config_type: 'mode', id, enabled});
  };
  const handleGroupToggle = async (id: string, enabled: boolean) => {
    updateConfig({config_type: 'group', id, enabled});
  };
  return (
    <FullScreenView
      headerProps={{
        leftButton: {type: 'back', withIcon: true},
        title: t(
          ProfileTexts.sections.settings.linkSectionItems.notifications.heading,
        ),
      }}
      parallaxContent={(focusRef) => (
        <View style={style.parallaxContent} ref={focusRef} accessible={true}>
          <ThemeText color={themeColor} typography="heading--medium">
            {t(
              ProfileTexts.sections.settings.linkSectionItems.notifications
                .heading,
            )}
          </ThemeText>
        </View>
      )}
    >
      {permissionStatus === 'loading' || profileQuery.isLoading ? (
        <Processing message={t(dictionary.loading)} />
      ) : (
        <View style={style.content} testID="notificationsView">
          <ContentHeading
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.notifications
                .modesHeading,
            )}
          />
          {!disable_email_field_in_profile_page && (
            <Section>
              <ToggleSectionItem
                text={t(
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .emailToggle.text,
                )}
                subtext={
                  profileQuery.isLoading
                    ? undefined
                    : t(
                        profileQuery.data?.email
                          ? ProfileTexts.sections.settings.linkSectionItems.notifications.emailToggle.subText(
                              profileQuery.data.email,
                            )
                          : ProfileTexts.sections.settings.linkSectionItems
                              .notifications.emailToggle.noEmailPlaceholder,
                      )
                }
                value={mailEnabled}
                onValueChange={(enabled) => handleModeToggle('mail', enabled)}
                testID="emailToggle"
              />
              {mailEnabled && authenticationType === 'anonymous' && (
                <MessageSectionItem
                  messageType="info"
                  title={t(
                    ProfileTexts.sections.settings.linkSectionItems
                      .notifications.loginRequired.title,
                  )}
                  message={t(
                    ProfileTexts.sections.settings.linkSectionItems
                      .notifications.loginRequired.message,
                  )}
                />
              )}
              {hasNoEmail && mailEnabled && (
                <MessageSectionItem
                  messageType="info"
                  title={t(
                    ProfileTexts.sections.settings.linkSectionItems
                      .notifications.emailRequired.title,
                  )}
                  message={t(
                    ProfileTexts.sections.settings.linkSectionItems
                      .notifications.emailRequired.message,
                  )}
                  onPressConfig={{
                    text: t(
                      ProfileTexts.sections.settings.linkSectionItems
                        .notifications.emailRequired.action,
                    ),
                    action: () =>
                      navigation.navigate('Profile_EditProfileScreen'),
                  }}
                />
              )}
            </Section>
          )}

          <Section>
            <ToggleSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .pushToggle.text,
              )}
              subtext={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .pushToggle.subText,
              )}
              value={pushEnabled}
              onValueChange={(enabled) => handleModeToggle('push', enabled)}
              testID="pushToggle"
            />
            {shouldPromptForPushPermission && (
              <MessageSectionItem
                messageType="info"
                title={t(
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .promptRequired.title,
                )}
                message={t(
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .promptRequired.message,
                )}
                onPressConfig={{
                  text: t(
                    ProfileTexts.sections.settings.linkSectionItems
                      .notifications.promptRequired.action,
                  ),
                  action: () => requestPermissions(),
                }}
              />
            )}
            {shouldRedirectToSettings && (
              <MessageSectionItem
                messageType="info"
                title={t(
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .permissionRequired.title,
                )}
                message={t(
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .permissionRequired.message,
                )}
                onPressConfig={{
                  text: t(
                    ProfileTexts.sections.settings.linkSectionItems
                      .notifications.permissionRequired.action,
                  ),
                  action: () => Linking.openSettings(),
                }}
              />
            )}
          </Section>
          {permissionStatus === 'error' && (
            <MessageInfoBox
              type="error"
              title={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .permissionError.title,
              )}
              message={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .permissionError.message,
              )}
            />
          )}
          <ContentHeading
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.notifications
                .groupsHeading,
            )}
          />
          <Section>
            {notificationConfig?.groups
              .filter((g) => getTextForLanguage(g.toggleTitle, language))
              .map((group) => (
                <ToggleSectionItem
                  key={group.id}
                  text={getTextForLanguage(group.toggleTitle, language) ?? ''}
                  subtext={getTextForLanguage(
                    group.toggleDescription,
                    language,
                  )}
                  value={isConfigEnabled(
                    config?.groups,
                    group.id as NotificationConfigGroup['id'],
                  )}
                  disabled={!anyModeEnabled}
                  onValueChange={(enabled) =>
                    handleGroupToggle(group.id, enabled)
                  }
                  testID={`${group.id}Toggle`}
                />
              ))}
          </Section>
        </View>
      )}
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  parallaxContent: {
    marginHorizontal: theme.spacing.medium,
  },
  content: {
    margin: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
}));
