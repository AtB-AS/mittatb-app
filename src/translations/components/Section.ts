import {translation as _} from '../commons';

const SectionTexts = {
  locationInput: {
    myPosition: _('Min posisjon'),
    updatingLocation: _('Oppdaterer posisjon'),
    placeholder: _('Søk etter adresse eller sted', 'Search for a place'),
    a11yValue: (currentLocation: string) => _(`${currentLocation} er valgt.`),
  },
  favoriteDeparture: {
    from: _('Fra'),
  },
};
export default SectionTexts;
