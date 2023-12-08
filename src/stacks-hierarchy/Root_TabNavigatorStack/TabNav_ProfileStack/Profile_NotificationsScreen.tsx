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
import {useNotifications, isConfigEnabled} from '@atb/notifications';
import {Button} from '@atb/components/button';
import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';
import {useProfileQuery} from '@atb/queries';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';
type NotificationsScreenProps =
  ProfileScreenProps<'Profile_NotificationsScreen'>;

export const Profile_NotificationsScreen = ({
  navigation,
}: NotificationsScreenProps) => {
  const style = useStyles();
  const {t} = useTranslation();
  const isFocusedAndActive = useIsFocusedAndActive();
  const {
    permissionStatus,
    config,
    requestPermissions,
    checkPermissions,
    updateConfig,
  } = useNotifications();

  const {data, isLoading: loadingProfile} = useProfileQuery();

  useEffect(() => {
    if (isFocusedAndActive) {
      checkPermissions();
    }
  }, [isFocusedAndActive, checkPermissions]);

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      await requestPermissions();
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
      {(permissionStatus === 'loading' || loadingProfile) && (
        <Processing message={t(dictionary.loading)} />
      )}
      {permissionStatus !== 'loading' && (
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
                permissionStatus === 'granted' &&
                isConfigEnabled(config?.modes, 'push')
              }
              disabled={
                permissionStatus === 'updating' || permissionStatus === 'denied'
              }
              onValueChange={handlePushNotificationToggle}
            />
          </Section>
          {data?.email === '' && (
            <View style={style.button}>
              <Button
                onPress={() => navigation.navigate('Profile_EditProfileScreen')}
                text={t(
                  ProfileTexts.sections.settings.linkSectionItems.notifications
                    .button,
                )}
                mode="secondary"
              />
            </View>
          )}

          {permissionStatus !== 'error' && permissionStatus === 'denied' && (
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
          {permissionStatus === 'error' && (
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
  button: {
    marginHorizontal: theme.spacings.medium,
  },
  messageBox: {
    margin: theme.spacings.medium,
  },
}));
