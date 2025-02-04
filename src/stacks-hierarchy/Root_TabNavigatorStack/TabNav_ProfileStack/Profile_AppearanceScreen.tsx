import {Section, ToggleSectionItem} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {AppearanceSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Platform, View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

export const Profile_AppearanceScreen = () => {
  const {
    storedColorScheme,
    overrideSystemAppearance,
    updateThemePreference,
    overrideOSThemePreference,
    useAndroidSystemFont,
    updateAndroidFontOverride,
  } = useThemeContext();
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <FullScreenView
      headerProps={{
        title: t(AppearanceSettingsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(AppearanceSettingsTexts.header.title)}
        />
      )}
    >
      <View>
        <Section style={styles.section}>
          <ToggleSectionItem
            text={t(AppearanceSettingsTexts.actions.usePhoneTheme)}
            value={!overrideSystemAppearance}
            onValueChange={(checked) => overrideOSThemePreference(!checked)}
          />

          {overrideSystemAppearance && (
            <ToggleSectionItem
              text={t(AppearanceSettingsTexts.actions.darkMode)}
              value={storedColorScheme === 'dark'}
              onValueChange={(checked) =>
                updateThemePreference(checked ? 'dark' : 'light')
              }
            />
          )}
        </Section>
        {Platform.OS === 'android' && (
          <Section style={styles.section}>
            <ToggleSectionItem
              text={t(AppearanceSettingsTexts.actions.useSystemFont)}
              value={useAndroidSystemFont}
              onValueChange={(checked) => updateAndroidFontOverride(checked)}
            />
          </Section>
        )}
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    marginTop: theme.spacing.large,
  },
}));
