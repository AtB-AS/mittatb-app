import {
  RadioGroupSection,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {AppearanceSettingsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Platform, View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {AppearanceSelection} from '@atb/theme/ThemeContext';

export const Profile_AppearanceScreen = () => {
  const {
    appearanceSelection,
    setAppearanceSelection,
    androidSystemFont,
    setAndroidSystemFont,
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
      <View style={styles.container}>
        <ContentHeading text={t(AppearanceSettingsTexts.theme.heading)} />
        <Section>
          <RadioGroupSection<AppearanceSelection>
            items={[
              AppearanceSelection.SYSTEM,
              AppearanceSelection.LIGHT,
              AppearanceSelection.DARK,
            ]}
            itemToText={(item) => {
              switch (item) {
                case AppearanceSelection.SYSTEM:
                  return t(AppearanceSettingsTexts.theme.system);
                case AppearanceSelection.LIGHT:
                  return t(AppearanceSettingsTexts.theme.light);
                case AppearanceSelection.DARK:
                  return t(AppearanceSettingsTexts.theme.dark);
              }
            }}
            selected={appearanceSelection}
            keyExtractor={(item) => item}
            onSelect={(selection) => setAppearanceSelection(selection)}
          />
        </Section>
        {Platform.OS === 'android' && (
          <>
            <ContentHeading text={t(AppearanceSettingsTexts.font.heading)} />
            <Section>
              <ToggleSectionItem
                text={t(AppearanceSettingsTexts.font.toggle)}
                value={androidSystemFont}
                onValueChange={(checked) => setAndroidSystemFont(checked)}
              />
            </Section>
          </>
        )}
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.small,
    margin: theme.spacing.medium,
  },
}));
