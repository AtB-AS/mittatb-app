import React, {useEffect} from 'react';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {Linking, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Processing} from '@atb/components/loading';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useNotifications, isConfigEnabled} from '@atb/notifications';
import {useFirestoreConfiguration} from '@atb/configuration';
import {NotificationConfigGroup} from '@atb/notifications/types';
import {ContentHeading} from '@atb/components/content-heading';
import {useProfileQuery} from '@atb/queries';
import {Button} from '@atb/components/button';
import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';
type NotificationsScreenProps =
  ProfileScreenProps<'Profile_NotificationsScreen'>;

export const Profile_NotificationsScreen = ({
  navigation,
}: NotificationsScreenProps) => {
  const style = useStyles();
  const {t, language} = useTranslation();
  const isFocusedAndActive = useIsFocusedAndActive();
  const {
    permissionStatus,
    config,
    requestPermissions,
    checkPermissions,
    updateConfig,
  } = useNotifications();
  const {notificationConfig} = useFirestoreConfiguration();
  const profileQuery = useProfileQuery();

  useEffect(() => {
    if (isFocusedAndActive) {
      checkPermissions();
    }
  }, [isFocusedAndActive, checkPermissions]);

  const hasNoEmail = profileQuery.isSuccess && profileQuery.data.email === '';
  const mailEnabled = isConfigEnabled(config?.modes, 'mail') && !hasNoEmail;
  const pushEnabled =
    isConfigEnabled(config?.modes, 'push') && permissionStatus === 'granted';
  const anyModeEnabled = mailEnabled || pushEnabled;

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
          <ThemeText color={themeColor} type="heading--medium">
            {t(
              ProfileTexts.sections.settings.linkSectionItems.notifications
                .heading,
            )}
          </ThemeText>
        </View>
      )}
    >
      {(permissionStatus === 'loading' || profileQuery.isLoading) && (
        <Processing message={t(dictionary.loading)} />
      )}
      {permissionStatus !== 'loading' && (
        <View style={style.content}>
          <ContentHeading
            text={t(
              ProfileTexts.sections.settings.linkSectionItems.notifications
                .modesHeading,
            )}
          />
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
              disabled={hasNoEmail}
              value={mailEnabled}
              onValueChange={(enabled) => handleModeToggle('mail', enabled)}
            />
          </Section>
          {hasNoEmail && (
            <Button
              onPress={() => navigation.navigate('Profile_EditProfileScreen')}
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .button,
              )}
              interactiveColor="interactive_2"
              mode="secondary"
            />
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
              disabled={
                permissionStatus === 'updating' || permissionStatus === 'denied'
              }
              onValueChange={(enabled) => handleModeToggle('push', enabled)}
            />
          </Section>

          {permissionStatus !== 'error' && permissionStatus === 'denied' && (
            <MessageInfoBox
              type="info"
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
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .permissionRequired.action,
                ),
                action: () => Linking.openSettings(),
              }}
            />
          )}
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
    marginHorizontal: theme.spacings.medium,
  },
  content: {
    margin: theme.spacings.medium,
    rowGap: theme.spacings.medium,
  },
}));
