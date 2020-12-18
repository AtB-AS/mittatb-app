import {translation as _} from '../commons';

const SectionTexts = {
  locationInput: {
    myPosition: _('Min posisjon'),
    updatingLocation: _('Oppdaterer posisjon'),
    placeholder: _('Søk etter adresse eller sted', 'Search for a place'),
    a11yValue: (currentLocation: string) => _(`${currentLocation} er valgt.`),
  },
  counterInput: {
    decreaseButton: {
      a11yLabel: _('Minsk antall'),
      a11yHint: (text: string, count: number) =>
        _(`Aktivér for å minske antall ${text} til ${count - 1}`),
    },
    increaseButton: {
      a11yLabel: _('Øk antall'),
      a11yHint: (text: string, count: number) =>
        _(`Aktivér for å øke antall ${text} til ${count + 1}`),
    },
  },
  favoriteDeparture: {
    from: _('Fra'),
  },
};
export default SectionTexts;
