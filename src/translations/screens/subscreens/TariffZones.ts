import {translation as _} from '../../commons';

const TariffZonesTexts = {
  header: {
    title: _('Velg sone'),
    leftButton: {
      a11yLabel: _('Gå tilbake uten å lagre sonevalget'),
    },
  },
  zoneSummary: {
    a11yLabelPrefix: _(`Sonevalget er`, `The zone selection is`),
    text: {
      singleZone: (zoneName: string) =>
        _(
          `Reise gjennom 1 sone (Sone ${zoneName})`,
          `Travel through 1 zone (Zone ${zoneName})`,
        ),
      multipleZone: (zoneNameFrom: string, zoneNameTo: string) =>
        _(
          `Reise fra sone ${zoneNameFrom} til sone ${zoneNameTo}`,
          `Travel from zone ${zoneNameFrom} to zone ${zoneNameTo})`,
        ),
    },
  },

  location: {
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
        noVenue: (zoneName: string) => _(`Valgt avreisesone er ${zoneName}`),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Valgt avreisesone er ${zoneName} basert på stoppested ${venueName}`,
          ),
      },
      a11yHint: _('Aktivér for å søke etter avreisesone'),
      placeholder: _('Søk etter avreisesone'),
    },
    destinationPicker: {
      value: {
        noVenue: (zoneName: string) =>
          _(`Sone ${zoneName}`, `Zone ${zoneName}`),
        noVenueSameZone: _(`Samme sone`, `Same zone`),
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
        noVenue: (zoneName: string) => _(`Valgt ankomstsone er ${zoneName}`),
        withVenue: (zoneName: string, venueName: string) =>
          _(
            `Valgt ankomstsone er ${zoneName} basert på stoppested ${venueName}`,
          ),
      },
      a11yHint: _('Aktivér for å søke etter ankomstsone'),
      placeholder: _('Søk etter ankomstsone'),
    },
  },
  saveButton: {
    text: _('Lagre sonevalg'),
    a11yHint: _('Aktivér for å lagre sonevalget'),
  },
};
export default TariffZonesTexts;
