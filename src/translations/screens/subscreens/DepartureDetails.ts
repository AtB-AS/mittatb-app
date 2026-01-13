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
    noAlighting: _('Ingen avstigning', 'No disembarking', 'Ingen avstiging'),
    noBoarding: _('Ingen påstigning', 'No boarding', 'Ingen påstiging'),
    noActiveItem: _(
      'Vi klarte ikke å laste av detaljer for denne reisen.',
      'We are unable to load the details for this journey.',
      'Vi klarte ikkje a laste av detaljar for denne reisa.',
    ),
  },
};
export default DepartureDetailsTexts;
