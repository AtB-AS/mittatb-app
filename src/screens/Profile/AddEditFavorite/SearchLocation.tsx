import React from 'react';
import {View} from 'react-native';
import {Close} from '../../../assets/svg/icons/actions';
import ThemeIcon from '../../../components/theme-icon';
import {LocationWithMetadata} from '../../../favorites/types';
import {LocationSearchContent} from '../../../location-search/LocationSearch';
import FullScreenHeader from '../../../ScreenHeader/full-header';
import {StyleSheet} from '../../../theme';
import {
  AddEditFavoriteTexts,
  LocationSearchTexts,
  useTranslation,
} from '../../../translations';
import {LocationSearchNavigationProp} from './';

export type SearchStopPlaceProps = {
  navigation: LocationSearchNavigationProp;
};

export default function SearchStopPlace({navigation}: SearchStopPlaceProps) {
  const {t} = useTranslation();
  const styles = useThemeStyles();

  const onSelect = (location: LocationWithMetadata) => {
    navigation.navigate('AddEditFavorite', {
      screen: 'AddEditForm',
      params: {searchLocation: location},
    });
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(AddEditFavoriteTexts.header.title)}
        leftButton={{
          onPress: () => navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(
            LocationSearchTexts.header.leftButton.a11yLabel,
          ),
          icon: <ThemeIcon svg={Close} />,
        }}
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
    backgroundColor: theme.background.level1,
    flex: 1,
  },
}));
