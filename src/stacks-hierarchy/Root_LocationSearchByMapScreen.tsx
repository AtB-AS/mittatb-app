import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {Map} from '@atb/components/map';
import {Location} from '@atb/favorites';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';

export type Props = RootStackScreenProps<'Root_LocationSearchByMapScreen'>;

export const Root_LocationSearchByMapScreen: React.FC<Props> = ({
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
        selectionMode="ExploreLocation"
      />
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));
