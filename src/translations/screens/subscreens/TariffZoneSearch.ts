import {translation as _} from '../../commons';
import {TariffZone} from '../../../api/tariffZones';
import {Location} from '../../../favorites/types';

const TariffZoneSearchTexts = {
  searchField: {
    placeholder: _('Søk etter holdeplass', 'Search for a venue'),
  },
  header: {
    title: _('Søk', 'Search'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  zones: {
    heading: _('Soner'),
    item: {
      a11yLabelPrefix: (zone: TariffZone) => _(`Sone ${zone.name.value}`),
      a11yHint: _('Aktivér for å bruke dette resultatet.'),
    },
  },
  results: {
    heading: _('Søkeresultater'),
    item: {
      a11yLabelPrefix: (location: Location, zone: TariffZone) =>
        _(`Stoppested ${location.name} i sone ${zone.name.value}`),
      a11yHint: _('Aktivér for å bruke dette resultatet.'),
      zoneLabel: (zone: TariffZone) => _(`Sone ${zone.name.value}`),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
    ),
    defaultError: _('Oops - vi feila med søket. Supert om du prøver igjen 🤞'),
    emptyResult: _('Fant ingen søkeresultat'),
  },
};
export default TariffZoneSearchTexts;
