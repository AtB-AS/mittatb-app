import {translation as _} from '../../commons';

const TariffZoneMapSelectionTexts = {
  searchField: {
    placeholder: _('Søk etter holdeplass', 'Search for a venue'),
  },
  header: {
    title: _('Velg sone'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  button: {
    label: {
      selected: (zoneName: string) => _(`Sone ${zoneName}`),
      noneSelected: _(`Ingen sone valgt`),
    },
    a11yHint: _(`Aktivér for å velge denne sonen.`),
  },
  map: {
    featureLabelPrefix: _('Sone ', 'Zone '),
  },
};
export default TariffZoneMapSelectionTexts;
