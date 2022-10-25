import {Place} from '@atb/api/types/departures';
import {Location} from '@atb/favorites/types';
import {useOnlySingleLocation} from '@atb/location-search';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React from 'react';
import {NearbyPlacesScreenTabProps} from './types';
import {DeparturesV2} from '@atb/screens/Departures/components/DeparturesV2';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';

export type DeparturesV2ScreenParams = {
  location: Location;
};

type RootProps = NearbyPlacesScreenTabProps<'DeparturesV2Screen'>;

export const DeparturesV2Screen = ({navigation}: RootProps) => {
  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');
  const {t} = useTranslation();

  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
      place,
    });
  };
  const {leftButton} = useServiceDisruptionSheet();

  return (
    <DeparturesV2
      navigation={navigation}
      fromLocation={fromLocation}
      callerRouteName={'DeparturesV2Screen'}
      onSelect={navigateToPlace}
      title={t(DeparturesTexts.header.title)}
      leftButton={leftButton}
      rightButton={{type: 'chat'}}
    />
  );
};
