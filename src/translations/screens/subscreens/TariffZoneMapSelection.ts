import {translation as _} from '../../commons';

const TariffZoneMapSelectionTexts = {
  searchField: {
    placeholder: _('Søk etter holdeplass', 'Search for a stop place'),
  },
  header: {
    title: _('Velg sone', 'Select zone'),
    leftButton: {
      a11yLabel: _('Gå tilbake', 'Go back'),
    },
  },
  button: {
    label: {
      selected: (zoneName: string) => _(`Sone ${zoneName}`),
      noneSelected: _(`Ingen sone valgt`, 'No zone selected'),
    },
    a11yHint: _(`Aktivér for å velge denne sonen., 'Activate to select this zone`),
  },
  map: {
    featureLabelPrefix: _('Sone ', 'Zone '),
  },
};
export default TariffZoneMapSelectionTexts;
