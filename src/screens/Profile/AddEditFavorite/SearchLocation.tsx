import FullScreenHeader from '@atb/components/screen-header/full-header';
import {Location, SearchLocation} from '@atb/favorites/types';
import {LocationSearchContent} from '@atb/location-search/LocationSearch';
import {StyleSheet} from '@atb/theme';
import {AddEditFavoriteTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Keyboard, View} from 'react-native';
import {LocationSearchNavigationProp} from './';

export type SearchStopPlaceProps = {
  navigation: LocationSearchNavigationProp;
};

export default function SearchStopPlace({navigation}: SearchStopPlaceProps) {
  const {t} = useTranslation();
  const styles = useThemeStyles();

  const onSelect = (location: SearchLocation) => {
    Keyboard.dismiss();
    navigation.navigate('AddEditFavorite', {
      screen: 'AddEditForm',
      params: {searchLocation: location},
    });
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(AddEditFavoriteTexts.header.title)}
        leftButton={{type: 'close'}}
      />

      <LocationSearchContent
        onSelect={onSelect}
        label={t(AddEditFavoriteTexts.fields.location.label)}
        placeholder={t(AddEditFavoriteTexts.fields.location.placeholder)}
        favoriteChipTypes={[]}
      />
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
}));
