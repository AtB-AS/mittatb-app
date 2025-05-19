import {LinkSectionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ProfileScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/navigation-types';

type FavoriteProps = ProfileScreenProps<'Profile_FavoriteScreen'>;

export const Profile_FavoriteScreen = ({navigation}: FavoriteProps) => {
  const style = useStyle();
  const {t} = useTranslation();

  return (
    <FullScreenView
      headerProps={{
        title: t(ProfileTexts.sections.favorites.heading),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(ProfileTexts.sections.favorites.heading)}
        />
      )}
    >
      <View
        testID="profileFavoriteScrollView"
        importantForAccessibility="no"
        style={style.contentContainer}
      >
        <Section>
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.favorites.linkSectionItems.places.label,
            )}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.favorites.linkSectionItems.places
                  .a11yHint,
              ),
            }}
            testID="favoriteLocationsButton"
            onPress={() => navigation.navigate('Profile_FavoriteListScreen')}
          />
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.favorites.linkSectionItems.departures.label,
            )}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.favorites.linkSectionItems.departures
                  .a11yHint,
              ),
            }}
            testID="favoriteDeparturesButton"
            onPress={() =>
              navigation.navigate('Profile_FavoriteDeparturesScreen')
            }
          />
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  contentContainer: {
    rowGap: theme.spacing.medium,
    margin: theme.spacing.medium,
  },
}));
