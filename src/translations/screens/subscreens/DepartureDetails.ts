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
    ticketsWeDontSell: _(
      'Reisen inneholder reisetilbud som krever billett fra andre selskap enn AtB',
      'This journey requires tickets from providers other than AtB',
    ),
    noAlighting: _('Ingen avstigning', 'No disembarking'),
  },
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    pleaseWait: _('Vennligst vent', 'Please wait'),
  },
};
export default DepartureDetailsTexts;
