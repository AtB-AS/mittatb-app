import {translation as _} from '../../commons';

const FareZonesTexts = {
  header: {
    title: {
      singleZone: _(
        'Velg holdeplass/sone',
        'Select stop/zone',
        'Vel haldeplass/sone',
      ),
      multipleZone: _(
        'Velg holdeplasser/soner',
        'Select stops/zones',
        'Vel haldeplassar/soner',
      ),
    },
  },
  zoneSummary: {
    a11yLabelPrefix: _(
      `Sonevalget er`,
      `The zone selection is`,
      `Sonevalet er`,
    ),
    text: {
      singleZone: (zoneName: string) =>
        _(
          `Reise i 1 sone (${zoneName})`,
          `Travel in 1 zone (${zoneName})`,
          `Reise i 1 sone (${zoneName})`,
        ),
      multipleZone: (zoneNameFrom: string, zoneNameTo: string) =>
        _(
          `Reise mellom sone ${zoneNameFrom} og sone ${zoneNameTo}`,
          `Travel between zone ${zoneNameFrom} and zone ${zoneNameTo}`,
          `Reise mellom sone ${zoneNameFrom} og sone ${zoneNameTo}`,
        ),
    },
  },
  zoneTitle: _(`Reisesone(r)`, `Travel zone(s)`, `Reisesone(r)`),
  location: {
    singleZone: {
      label: _('Reise i ', 'Travel in ', 'Reise i '),
    },
    zonePicker: {
      value: {
        noVenue: (zoneName: string) =>
          _(`Sone ${zoneName}`, `Zone ${zoneName}`, `Sone ${zoneName}`),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `${venueName} (Sone ${zoneName})`,
            `${venueName} (Zone ${zoneName})`,
            `${venueName} (Sone ${zoneName})`,
          ),
      },
      labelFrom: _('Fra', 'From', 'Frå'),
      labelTo: _('Til', 'To', 'Til'),
      a11yLabelFrom: {
        noVenue: (zoneName: string) =>
          _(
            `Valgt avreisesone er ${zoneName}`,
            `Selected zone of departure is ${zoneName}`,
            `Valt avreisesone er ${zoneName}`,
          ),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Valgt stoppested er ${venueName} basert på avreisesone ${zoneName}`,
            `Selected stop place of departure is ${venueName} based on zone ${zoneName}`,
            `Valt stoppestad er ${venueName} basert på avreisesone ${zoneName}`,
          ),
      },
      a11yLabelTo: {
        noVenue: (zoneName: string) =>
          _(
            `Valgt ankomstsone er ${zoneName}`,
            `Selected zone of arrival is ${zoneName}`,
            `Valt framkomstsone er ${zoneName}`,
          ),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Valgt stoppested er ${venueName} basert på ankomstsone ${zoneName}`,
            `Selected stop place of arrival is ${venueName} based on zone ${zoneName}`,
            `Valt stoppestad er ${venueName} basert på framkomstsone ${zoneName}`,
          ),
      },
      a11yHintFrom: _(
        'Aktivér for å søke etter avreisesone',
        'Activate to search zone of departure',
        'Aktivér for å søke etter avreisesone',
      ),
      a11yHintTo: _(
        'Aktivér for å søke etter ankomstsone',
        'Activate to search for zone of arrival',
        'Aktivér for å søke etter framkomstsone',
      ),
    },
  },
  saveButton: {
    text: _('Lagre sonevalg', 'Save selected zone', 'Lagre sonevalet'),
    a11yHint: _(
      'Aktivér for å lagre sonevalget',
      'Activate to save selected zone',
      'Aktivér for å lagre sonevalet',
    ),
  },
};
export default FareZonesTexts;
