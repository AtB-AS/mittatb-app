import {translation as _} from '../../commons';

const ScooterTexts = {
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
export default ScooterTexts;
