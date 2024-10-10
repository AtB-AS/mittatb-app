import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const ActiveTokenRequiredTexts = {
  ticketNotAvailable: _(
    'Billetten er ikke tilgjengelig på',
    'The ticket is not available on',
    'Billetten er ikkje tilgjengeleg på',
  ),
  travelCard: _('t:kort', 't:card', 't:kort'),
  switchToMobile: _(
    'Bytt til mobil for å gjennomføre kjøpet.',
    'Switch to mobile to complete the purchase.',
    'Byt til mobil for å gjennomføre kjøpet.',
  ),
  actionMessage: _(
    'Denne handlingen vil flytte alle dine aktive billetter fra t:kort til mobil.',
    'This action will move all your active tickets from t:card to mobile.',
    'Handlinga vil flytte alle de aktive billettane dine frå t:kort til mobil.',
  ),
};

export default orgSpecificTranslations(ActiveTokenRequiredTexts, {
  nfk: {
    travelCard: _('reisekort', 'travel card', 'reisekort'),
  },
  fram: {
    travelCard: _('reisekort', 'travel card', 'reisekort'),
  },
});
