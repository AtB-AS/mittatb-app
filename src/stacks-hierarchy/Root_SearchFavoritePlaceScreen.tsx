import {FullScreenHeader} from '@atb/components/screen-header';
import {SearchLocation} from '@atb/favorites';
import {LocationSearchContent} from './Root_LocationSearchByTextScreen';
import {StyleSheet} from '@atb/theme';
import {AddEditFavoriteTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Keyboard, View} from 'react-native';
import {RootStackScreenProps} from './navigation-types';

type Props = RootStackScreenProps<'Root_SearchFavoritePlaceScreen'>;

export const Root_SearchFavoritePlaceScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useThemeStyles();

  const onSelect = (location: SearchLocation) => {
    Keyboard.dismiss();
    navigation.navigate('Root_AddEditFavoritePlaceScreen', {
      searchLocation: location,
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
        onAddFavoritePlace={() =>
          navigation.navigate('Root_SearchFavoritePlaceScreen')
        }
        onlyStopPlacesCheckboxInitialState={false}
      />
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
    flex: 1,
  },
}));
