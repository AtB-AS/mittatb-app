import {translation as _} from '../../commons';
import {Platform} from 'react-native';

export const MobilityTexts = {
  scooter: _('Sparkesykkel', 'Electric scooter'),
  bicycle: _('Sykkel', 'Bicycle'),
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
};

export const ScooterTexts = {
  seeAppForPrices: (operator: string) =>
    _(`Se ${operator}-appen for priser`, `See ${operator} app for prices`),
  pricingPlan: {
    price: (price: number) =>
      price > 0
        ? _(`+ ${price} kr for oppstart`, `+ ${price} kr to unlock`)
        : _('Ingen oppstartskostnad', 'Free to unlock'),
  },
  onboarding: {
    title: _('El-sparkesykler i kartet 🎉', 'Electrical scooters in map 🎉'),
    body: _(
      'Nå kan du se alle sparkesyklene i byen på ett sted! Skru på tjenesten i kartet',
      'You can now see all electric scooters in town in one app! Enable this feature through the map.',
    ),
    button: _('Den er grei!', 'Sounds good!'),
    a11yLabel: _(
      'Nå kan du se alle el-sparkesyklene i byen på ett sted! Skru på tjenesten i kartet',
      'You can now see all electric scooters in town in one app! Enable this feature through the map.',
    ),
  },
};

export const BicycleTexts = {
  stations: {
    numBikesAvailable: _('Tilgjengelige sykler', 'Available bikes'),
    numDocksAvailable: _('Ledige plasser', 'Available docks'),
    unknownDocksAvailable: _('Ukjent antall', 'Unknown'),
  },
};
