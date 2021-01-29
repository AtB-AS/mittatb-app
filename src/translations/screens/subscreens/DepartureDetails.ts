import {translation as _} from '../../commons';
const DepartureDetailsTexts = {
  header: {
    title: (departureName: string) => _(departureName),
    notFound: _('Detaljer', 'Details'),
    leftIcon: {
      a11yLabel: _('Gå tilbake', 'Go back'),
    },
  },
  collapse: {
    label: (numberStops: number) =>
      _(`${numberStops} mellomstopp`, `${numberStops} intermediate stops`),
  },
  messages: {
    loading: _('Laster detaljer', 'Loading details'),
  },
};
export default DepartureDetailsTexts;
