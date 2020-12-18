import {translation as _} from '../../commons';
import {TariffZoneWithMetadata} from '../../../screens/Ticketing/Purchase/TariffZones';

const textForTariffZone = (zoneText: string, sourceText?: string) =>
  sourceText ? `${sourceText} (${zoneText})` : `${zoneText}`;

const tariffZoneSummaryText = (
  from: TariffZoneWithMetadata,
  to: TariffZoneWithMetadata,
) =>
  from.id === to.id
    ? `Reise gjennom 1 sone (Sone ${from.name.value})`
    : `Reise fra sone ${from.name.value} til sone ${to.name.value}`;

const getSourceVenueText = (tf: TariffZoneWithMetadata, positionText: string) =>
  tf.resultType === 'geolocation' ? positionText : tf.venueName;

const getBasedOnVenueTextNorwegian = (
  tf: TariffZoneWithMetadata,
  fromOrTo: 'from' | 'to',
) => {
  const zoneText = fromOrTo === 'from' ? 'avreisesone' : 'ankomstsone';
  const baseText = `Valgt ${zoneText} er sone ${tf.name.value}`;
  if (tf.resultType === 'geolocation') {
    return `${baseText} basert på min posisjon`;
  } else if (tf.venueName) {
    return `${baseText} basert på stoppested ${tf.venueName}`;
  } else {
    return baseText;
  }
};

const TariffZonesTexts = {
  header: {
    title: _('Velg sone'),
    leftButton: {
      a11yLabel: _('Gå tilbake uten å lagre soner'),
    },
  },
  zoneSummary: {
    a11yLabel: (from: TariffZoneWithMetadata, to: TariffZoneWithMetadata) =>
      _(`Sonevalget er ${tariffZoneSummaryText(from, to)}`),
    text: (from: TariffZoneWithMetadata, to: TariffZoneWithMetadata) =>
      _(tariffZoneSummaryText(from, to)),
  },

  location: {
    departurePicker: {
      value: (from: TariffZoneWithMetadata) =>
        _(
          textForTariffZone(
            `Sone ${from.name.value}`,
            getSourceVenueText(from, 'Min posisjon'),
          ),
        ),
      label: _('Fra', 'From'),
      a11yLabel: (from: TariffZoneWithMetadata) =>
        _(getBasedOnVenueTextNorwegian(from, 'from')),
      a11yHint: _('Aktivér for å søke etter avreisesone'),
      placeholder: _('Søk etter avreisesone'),
    },
    destinationPicker: {
      value: (from: TariffZoneWithMetadata, to: TariffZoneWithMetadata) =>
        _(
          from.id === to.id
            ? textForTariffZone(
                `Samme sone`,
                getSourceVenueText(to, 'Min posisjon'),
              )
            : textForTariffZone(
                `Sone ${to.name.value}`,
                getSourceVenueText(to, 'Min posisjon'),
              ),
        ),
      label: _('Til', 'To'),
      a11yLabel: (to: TariffZoneWithMetadata) =>
        _(getBasedOnVenueTextNorwegian(to, 'to')),
      a11yHint: _('Aktivér for å søke etter ankomstsone'),
      placeholder: _('Søk etter ankomstsone'),
    },
  },
  saveButton: {
    text: _('Lagre sonvalg'),
    a11yHint: _('Aktivér for å lagre sonevalget'),
  },
};
export default TariffZonesTexts;
