import {useOnlySingleLocation} from '@atb/location-search';
import {DeparturesV2} from '@atb/screens/Departures/components/DeparturesV2';
import React from 'react';
import {Location} from '@atb/favorites/types';
import {DashboardScreenProps} from '@atb/screens/Dashboard/types';
import {Place} from '@atb/api/types/departures';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';

export type NearbyDeparturesScreenParams = {
  location: Location;
};

type RootProps = DashboardScreenProps<'NearbyDeparturesScreen'>;

const NearbyDeparturesScreen = ({navigation}: RootProps) => {
  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');

  const navigateToPlace = (place: Place) => {
    navigation.navigate('NearbyLinesScreen', {
      place,
    });
  };
  const {t} = useTranslation();

  return (
    <DeparturesV2
      navigation={navigation}
      fromLocation={fromLocation}
      callerRouteName={'NearbyDeparturesScreen'}
      onSelect={navigateToPlace}
      title={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
      leftButton={{type: 'close'}}
    />
  );
};

export default NearbyDeparturesScreen;
