import {translation as _} from '../utils';

const SectionTexts = {
  locationInput: {
    myPosition: _('Min posisjon'),
    updatingLocation: _('Oppdater posisjon'),
    placeholder: _('Søk etter adresse eller sted', 'Search for a place'),
    a11yValue: (currentLocation: string) => _(`${currentLocation} er valgt.`),
  },
};
export default SectionTexts;
