import React from 'react';
import {Travelcard as DarkTravelCard} from '@atb/assets/svg/color/illustrations/token/travelcard/dark/';
import {Travelcard as LightTravelCard} from '@atb/assets/svg/color/illustrations/token/travelcard/light/';
import {Phone as DarkPhone} from '@atb/assets/svg/color/illustrations/token/mobile/dark/';
import {Phone as LightPhone} from '@atb/assets/svg/color/illustrations/token/mobile/light/';
import {Map as LightMap} from '@atb/assets/svg/color/images/light';
import {Map as DarkMap} from '@atb/assets/svg/color/images/dark';
import {NoFavouriteDeparture as LightNoFavouriteDeparture} from '@atb/assets/svg/color/images/light';
import {NoFavouriteDeparture as DarkNoFavouriteDeparture} from '@atb/assets/svg/color/images/dark';
import {OnBehalfOf as LightOnBehalfOf} from '@atb/assets/svg/color/images/light';
import {OnBehalfOf as DarkOnBehalfOf} from '@atb/assets/svg/color/images/dark';
import {Scooter as ScooterLight} from '@atb/assets/svg/color/images/mobility/light';
import {Scooter as ScooterDark} from '@atb/assets/svg/color/images/mobility/dark';
import {CityBike as CityBikeLight} from '@atb/assets/svg/color/images/mobility/light';
import {CityBike as CityBikeDark} from '@atb/assets/svg/color/images/mobility/dark';
import {ParkAndRide as ParkAndRideLight} from '@atb/assets/svg/color/images/mobility/light';
import {ParkAndRide as ParkAndRideDark} from '@atb/assets/svg/color/images/mobility/dark';
import {useTheme} from '@atb/theme/ThemeContext';
import {SvgProps} from 'react-native-svg';

export const ThemedTokenTravelCard = ({...props}: SvgProps) => {
  const {themeName} = useTheme();
  const TravelCard = themeName === 'dark' ? DarkTravelCard : LightTravelCard;
  return <TravelCard {...props} />;
};

export const ThemedTokenPhone = ({...props}: SvgProps) => {
  const {themeName} = useTheme();
  const Phone = themeName === 'dark' ? DarkPhone : LightPhone;
  return <Phone {...props} />;
};

export const ThemedMapImage = () => {
  const {themeName} = useTheme();
  const Map = themeName === 'dark' ? DarkMap : LightMap;
  return <Map />;
};

export const ThemedNoFavouriteDepartureImage = () => {
  const {themeName} = useTheme();
  const NoFavouriteDeparture =
    themeName === 'dark' ? DarkNoFavouriteDeparture : LightNoFavouriteDeparture;
  return <NoFavouriteDeparture />;
};

export const ThemedOnBehalfOf = ({...props}: SvgProps) => {
  const {themeName} = useTheme();
  const OnBehalfOf = themeName === 'dark' ? DarkOnBehalfOf : LightOnBehalfOf;
  return <OnBehalfOf {...props} />;
};

export const ThemedScooter = () => {
  const {themeName} = useTheme();
  const Scooter = themeName === 'dark' ? ScooterDark : ScooterLight;
  return <Scooter />;
};

export const ThemedCityBike = () => {
  const {themeName} = useTheme();
  const CityBike = themeName === 'dark' ? CityBikeDark : CityBikeLight;
  return <CityBike />;
};

export const ThemedParkAndRide = () => {
  const {themeName} = useTheme();
  const ParkAndRide = themeName === 'dark' ? ParkAndRideDark : ParkAndRideLight;
  return <ParkAndRide />;
};
