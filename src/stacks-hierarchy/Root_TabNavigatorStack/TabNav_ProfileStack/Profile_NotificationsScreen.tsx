import React from 'react';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {Linking, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import {usePushNotifications} from '@atb/notifications';
import {MessageBox} from '@atb/components/message-box';
import {useConfig} from '@atb/notifications/use-config';
import {isConfigEnabled} from '@atb/notifications/utils';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Profile_NotificationsScreen = () => {
  const style = useStyles();
  const {t} = useTranslation();
  const {
    isPermissionAccepted: isPushPermissionAccepted,
    isLoading,
    isError,
    config,
    register,
  } = usePushNotifications();
  const {mutation: configMutation} = useConfig();

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      register();
    }
    configMutation.mutate({config_type: 'mode', id: 'push', enabled});
  };

  return (
    <FullScreenView
      headerProps={{
        leftButton: {type: 'back', withIcon: true},
        title: t(
          ProfileTexts.sections.settings.linkSectionItems.notifications.heading,
        ),
      }}
      parallaxContent={() => (
        <View style={style.parallaxContent}>
          <ThemeText color={themeColor} type="heading--medium">
            {t(
              ProfileTexts.sections.settings.linkSectionItems.notifications
                .heading,
            )}
          </ThemeText>
        </View>
      )}
    >
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
              isPushPermissionAccepted === true &&
              isConfigEnabled(config?.modes, 'push')
            }
            disabled={isLoading || !isPushPermissionAccepted}
            onValueChange={handlePushNotificationToggle}
          />
        </Section>
        {!isLoading && !isError && isPushPermissionAccepted === false && (
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
        {!isLoading && isError && (
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
