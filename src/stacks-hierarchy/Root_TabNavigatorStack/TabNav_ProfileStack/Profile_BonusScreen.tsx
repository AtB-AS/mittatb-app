import {GenericSectionItem, Section} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {BonusProfileTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemedCityBike} from '@atb/theme/ThemedAssets'; // TODO: update with ne illustration when available
import {StarFill} from '@atb/assets/svg/mono-icons/bonus';

export const Profile_BonusScreen = () => {
  useThemeContext();
  const {t} = useTranslation();
  const styles = useStyles();

  const currentPoints = 5; // TODO: get actual value when available

  return (
    <FullScreenView
      headerProps={{
        title: t(BonusProfileTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
    >
      <View style={styles.container}>
        <Section style={styles.section}>
          <GenericSectionItem style={styles.currentPointsContainer}>
            <View>
              <View style={styles.currentPointsDisplay}>
                <ThemeText typography="body__primary--jumbo--bold">
                  {currentPoints}
                </ThemeText>
                <ThemeIcon svg={StarFill} size="large" />
              </View>

              <ThemeText typography="body__secondary">
                {t(BonusProfileTexts.yourBonusPoints)}
              </ThemeText>
            </View>
            <ThemedCityBike />
          </GenericSectionItem>
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacing.large,
  },
  section: {
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    marginTop: theme.spacing.small,
  },
  currentPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentPointsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
}));
