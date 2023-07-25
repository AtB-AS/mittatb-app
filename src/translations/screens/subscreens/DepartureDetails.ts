import {translation as _} from '../../commons';

const DepartureDetailsTexts = {
  header: {
    title: (departureName: string) =>
      _(departureName, departureName, departureName),
    alternateTitle: _('Reisedetaljer', 'Trip details', 'Reisedetaljar'),
    notFound: _('Detaljer', 'Details', 'Detaljar'),
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
  noPassedStop: (stopPlaceName: string, time: string) =>
    _(
      `Kjører fra ${stopPlaceName} kl. ${time}`,
      `Departs from ${stopPlaceName} at ${time}`,
      `Køyrer frå ${stopPlaceName} kl. ${time}`,
    ),
  onTime: _(`I rute`, `On time`, `I rute`),
  notOnTime: _(`Etter rutetid`, `Behind scheduled time`, `Etter rutetid`),
  live: _('Se live', 'See live', 'Sjå direkte'),
  map: _('Se i kart', 'Show in map', 'Sjå i kart'),
  messages: {
    loading: _('Laster detaljer', 'Loading details', 'Lastar detaljar'),
    noAlighting: _('Ingen avstigning', 'No disembarking', 'Ingen avstigning'),
    noBoarding: _('Ingen påstigning', 'No boarding', 'Ingen påstigning'),
    noActiveItem: _(
      'Ojda! Noe gikk galt med lasting av detaljer for denne reisen.',
      'Oops! We had some issues loading the details for this journey.',
      'Oi då! Noko gjekk gale med lasting av detaljar for denne reisa.',
    ),
  },
};
export default DepartureDetailsTexts;
