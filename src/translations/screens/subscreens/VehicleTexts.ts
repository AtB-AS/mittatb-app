import {translation as _} from '../../commons';
import {Platform} from 'react-native';

export const VehicleTexts = {
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
  primaryButton: {
    text: (operator: string) => _(`Åpne ${operator}`, `Open ${operator}`),
  },
  pricingPlan: {
    price: (price: number) =>
      price > 0
        ? _(`+ ${price}kr oppstart`, `+ ${price}kr to unlock`)
        : _('Ingen oppstartskostnad', 'Free to unlock'),
  },
  unknownOperator: _('Ukjent operatør', 'Unknown operator'),
};
