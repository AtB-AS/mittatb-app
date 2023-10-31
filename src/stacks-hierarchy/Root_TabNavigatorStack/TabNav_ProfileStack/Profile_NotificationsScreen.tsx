import React from 'react';
import {FullScreenView} from '@atb/components/screen-view';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StaticColorByType} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Profile_NotificationsScreen = () => {
  const style = useStyles();
  const {t} = useTranslation();

  const handlePushNotificationToggle = async (checked: boolean) => {
    console.log('Turn push', checked ? 'on' : 'off');
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
            onValueChange={handlePushNotificationToggle}
          />
        </Section>
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
}));
