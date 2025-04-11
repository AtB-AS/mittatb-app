import React from 'react';
import {Travelcard as TravelCardDark} from '@atb/assets/svg/color/illustrations/token/travelcard/dark/';
import {Travelcard as TravelCardLight} from '@atb/assets/svg/color/illustrations/token/travelcard/light/';
import {Phone as PhoneDark} from '@atb/assets/svg/color/illustrations/token/mobile/dark/';
import {Phone as PhoneLight} from '@atb/assets/svg/color/illustrations/token/mobile/light/';
import {
  Map as MapLight,
  NoFavouriteDeparture as NoFavouriteDepartureLight,
  OnBehalfOf as OnBehalfOfLight,
  FlexibleTransport as FlexibleTransportLight,
  CrashSmall as CrashSmallLight,
  TicketTilted as TicketTiltedLight,
  Ticket as TicketLight,
  HoldingHands as HoldingHandsLight,
  PushNotification as PushNotificationLight,
  MyLocation as MyLocationLight,
  Beacons as BeaconsLight,
} from '@atb/assets/svg/color/images/light';
import {
  Map as MapDark,
  NoFavouriteDeparture as NoFavouriteDepartureDark,
  OnBehalfOf as OnBehalfOfDark,
  FlexibleTransport as FlexibleTransportDark,
  CrashSmall as CrashSmallDark,
  TicketTilted as TicketTiltedDark,
  Ticket as TicketDark,
  HoldingHands as HoldingHandsDark,
  PushNotification as PushNotificationDark,
  MyLocation as MyLocationDark,
  Beacons as BeaconsDark,
} from '@atb/assets/svg/color/images/dark';
import {
  BundlingCarSharing as BundlingCarSharingDark,
  CityBike as CityBikeDark,
  ParkAndRide as ParkAndRideDark,
} from '@atb/assets/svg/color/images/mobility/dark';
import {
  BundlingCarSharing as BundlingCarSharingLight,
  CityBike as CityBikeLight,
  ParkAndRide as ParkAndRideLight,
} from '@atb/assets/svg/color/images/mobility/light';
import {useThemeContext} from '@atb/theme/ThemeContext';
import {SvgProps} from 'react-native-svg';

export const ThemedTokenTravelCard = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const TravelCard = themeName === 'dark' ? TravelCardDark : TravelCardLight;
  return <TravelCard {...props} />;
};

export const ThemedTokenPhone = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const Phone = themeName === 'dark' ? PhoneDark : PhoneLight;
  return <Phone {...props} />;
};

export const ThemedMapImage = () => {
  const {themeName} = useThemeContext();
  const Map = themeName === 'dark' ? MapDark : MapLight;
  return <Map />;
};

export const ThemedNoFavouriteDepartureImage = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const NoFavouriteDeparture =
    themeName === 'dark' ? NoFavouriteDepartureDark : NoFavouriteDepartureLight;
  return <NoFavouriteDeparture {...props} />;
};

export const ThemedOnBehalfOf = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const OnBehalfOf = themeName === 'dark' ? OnBehalfOfDark : OnBehalfOfLight;
  return <OnBehalfOf {...props} />;
};

export const ThemedCityBike = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const CityBike = themeName === 'dark' ? CityBikeDark : CityBikeLight;
  return <CityBike {...props} />;
};

export const ThemedParkAndRide = () => {
  const {themeName} = useThemeContext();
  const ParkAndRide = themeName === 'dark' ? ParkAndRideDark : ParkAndRideLight;
  return <ParkAndRide />;
};

export const ThemedBundlingCarSharing = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const BundlingCarSharing =
    themeName === 'dark' ? BundlingCarSharingDark : BundlingCarSharingLight;
  return <BundlingCarSharing {...props} />;
};

export const ThemedFlexibleTransport = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const FlexibleTransport =
    themeName === 'dark' ? FlexibleTransportDark : FlexibleTransportLight;

  return <FlexibleTransport {...props} />;
};

export const ThemedCrashSmall = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const CrashSmall = themeName === 'dark' ? CrashSmallDark : CrashSmallLight;

  return <CrashSmall {...props} />;
};

export const ThemedTicketTilted = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const TicketTilted =
    themeName === 'dark' ? TicketTiltedDark : TicketTiltedLight;

  return <TicketTilted {...props} />;
};

export const ThemedTicket = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const Ticket = themeName === 'dark' ? TicketDark : TicketLight;

  return <Ticket {...props} />;
};

export const ThemedHoldingHands = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const HoldingHands =
    themeName === 'dark' ? HoldingHandsDark : HoldingHandsLight;

  return <HoldingHands {...props} />;
};

export const ThemedPushNotification = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const PushNotification =
    themeName === 'dark' ? PushNotificationDark : PushNotificationLight;

  return <PushNotification {...props} />;
};

export const ThemedMyLocation = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const MyLocation = themeName === 'dark' ? MyLocationDark : MyLocationLight;

  return <MyLocation {...props} />;
};

export const ThemedBeacons = ({...props}: SvgProps) => {
  const {themeName} = useThemeContext();
  const Beacons = themeName === 'dark' ? BeaconsDark : BeaconsLight;

  return <Beacons {...props} />;
};
