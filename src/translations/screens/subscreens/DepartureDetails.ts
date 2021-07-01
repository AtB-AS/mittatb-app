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
    noTickets: _(
      'Billetter via app-en er ikke gyldig for denne avgangen.',
      'Tickets bought through this app is not valid this departure.',
    ),
  },
};
export default DepartureDetailsTexts;
