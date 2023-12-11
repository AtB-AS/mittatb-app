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
import {MessageBox} from '@atb/components/message-box';
import {Processing} from '@atb/components/loading';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useNotifications, isConfigEnabled} from '@atb/notifications';
import {useFirestoreConfiguration} from '@atb/configuration';
import {NotificationConfigGroup} from '@atb/notifications/types';
import {ContentHeading} from '@atb/components/content-heading';
import {useProfileQuery} from '@atb/queries';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Profile_NotificationsScreen = () => {
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

  useEffect(() => {
    if (isFocusedAndActive) {
      checkPermissions();
    }
  }, [isFocusedAndActive, checkPermissions]);
  const mailEnabled = isConfigEnabled(config?.modes, 'mail');
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
  const {data, isLoading} = useProfileQuery();

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
      {permissionStatus === 'loading' && (
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
                isLoading
                  ? undefined
                  : t(
                      data?.email
                        ? ProfileTexts.sections.settings.linkSectionItems.notifications.emailToggle.subText(
                            data.email,
                          )
                        : ProfileTexts.sections.settings.linkSectionItems
                            .notifications.emailToggle.noEmailPlaceholder,
                    )
              }
              value={isConfigEnabled(config?.modes, 'mail')}
              onValueChange={(enabled) => handleModeToggle('mail', enabled)}
            />
          </Section>
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
              value={isConfigEnabled(config?.modes, 'push')}
              disabled={
                permissionStatus === 'updating' || permissionStatus === 'denied'
              }
              onValueChange={(enabled) => handleModeToggle('push', enabled)}
            />
          </Section>
          {permissionStatus !== 'error' && permissionStatus === 'denied' && (
            <MessageBox
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
            <MessageBox
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
