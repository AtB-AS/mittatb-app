import React, {useEffect} from 'react';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {Linking, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {dictionary, ProfileTexts, useTranslation} from '@atb/translations';
import {MessageBox} from '@atb/components/message-box';
import {Processing} from '@atb/components/loading';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {usePushNotifications, isConfigEnabled} from '@atb/notifications';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Profile_NotificationsScreen = () => {
  const style = useStyles();
  const {t} = useTranslation();
  const isFocusedAndActive = useIsFocusedAndActive();
  const {status, config, register, checkPermissions, updateConfig} =
    usePushNotifications();

  useEffect(() => {
    if (isFocusedAndActive) {
      checkPermissions();
    }
  }, [isFocusedAndActive, checkPermissions]);

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      await register();
    }
    updateConfig({config_type: 'mode', id: 'push', enabled});
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
        <View style={style.parallaxContent} ref={focusRef}>
          <ThemeText color={themeColor} type="heading--medium">
            {t(
              ProfileTexts.sections.settings.linkSectionItems.notifications
                .heading,
            )}
          </ThemeText>
        </View>
      )}
    >
      {status === 'loading' && <Processing message={t(dictionary.loading)} />}
      {status !== 'loading' && (
        <View style={style.content}>
          <Section withPadding>
            <ToggleSectionItem
              text={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .pushToggle.text,
              )}
              subtext={t(
                ProfileTexts.sections.settings.linkSectionItems.notifications
                  .pushToggle.subText,
              )}
              value={
                status === 'granted' && isConfigEnabled(config?.modes, 'push')
              }
              disabled={status === 'updating' || status === 'denied'}
              onValueChange={handlePushNotificationToggle}
            />
          </Section>
          {status !== 'error' && status === 'denied' && (
            <MessageBox
              style={style.messageBox}
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
          {status === 'error' && (
            <MessageBox
              style={style.messageBox}
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
    marginTop: theme.spacings.medium,
  },
  messageBox: {
    margin: theme.spacings.medium,
  },
}));
