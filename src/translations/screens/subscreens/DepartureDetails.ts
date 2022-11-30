import orgSpecificTranslations from '@atb/translations/utils';
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
      'Reisen inneholder reisetilbud som krever billett fra andre selskap enn AtB.',
      'This journey requires tickets from providers other than AtB.',
    ),
    collabTicketInfo: _(
      `Med enkelt- og periodebillett for sone A fra AtB kan du reise med tog i sonen.`,
      `With a single or periodic ticket for zone A from AtB, you can travel by train in the zone.`,
    ),
    noAlighting: _('Ingen avstigning', 'No disembarking'),
    noActiveItem: _(
      'Ojda! Noe gikk galt med lasting av detaljer for denne reisen.',
      'Oops! We had some issues loading the details for this journey.',
    ),
  },
};
export default orgSpecificTranslations(DepartureDetailsTexts, {
  nfk: {
    messages: {
      ticketsWeDontSell: _(
        'Reisen inneholder reisetilbud som krever billett fra andre selskap enn Reis Nordland',
        'This journey requires tickets from providers other than Reis Nordland',
      ),
    },
  },
});
