import {translation as _} from '../../commons';
const JourneyDatePickerTexts = {
  header: {
    title: _(
      'Velg dato og tidspunkt',
      'Select date and time',
      'Velg dato og tidspunkt',
    ),
    leftButton: {
      a11yLabel: _('Gå tilbake', 'Go back', 'Gå tilbake'),
    },
  },
  options: {
    now: _('Nå', 'Now', 'No'),
    departure: _('Avgang', 'Departure', 'Avgang'),
    arrival: _('Ankomst', 'Arrival', 'Framkomst'),
  },
  searchButton: {
    text: _('Søk etter reiser', 'Search', 'Søk etter reiser'),
  },
  dateInput: {
    departureNow: (time: string) =>
      _(
        `Avreise nå (${time})`,
        `Departing now (${time})`,
        `Avreise no (${time})`,
      ),
    departure: (time: string) =>
      _(`Avreise ${time}`, `Departure ${time}`, `Avreise ${time}`),
    arrival: (time: string) =>
      _(`Ankomst ${time}`, `Arrival ${time}`, `Framkomst ${time}`),
    a11yHint: _(
      'Aktivér for å endre reisetidspunkt',
      'Activate to change time of travel',
      'Aktiver for å endre reisetidspunktet',
    ),
  },
};
export default JourneyDatePickerTexts;
