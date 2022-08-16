import {translation as _} from '../../commons';
const JourneyDatePickerTexts = {
  header: {
    title: _('Velg dato og tidspunkt', 'Select date and time'),
    leftButton: {
      a11yLabel: _('Gå tilbake', 'Go back'),
    },
  },
  options: {
    now: _('Nå', 'Now'),
    departure: _('Avgang', 'Departure'),
    arrival: _('Ankomst', 'Arrival'),
  },
  searchButton: {
    text: _('Søk etter reiser', 'Search'),
  },
  dateInput: {
    departureNow: (time: string) =>
      _(`Avreise nå (${time})`, `Departing now (${time})`),
    departure: (time: string) => _(`Avreise ${time}`, `Departure ${time}`),
    arrival: (time: string) => _(`Ankomst ${time}`, `Arrival ${time}`),
    a11yHint: _(
      'Aktivér for å endre reisetidspunkt',
      'Activate to change time of travel',
    ),
  },
};
export default JourneyDatePickerTexts;
