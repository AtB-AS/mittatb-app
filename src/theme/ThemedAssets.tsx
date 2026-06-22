import React from 'react';
import {Travelcard as TravelCardDark} from '@atb/assets/svg/color/illustrations/token/travelcard/dark/';
import {Travelcard as TravelCardLight} from '@atb/assets/svg/color/illustrations/token/travelcard/light/';
import {Phone as PhoneDark} from '@atb/assets/svg/color/illustrations/token/mobile/dark/';
import {Phone as PhoneLight} from '@atb/assets/svg/color/illustrations/token/mobile/light/';
import {Contact as ContactIllustrationDark} from '@atb/assets/svg/color/illustrations/contact/dark/';
import {Contact as ContactIllustrationLight} from '@atb/assets/svg/color/illustrations/contact/light/';
import {
  Map as MapLight,
  NoFavouriteDeparture as NoFavouriteDepartureLight,
  OnBehalfOf as OnBehalfOfLight,
  FlexibleTransport as FlexibleTransportLight,
  BestillMaxi as BestillMaxiLight,
  CrashSmall as CrashSmallLight,
  TicketTilted as TicketTiltedLight,
  Ticket as TicketLight,
  HoldingHands as HoldingHandsLight,
  PushNotification as PushNotificationLight,
  MyLocation as MyLocationLight,
  Beacons as BeaconsLight,
  PaymentCard as PaymentCardLight,
  Contact as ContactLight,
  ProfileCardLoggedIn as ProfileCardLoggedInLight,
  ProfileCardLoggedOut as ProfileCardLoggedOutLight,
} from '@atb/assets/svg/color/images/light';
import {
  Map as MapDark,
  NoFavouriteDeparture as NoFavouriteDepartureDark,
  OnBehalfOf as OnBehalfOfDark,
  FlexibleTransport as FlexibleTransportDark,
  BestillMaxi as BestillMaxiDark,
  CrashSmall as CrashSmallDark,
  TicketTilted as TicketTiltedDark,
  Ticket as TicketDark,
  HoldingHands as HoldingHandsDark,
  PushNotification as PushNotificationDark,
  MyLocation as MyLocationDark,
  Beacons as BeaconsDark,
  PaymentCard as PaymentCardDark,
  Contact as ContactDark,
  ProfileCardLoggedIn as ProfileCardLoggedInDark,
  ProfileCardLoggedOut as ProfileCardLoggedOutDark,
} from '@atb/assets/svg/color/images/dark';
import {
  BundlingCarSharing as BundlingCarSharingDark,
  BundlingCarSharingActive as BundlingCarSharingActiveDark,
  BundlingCityBikeActive as BundlingCityBikeActiveDark,
  CityBike as CityBikeDark,
  CityBikeRide as CityBikeRideDark,
  CityBikeStation as CityBikeStationDark,
  CityBikeStationPerson as CityBikeStationPersonDark,
  ElectricCityBike as ElectricCityBikeDark,
  ElectricCityBikeRide as ElectricCityBikeRideDark,
  ElectricCityBikeStation as ElectricCityBikeStationDark,
  ElectricCityBikeStationPerson as ElectricCityBikeStationPersonDark,
  StartCityBike as StartCityBikeDark,
  ParkAndRide as ParkAndRideDark,
  BabyOnScooter as BabyOnScooterDark,
  Scooter as ScooterDark,
} from '@atb/assets/svg/color/images/mobility/dark';
import {
  BundlingCarSharing as BundlingCarSharingLight,
  BundlingCarSharingActive as BundlingCarSharingActiveLight,
  BundlingCityBikeActive as BundlingCityBikeActiveLight,
  CityBike as CityBikeLight,
  CityBikeRide as CityBikeRideLight,
  CityBikeStation as CityBikeStationLight,
  CityBikeStationPerson as CityBikeStationPersonLight,
  ElectricCityBike as ElectricCityBikeLight,
  ElectricCityBikeRide as ElectricCityBikeRideLight,
  ElectricCityBikeStation as ElectricCityBikeStationLight,
  ElectricCityBikeStationPerson as ElectricCityBikeStationPersonLight,
  StartCityBike as StartCityBikeLight,
  ParkAndRide as ParkAndRideLight,
  BabyOnScooter as BabyOnScooterLight,
  Scooter as ScooterLight,
} from '@atb/assets/svg/color/images/mobility/light';
import {
  BonusBag as BonusBagLight,
  BonusBagCarry as BonusBagCarryLight,
  BonusBagHug as BonusBagHugLight,
  BonusMap as BonusMapLight,
  BonusStar as BonusStarLight,
  BonusTransaction as BonusTransactionLight,
  BonusTrashCan as BonusTrashCanLight,
} from '@atb/assets/svg/color/images/bonus/light';
import {
  BonusBag as BonusBagDark,
  BonusBagCarry as BonusBagCarryDark,
  BonusBagHug as BonusBagHugDark,
  BonusMap as BonusMapDark,
  BonusStar as BonusStarDark,
  BonusTransaction as BonusTransactionDark,
  BonusTrashCan as BonusTrashCanDark,
} from '@atb/assets/svg/color/images/bonus/dark';
import {
  CarFront as CarFrontLight,
  CarRegister as CarRegisterLight,
  CarValidTicket as CarValidTicketLight,
} from '@atb/assets/svg/color/images/smart-park-and-ride/light';
import {
  CarFront as CarFrontDark,
  CarRegister as CarRegisterDark,
  CarValidTicket as CarValidTicketDark,
} from '@atb/assets/svg/color/images/smart-park-and-ride/dark';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';
import {useThemeContext} from '@atb/theme/ThemeContext';
import {SvgProps} from 'react-native-svg';

