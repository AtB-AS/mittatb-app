import {Place, StopPlacePosition} from '@atb/api/types/departures';
import {NearestStopPlacesQuery} from '@atb/api/types/generated/NearestStopPlacesQuery';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import SimpleDisappearingHeader from '@atb/components/disappearing-header/simple';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {LocationInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {Location} from '@atb/favorites/types';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useOnlySingleLocation} from '@atb/location-search';
import StopPlaces from '@atb/screens/Departures/components/StopPlaces';
import {useNearestStopsData} from '@atb/screens/Departures/state/nearby-places-state';
import {useDoOnceWhen} from '@atb/screens/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {NearbyPlacesScreenTabProps} from './types';
import FullScreenHeader from "@atb/components/screen-header/full-header";
import {useServiceDisruptionSheet} from "@atb/service-disruptions";
import {DeparturesV2} from "@atb/screens/Departures/components/DepartutesV2";
import {DashboardScreenProps} from "@atb/screens/Dashboard/types";

export type AllStopsOverviewParams = {
  location: Location;
};

type RootProps = NearbyPlacesScreenTabProps<'AllStopsOverview'> | DashboardScreenProps<'AllStopsOverviewFromDashboard'>;

export const AllStopsOverview = ({navigation}: RootProps) => {

  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');

  return <DeparturesV2 navigation={navigation} fromLocation={fromLocation}/>
};

