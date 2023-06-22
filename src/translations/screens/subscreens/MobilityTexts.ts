import {translation as _} from '../../commons';
import {Platform} from 'react-native';
import {PropulsionType} from '@atb/api/types/generated/mobility-types_v2';

export const MobilityTexts = {
  scooter: _('Sparkesykkel', 'Electric scooter'),
  bicycle: _('Sykkel', 'Bicycle'),
  car: _('Bildeling', 'Car sharing'),
  unknownOperator: _('Ukjent operatør', 'Unknown operator'),
  operatorAppSwitchButton: (operator: string) =>
    _(`Åpne ${operator}`, `Open ${operator}`),
  appMissingAlert: {
    title: (operator: string) =>
      _(`Last ned ${operator}`, `Download ${operator}`),
    text: (operator: string) =>
      _(
        `Det ser ut som du mangler ${operator}-appen`,
        `It seems you don't have the ${operator} app installed`,
      ),
    buttons: {
      cancel: _('Avbryt', 'Cancel'),
      openAppStore: (appStore: string) =>
        _(`Åpne ${appStore}`, `Open ${appStore}`),
    },
  },
  appStore: () =>
    Platform.OS === 'ios'
      ? _('App Store', 'App Store')
      : _('Play Store', 'Play Store'),
  appStoreOpenError: {
    text: (appStore: string, operator: string) =>
      _(
        `Vi fikk dessverre ikke til å åpne ${appStore} automatisk. Gå til ${appStore} og søk etter ${operator}-appen`,
        `We could not open ${appStore}. Please go to ${appStore} and search for ${operator}`,
      ),
    button: _('OK', 'OK'),
  },
  onboarding: {
    title: _(
      'Elsparkesykler og bysykler i kartet 🎉',
      'Electrical scooters and city bikes in map 🎉',
    ),
    body: _(
      'Se elsparkesykler og bysykler i Trondheim på ett sted. Skru på tjenesten i kartet.',
      'See electric scooters and city bikes in Trondheim in one app. Enable this feature through the map.',
    ),
    button: _('Den er grei!', 'Sounds good!'),
    a11yLabel: _(
      'Se elsparkesykler og bysykler i Trondheim på ett sted. Skru på tjenesten i kartet.',
      'See electric scooters and city bikes in Trondheim in one app. Enable this feature through the map.',
    ),
  },
  filter: {
    selectAll: _('Alle', 'All'),
  },
};

export const ScooterTexts = {
  seeAppForPrices: (operator: string) =>
    _(`Se ${operator}-appen for priser`, `See ${operator} app for prices`),
  pricingPlan: {
    price: (price: number) =>
      price > 0
        ? _(`+ ${price} kr for oppstart`, `+ ${price} kr to unlock`)
        : _('Gratis oppstart', 'Free to unlock'),
  },
  loadingFailed: _(
    'Ops! Vi fant ikke denne sparkesykkelen',
    "Ops! We couldn't find this scooter",
  ),
};

export const BicycleTexts = {
  stations: {
    numBikesAvailable: _('Tilgjengelige sykler', 'Available bikes'),
    numDocksAvailable: _('Ledige plasser', 'Available docks'),
    unknownDocksAvailable: _('Ukjent antall', 'Unknown'),
  },
  loadingFailed: _(
    'Ops! Vi fant ikke denne sykkelstasjonen',
    "Ops! We couldn't find this bike station",
  ),
};

export const CarSharingTexts = {
  stations: {
    carsAvailable: (amount: number) =>
      _(`${amount} ledig`, `${amount} available`),
    noCarsAvailable: _('Ingen ledige biler', 'No available cars'),
  },
  loadingFailed: _(
    'Ops! Vi fant ikke denne parkeringen',
    "Ops! We couldn't find this car sharing station",
  ),
  propultionType: (type: PropulsionType) => {
    switch (type) {
      case PropulsionType.Electric:
        return _('Elektrisk', 'Electric');
      case PropulsionType.CombustionDiesel:
        return _('Diesel', 'Diesel');
      case PropulsionType.Combustion:
        return _('Bensin', 'Petrol');
      case PropulsionType.PlugInHybrid:
        return _('Plug-in hybrid', 'Plug-in hybrid');
      case PropulsionType.HydrogenFuelCell:
        return _('Hydrogen', 'Hydrogen');
      case PropulsionType.Hybrid:
        return _('Hybrid', 'Hybrid');
      default:
        return _('Ukjent drivstofftype', 'Unknown propultion type');
    }
  },
};
