import React from 'react';
import {Travelcard as DarkTravelCard} from '@atb/assets/svg/color/illustrations/token/travelcard/dark/';
import {Travelcard as LightTravelCard} from '@atb/assets/svg/color/illustrations/token/travelcard/light/';
import {Phone as DarkPhone} from '@atb/assets/svg/color/illustrations/token/mobile/dark/';
import {Phone as LightPhone} from '@atb/assets/svg/color/illustrations/token/mobile/light/';
import {useTheme} from '@atb/theme/ThemeContext';

export const ThemedTokenTravelCard = () => {
  const {themeName} = useTheme();
  const TravelCard = themeName === 'dark' ? DarkTravelCard : LightTravelCard;
  return <TravelCard />;
};

export const ThemedTokenPhone = () => {
  const {themeName} = useTheme();
  const Phone = themeName === 'dark' ? DarkPhone : LightPhone;
  return <Phone />;
};