const getThemedAsset = (
  LightAsset: React.FC<SvgProps>,
  DarkAsset: React.FC<SvgProps>,
) => {
  return (props: SvgProps) => {
    const {themeName} = useThemeContext();
    const ThemedAsset = themeName === 'dark' ? DarkAsset : LightAsset;
    return <ThemedAsset {...props} />;
  };
};

export const ThemedTokenTravelCard = getThemedAsset(
  TravelCardLight,
  TravelCardDark,
);
export const ThemedTokenPhone = getThemedAsset(PhoneLight, PhoneDark);
export const ThemedMapImage = getThemedAsset(MapLight, MapDark);
export const ThemedNoFavouriteDepartureImage = getThemedAsset(
  NoFavouriteDepartureLight,
  NoFavouriteDepartureDark,
);
export const ThemedOnBehalfOf = getThemedAsset(OnBehalfOfLight, OnBehalfOfDark);
export const ThemedCityBike = getThemedAsset(CityBikeLight, CityBikeDark);
export const ThemedBabyOnScooter = getThemedAsset(
  BabyOnScooterLight,
  BabyOnScooterDark,
);
export const ThemedScooter = getThemedAsset(ScooterLight, ScooterDark);
export const ThemedParkAndRide = getThemedAsset(
  ParkAndRideLight,
  ParkAndRideDark,
);
export const ThemedBundlingCarSharing = getThemedAsset(
  BundlingCarSharingLight,
  BundlingCarSharingDark,
);
export const ThemedBundlingCarSharingActive = getThemedAsset(
  BundlingCarSharingActiveLight,
  BundlingCarSharingActiveDark,
);
export const ThemedBundlingCityBikeActive = getThemedAsset(
  BundlingCityBikeActiveLight,
  BundlingCityBikeActiveDark,
);
export const ThemedElectricCityBike = getThemedAsset(
  ElectricCityBikeLight,
  ElectricCityBikeDark,
);
export const ThemedCityBikeRide = getThemedAsset(
  CityBikeRideLight,
  CityBikeRideDark,
);
export const ThemedElectricCityBikeRide = getThemedAsset(
  ElectricCityBikeRideLight,
  ElectricCityBikeRideDark,
);
export const ThemedCityBikeStation = getThemedAsset(
  CityBikeStationLight,
  CityBikeStationDark,
);
export const ThemedElectricCityBikeStation = getThemedAsset(
  ElectricCityBikeStationLight,
  ElectricCityBikeStationDark,
);
export const ThemedCityBikeStationPerson = getThemedAsset(
  CityBikeStationPersonLight,
  CityBikeStationPersonDark,
);
export const ThemedElectricCityBikeStationPerson = getThemedAsset(
  ElectricCityBikeStationPersonLight,
  ElectricCityBikeStationPersonDark,
);
export const ThemedStartCityBike = getThemedAsset(
  StartCityBikeLight,
  StartCityBikeDark,
);
export const ThemedFlexibleTransport = getThemedAsset(
  FlexibleTransportLight,
  FlexibleTransportDark,
);
export const ThemedBestillMaxi = getThemedAsset(
  BestillMaxiLight,
  BestillMaxiDark,
);
export const ThemedCrashSmall = getThemedAsset(CrashSmallLight, CrashSmallDark);
export const ThemedTicketTilted = getThemedAsset(
  TicketTiltedLight,
  TicketTiltedDark,
);
export const ThemedTicket = getThemedAsset(TicketLight, TicketDark);
export const ThemedHoldingHands = getThemedAsset(
  HoldingHandsLight,
  HoldingHandsDark,
);
export const ThemedPushNotification = getThemedAsset(
  PushNotificationLight,
  PushNotificationDark,
);
export const ThemedMyLocation = getThemedAsset(MyLocationLight, MyLocationDark);
export const ThemedPaymentCard = getThemedAsset(
  PaymentCardLight,
  PaymentCardDark,
);
export const ThemedBeacons = getThemedAsset(BeaconsLight, BeaconsDark);
export const ThemedContact = getThemedAsset(ContactLight, ContactDark);
export const ThemedBonusBag = getThemedAsset(BonusBagLight, BonusBagDark);
export const ThemedBonusBagCarry = getThemedAsset(
  BonusBagCarryLight,
  BonusBagCarryDark,
);
export const ThemedBonusBagHug = getThemedAsset(
  BonusBagHugLight,
  BonusBagHugDark,
);
export const ThemedBonusMap = getThemedAsset(BonusMapLight, BonusMapDark);
export const ThemedBonusStar = getThemedAsset(BonusStarLight, BonusStarDark);
export const ThemedBonusTransaction = getThemedAsset(
  BonusTransactionLight,
  BonusTransactionDark,
);
export const ThemedBonusTrashCan = getThemedAsset(
  BonusTrashCanLight,
  BonusTrashCanDark,
);
export const ThemedContactIllustration = getThemedAsset(
  ContactIllustrationLight,
  ContactIllustrationDark,
);
export const ThemedProfileCardLoggedIn = getThemedAsset(
  ProfileCardLoggedInLight,
  ProfileCardLoggedInDark,
);
export const ThemedProfileCardLoggedOut = getThemedAsset(
  ProfileCardLoggedOutLight,
  ProfileCardLoggedOutDark,
);
export const ThemedCarFront = getThemedAsset(CarFrontLight, CarFrontDark);
export const ThemedCarRegister = getThemedAsset(
  CarRegisterLight,
  CarRegisterDark,
);
export const ThemedCarValidTicket = getThemedAsset(
  CarValidTicketLight,
  CarValidTicketDark,
);
export const ThemedParkingIcon = getThemedAsset(ParkingLight, ParkingDark);
