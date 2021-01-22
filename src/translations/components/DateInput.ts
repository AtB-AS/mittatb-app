import {translation as _} from '../commons';

const DateInput = {
  dateType: {
    arrival: _('Ankomst', 'Arrival'),
    departure: _('Avreise', 'Departure'),
    now: _('Nå', 'Now'),
  },
  value: {
    departureNow: (time: string) =>
    _(`Avreise nå (${time})`, `Departing now (${time})`),
    departure: (time: string) => _(`Avreise ${time}`, `Departure ${time}`),
    arrival: (time: string) => _(`Ankomst ${time}`, `Arrival ${time}`),
  },
};
export default DateInput;
