import {translation as _} from '../commons';

const DateInput = {
  dateType: {
    arrival: _('Ankomst'),
    departure: _('Avreise'),
    now: _('Nå', 'Now'),
  },
  value: {
    departureNow: (time: string) =>
      _(`Avreise nå (${time})`, `Departure now (${time})`),
    departure: (time: string) => _(`Avreise ${time}`),
    arrival: (time: string) => _(`Ankomst ${time}`),
  },
};
export default DateInput;
