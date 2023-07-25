import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const DetailsMessages = {
  messages: {
    trainOutsideZoneA: _(
      'Om reisen din går utenfor sone A kan det kreve billetter som må kjøpes fra andre selskaper enn AtB.',
      'If your trip goes outside zone A, it may require tickets that must be purchased from companies other than AtB.',
      'Om reisa di går utanfor sone A kan det krevje billettar som må kjøpast frå andre selskap enn AtB.',
    ),
    ticketsWeDontSell: _(
      'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn AtB.',
      'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than AtB.',
      'Reisa krev billett som ikkje er tilgjengeleg i denne appen, eller som må kjøpast frå eit anna selskap enn AtB.',
    ),
    collabTicketInfo: _(
      `Med enkelt- og periodebillett for sone A fra AtB kan du reise med tog innen sone A.`,
      `With a single or periodic ticket for zone A from AtB, you can travel by train within zone A.`,
      `Med enkelt- og periodebillettar for sone A frå AtB kan du reise med tog innanfor sone A.`,
    ),
  },
};
export default orgSpecificTranslations(DetailsMessages, {
  nfk: {
    messages: {
      ticketsWeDontSell: _(
        'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn Reis Nordland.',
        'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than Reis Nordland.',
        'Reisa krev billett som ikkje er tilgjengeleg i denne appen, eller som må kjøpast frå ein leverandør anna enn Reis Nordland.',
      ),
    },
  },
  fram: {
    messages: {
      ticketsWeDontSell: _(
        'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn FRAM.',
        'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than FRAM.',
        'Reisa krev billett som ikkje er tilgjengeleg i denne appen, eller som må kjøpast frå ein anna leverandør enn FRAM.',
      ),
    },
  },
});
