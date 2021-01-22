import {translation as _} from '../commons';

const SectionTexts = {
  locationInput: {
    myPosition: _('Min posisjon', 'My current position'),
    updatingLocation: _('Oppdaterer posisjon', 'Updating current location'),
    placeholder: _(
      'Søk etter adresse eller sted',
      'Search for an adress or location',
    ),
    a11yValue: (currentLocation: string) => _(`${currentLocation} er valgt.`),
  },
  counterInput: {
    decreaseButton: {
      a11yLabel: _('Reduser antall', 'Reduce quantity'),
      a11yHint: (text: string, count: number) =>
        _(`Aktivér for å redusere antall ${text} til ${count - 1}`, `Activate to reduce quantity ${text} to ${count - 1}`),
    },
    increaseButton: {
      a11yLabel: _('Øk antall', 'Increase quantity'),
      a11yHint: (text: string, count: number) =>
        _(`Aktivér for å øke antall ${text} til ${count + 1}`, `Activate to increase quantity ${text} to ${count + 1}`),
    },
  },
  favoriteDeparture: {
    from: _('Fra', 'From'),
  },
};
export default SectionTexts;
