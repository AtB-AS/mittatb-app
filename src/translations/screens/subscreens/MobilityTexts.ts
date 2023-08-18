import {translation as _} from '../../commons';
import {Platform} from 'react-native';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import {ParkingVehicleTypes} from '@atb/components/map';

export const MobilityTexts = {
  formFactor: (formFactor: FormFactor) => {
    switch (formFactor) {
      case FormFactor.Scooter:
        return _('Sparkesykkel', 'Electric scooter', 'Elektrisk sparkesykkel');
      case FormFactor.Bicycle:
        return _('Sykkel', 'Bicycle', 'Sykkel');
      case FormFactor.Car:
        return _('Bildeling', 'Car sharing', 'Bildeling');
      default:
        return _('Annet', 'Other', 'Annet');
    }
  },
  unknownOperator: _('Ukjent operatør', 'Unknown operator', 'Ukjent operatør'),
  operatorAppSwitchButton: (operator: string) =>
    _(`Åpne ${operator}`, `Open ${operator}`, `Åpne ${operator}`),
  appMissingAlert: {
    title: (operator: string) =>
      _(`Last ned ${operator}`, `Download ${operator}`, `Last ned ${operator}`),
    text: (operator: string) =>
      _(
        `Det ser ut som du mangler ${operator}-appen`,
        `It seems you don't have the ${operator} app installed`,
        `Det ser ut som du manglar ${operator}-appen`,
      ),
    buttons: {
      cancel: _('Avbryt', 'Cancel', 'Avbryt'),
      openAppStore: (appStore: string) =>
        _(`Åpne ${appStore}`, `Open ${appStore}`, `Åpne ${appStore}`),
    },
  },
  appStore: () =>
    Platform.OS === 'ios'
      ? _('App Store', 'App Store', 'App Store')
      : _('Play Butikk', 'Play Store', 'Play Butikk'),
  appStoreOpenError: {
    text: (appStore: string, operator: string) =>
      _(
        `Vi fikk dessverre ikke til å åpne ${appStore} automatisk. Gå til ${appStore} og søk etter ${operator}-appen`,
        `We could not open ${appStore}. Please go to ${appStore} and search for ${operator}`,
        `Vi fikk dessverre ikkje opna ${appStore} automatisk. Gå til ${appStore} og søk etter ${operator}-appen`,
      ),
    button: _('OK', 'OK', 'OK'),
  },
  onboarding: {
    title: _(
      'Elsparkesykler og bysykler i kartet 🎉',
      'Electrical scooters and city bikes in map 🎉',
      'Elsparkesyklar og bysyklar i kartet 🎉',
    ),
    body: _(
      'Se elsparkesykler og bysykler i Trondheim på ett sted. Skru på tjenesten i kartet.',
      'See electric scooters and city bikes in Trondheim in one app. Enable this feature through the map.',
      'Sjå elsparkesyklar og bysyklar i Trondheim på ett sted. Skru på tenesta i kartet.',
    ),
    button: _('Den er grei!', 'Sounds good!', 'Høres bra ut!'),
    a11yLabel: _(
      'Se elsparkesykler og bysykler i Trondheim på ett sted. Skru på tjenesten i kartet.',
      'See electric scooters and city bikes in Trondheim in one app. Enable this feature through the map.',
      'Sjå elsparkesyklar og bysyklar i Trondheim på ett sted. Skru på tenesta i kartet.',
    ),
  },
  filter: {
    selectAll: _('Alle', 'All', 'Alle'),
  },
};

export const ScooterTexts = {
  seeAppForPrices: (operator: string) =>
    _(
      `Se ${operator}-appen for priser`,
      `See ${operator} app for prices`,
      `Sjå ${operator}-appen for prisar`,
    ),
  pricingPlan: {
    price: (price: number) =>
      price > 0
        ? _(
            `+ ${price} kr for oppstart`,
            `+ ${price} kr to unlock`,
            `+ ${price} kr for å låse opp`,
          )
        : _(
            'Ingen oppstartskostnad',
            'Free to unlock',
            'Ingen oppstartskostnad',
          ),
  },
  loadingFailed: _(
    'Ops! Vi fant ikke denne sparkesykkelen',
    "Ops! We couldn't find this scooter",
    'Ops! Vi fann ikkje denne sparkesykkelen',
  ),
};

export const BicycleTexts = {
  stations: {
    numBikesAvailable: _(
      'Tilgjengelige sykler',
      'Available bikes',
      'Tilgjengelege syklar',
    ),
    numDocksAvailable: _('Ledige plasser', 'Available docks', 'Ledige plassar'),
    unknownDocksAvailable: _('Ukjent antall', 'Unknown', 'Ukjent antal'),
  },
  humanPoweredBike: _('Sykkel', 'Bicycle', 'Sykkel'),
  loadingFailed: _(
    'Ops! Vi fant ikke denne sykkelstasjonen',
    "Ops! We couldn't find this bike station",
    'Ops! Vi fann ikkje denne sykkelstasjonen',
  ),
};

export const CarSharingTexts = {
  stations: {
    carsAvailable: (amount: number) =>
      _(`${amount} ledig`, `${amount} available`, `${amount} ledig`),
    noCarsAvailable: _(
      'Ingen ledige biler',
      'No available cars',
      'Ingen ledige bilar',
    ),
  },
  loadingFailed: _(
    'Ops! Vi fant ikke denne parkeringen',
    "Ops! We couldn't find this car sharing station",
    'Ops! Vi fann ikkje denne parkeringa',
  ),
  propultionType: (type: PropulsionType) => {
    switch (type) {
      case PropulsionType.Electric:
        return _('Elektrisk', 'Electric', 'Elektrisk');
      case PropulsionType.CombustionDiesel:
        return _('Diesel', 'Diesel', 'Diesel');
      case PropulsionType.Combustion:
        return _('Bensin', 'Petrol', 'Bensin');
      case PropulsionType.PlugInHybrid:
        return _('Plug-in hybrid', 'Plug-in hybrid', 'Plug-in hybrid');
      case PropulsionType.HydrogenFuelCell:
        return _('Hydrogen', 'Hydrogen', 'Hydrogen');
      case PropulsionType.Hybrid:
        return _('Hybrid', 'Hybrid', 'Hybrid');
      default:
        return _(
          'Ukjent drivstofftype',
          'Unknown propultion type',
          'Ukjent drivstofftype',
        );
    }
  },
};

export const ParkAndRideTexts = {
  title: _('Innfartsparkering', "Park'n Ride", 'Innfartsparkering'),
  parkingFor: (type: ParkingVehicleTypes) => {
    switch (type) {
      case 'pedalCycle':
        return _('Sykkelparkering', 'Bike parking', 'Sykkelparkering');
      case 'car':
      default:
        return _('Bilparkering', 'Car parking', 'Bilparkering');
    }
  },
  disclaimer: _(
    'Betaling eller andre vilkår kan gjelde på denne innfartsparkeringen',
    'Payment or other terms and conditions may apply to this parking',
    '',
  ),
  capacity: _('Plasser totalt', 'Parking spaces', 'Plassar totalt'),
  unknownCapacity: _(
    'Ukjent antall plasser',
    'Unknown number of spaces',
    'Ukjend antal plassar',
  ),
};
