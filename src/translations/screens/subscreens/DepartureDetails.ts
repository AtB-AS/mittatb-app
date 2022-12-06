import {translation as _} from '../../commons';

const DepartureDetailsTexts = {
  header: {
    title: (departureName: string) => _(departureName, departureName),
    notFound: _('Detaljer', 'Details'),
  },
  collapse: {
    label: (numberStops: number) =>
      _(`${numberStops} mellomstopp`, `${numberStops} intermediate stops`),
  },
  messages: {
    loading: _('Laster detaljer', 'Loading details'),
    noAlighting: _('Ingen avstigning', 'No disembarking'),
    noBoarding: _('Ingen påstigning', 'No boarding'),
    noActiveItem: _(
      'Ojda! Noe gikk galt med lasting av detaljer for denne reisen.',
      'Oops! We had some issues loading the details for this journey.',
    ),
  },
};
export default DepartureDetailsTexts;
