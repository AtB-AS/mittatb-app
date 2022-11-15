import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {LocationSearchStackScreenProps} from './navigation-types';
import {Map} from '@atb/components/map';
import {Location} from '@atb/favorites/types';

export type Props = LocationSearchStackScreenProps<'LocationSearchByMapScreen'>;

export const LocationSearchByMapScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, initialLocation},
  },
}) => {
  const onLocationSelect = (selectedLocation?: Location) => {
    navigation.navigate({
      name: callerRouteName as any,
      params: {
        [callerRouteParam]: selectedLocation,
      },
      merge: true,
    });
  };

  const styles = useMapStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.mapSelection.header.title)}
        leftButton={{type: 'back'}}
      />
      <Map
        onLocationSelect={onLocationSelect}
        initialLocation={initialLocation}
        selectionMode={'ExploreLocation'}
      />
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));
