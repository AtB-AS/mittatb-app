import {Place} from '@atb/api/types/departures';
import {Location} from '@atb/favorites/types';
import {useOnlySingleLocation} from '@atb/location-search';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import React from 'react';
import {DeparturesStackProps} from './types';
import {Departures} from '@atb/screens/Departures/components/Departures';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';

export type DeparturesScreenParams = {
  location: Location;
};

type RootProps = DeparturesStackProps<'DeparturesScreen'>;

export const DeparturesScreen = ({navigation}: RootProps) => {
  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');
  const {t} = useTranslation();

  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
      place,
    });
  };
  const {leftButton} = useServiceDisruptionSheet();

  return (
    <Departures
      navigation={navigation}
      fromLocation={fromLocation}
      callerRouteName={'DeparturesScreen'}
      onSelect={navigateToPlace}
      title={t(DeparturesTexts.header.title)}
      leftButton={leftButton}
      rightButton={{type: 'chat'}}
    />
  );
};
