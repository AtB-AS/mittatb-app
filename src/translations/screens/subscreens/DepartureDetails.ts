import {translation as _} from '../../commons';

const DepartureDetailsTexts = {
  header: {
    title: (departureName: string) =>
      _(departureName, departureName, departureName),
    alternateTitle: _('Reisedetaljer', 'Trip details', 'Reisedetaljar'),
    notFound: _('Detaljer', 'Details', 'Detaljar'),
    journeyAid: _('Reisehjelp', 'Journey Aid', 'Reisehjelp'),
  },
  collapse: {
    label: (numberStops: number) =>
      _(
        `${numberStops} mellomstopp`,
        `${numberStops} intermediate stops`,
        `${numberStops} mellomstopp`,
      ),
  },
  lastPassedStop: (stopPlaceName: string, time: string) =>
    _(
      `Passerte ${stopPlaceName} kl. ${time}`,
      `Passed ${stopPlaceName} at ${time}`,
      `Passerte ${stopPlaceName} kl. ${time}`,
    ),

  live: (transportMode: string) =>
    _(
      `Følg ${transportMode.toLowerCase()}`,
      `Follow ${transportMode.toLowerCase()}`,
      `Følg ${transportMode.toLowerCase()}`,
    ),
  map: _('Se reiserute', 'Show trip', 'Sjå reiserute'),
  messages: {
    loading: _('Laster detaljer', 'Loading details', 'Lastar detaljar'),
    notStoppingHere: (transportMode: string) =>
      _(
        `${transportMode} stopper ikke her`,
        `${transportMode} does not stop here`,
        `${transportMode} stoppar ikkje her`,
      ),
    noActiveItem: _(
      'Klarte ikke å hente detaljer for denne reisen.',
      "Couldn't load the details for this journey.",
      'Klarte ikkje å hente detaljar for denne reisa.',
    ),
  },
};
export default DepartureDetailsTexts;
