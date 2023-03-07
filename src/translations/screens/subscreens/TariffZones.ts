import {translation as _} from '../../commons';

const TariffZonesTexts = {
  header: {
    title: {
      singleZone: _('Velg holdeplass/sone', 'Select stop/zone'), // see that both singular and plural works
      multipleZone: _('Velg holdeplasser/soner', 'Select stops/zones'),
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
  zoneDescription: {
    text: {
      singleZone: (zoneName: string) =>
        _(`Sone ${zoneName}`, `Zone ${zoneName}`),
      multipleZone: (zoneNameFrom: string, zoneNameTo: string) =>
        _(
          `Sone ${zoneNameFrom} til sone ${zoneNameTo}`,
          `Zone ${zoneNameFrom} to zone ${zoneNameTo}`,
        ),
    },
  },

  location: {
    singleZone: {
      label: _('Reise i ', 'Travel in '),
    },
    zonePicker: {
      value: {
        noVenue: (zoneName: string) =>
          _(`Sone ${zoneName}`, `Zone ${zoneName}`),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `${venueName} (Sone ${zoneName})`,
            `${venueName} (Zone ${zoneName})`,
          ),
      },
      labelFrom: _('Fra', 'From'),
      labelTo: _('Til', 'To'),
      a11yLabelFrom: {
        noVenue: (zoneName: string) =>
          _(
            `Valgt avreisesone er ${zoneName}`,
            `Selected zone of departure is ${zoneName}`,
          ),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Valgt stoppested er ${venueName} basert på avreisesone ${zoneName}`,
            `Selected stop place of departure is ${venueName} based on zone ${zoneName}`,
          ),
      },
      a11yLabelTo: {
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
      a11yHintFrom: _(
        'Aktivér for å søke etter avreisesone',
        'Activate to search zone of departure',
      ),
      a11yHintTo: _(
        'Aktivér for å søke etter ankomstsone',
        'Activate to search for zone of arrival',
      ),
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
