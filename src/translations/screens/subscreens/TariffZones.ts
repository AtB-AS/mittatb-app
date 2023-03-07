import {translation as _} from '../../commons';

const TariffZonesTexts = {
  header: {
    title: {
      singleZone: _('Velg sone', 'Select zone'),
      multipleZone: _('Velg soner', 'Select zones'),
    },
  },
  zoneSummary: {
    a11yLabelPrefix: _(`Sonevalget er`, `The zone selection is`),
    text: {
      singleZone: (zoneName: string) =>
        _(`Reise i 1 sone (${zoneName})`, `Travel in 1 zone (${zoneName})`),
      multipleZone: (zoneNameFrom: string, zoneNameTo: string) =>
        _(
          `Reise mellom sone ${zoneNameFrom} og sone ${zoneNameTo}`,
          `Travel between zone ${zoneNameFrom} and zone ${zoneNameTo}`,
        ),
    },
  },
  zoneTitle: _(`Reisesone(r)`, `Travel zone(s)`),
  location: {
    singleZone: {
      label: _('Reise i ', 'Travel in '),
    },
    departurePicker: {
      value: {
        noVenue: (zoneName: string) =>
          _(`Sone ${zoneName}`, `Zone ${zoneName}`),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Sone ${zoneName} (${venueName})`,
            `Zone ${zoneName} (${venueName})`,
          ),
      },
      label: _('Fra', 'From'),
      a11yLabel: {
        noVenue: (zoneName: string) =>
          _(
            `Valgt avreisesone er ${zoneName}`,
            `Selected zone of departure is ${zoneName}`,
          ),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Valgt avreisesone er ${zoneName} basert på stoppested ${venueName}`,
            'Selected zone of departure is ${zoneName} based on stop place ${venueName}',
          ),
      },
      a11yHint: _(
        'Aktivér for å søke etter avreisesone',
        'Activate to search zone of departure',
      ),
      placeholder: _('Søk etter avreisesone', 'Search zone of departure'),
    },
    destinationPicker: {
      value: {
        noVenue: (zoneName: string) =>
          _(`Sone ${zoneName}`, `Zone ${zoneName}`),
        noVenueSameZone: (zoneName: string) =>
          _(`Samme sone (${zoneName})`, `Same zone (${zoneName})`),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Sone ${zoneName} (${venueName})`,
            `Zone ${zoneName} (${venueName})`,
          ),
        withVenueSameZone: (venueName: string) =>
          _(`Samme sone (${venueName})`, `Same zone (${venueName})`),
      },
      label: _('Til', 'To'),
      a11yLabel: {
        noVenue: (zoneName: string) =>
          _(
            `Valgt ankomstsone er ${zoneName}`,
            `Selected zone of arrival is ${zoneName}`,
          ),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Valgt ankomstsone er ${zoneName} basert på stoppested ${venueName}`,
            'Selected zone of arrival is ${zoneName} based on stop place ${venueName}',
          ),
      },
      a11yHint: _(
        'Aktivér for å søke etter ankomstsone',
        'Activate to search for zone of arrival',
      ),
      placeholder: _('Søk etter ankomstsone', 'Search for zone of arrival'),
    },
  },
  saveButton: {
    text: _('Lagre sonevalg', 'Save selected zone'),
    a11yHint: _(
      'Aktivér for å lagre sonevalget',
      'Activate to save selected zone',
    ),
  },
};
export default TariffZonesTexts;
