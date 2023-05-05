import {orgSpecificTranslations} from '../../orgSpecificTranslations';
import {translation as _} from '../../commons';
const ContactSheetTexts = {
  header: {
    title: _('Kontakt AtB', 'Contact AtB'),
  },
  customer_service: {
    body: _(
      'Har du spørsmål eller trenger hjelp?',
      'Do you have questions or need help?',
    ),
    button: _('Kontakt kundeservice', 'Contact customer service'),
    a11yHint: _(
      'Aktivér for å kontakte kundeservice, åpner side i nettleser',
      'Activate to contact customer service, opens page in browser',
    ),
  },
  customer_feedback_website: {
    body: _(
      'Vil du foreslå forbedringer til appen?',
      'Do you have suggestions on how we can improve the app?',
    ),
    button: _(
      'Forbedre appen (åpnes i nettleser)',
      'Improve the app (opens in browser)',
    ),
    a11yHint: _(
      'Aktivér for å foreslå forbedringer, åpner side i nettleser',
      'Activate to suggest improvements, opens page in browser',
    ),
  },
  customer_feedback: {
    body: _(
      'Vil du foreslå forbedringer eller rapportere feil i appen?',
      'Would you like to suggest improvements or report errors in the app?',
    ),
    button: _('Forbedre appen', 'Improve the app'),
    a11yHint: _(
      'Aktivér for å foreslå forbedringer',
      'Activate to suggest improvements',
    ),
  },
};
export default orgSpecificTranslations(ContactSheetTexts, {
  nfk: {
    header: {
      title: _('Kontakt Reis Nordland', 'Contact Reis Nordland'),
    },
  },
  fram: {
    header: {
      title: _('Kontakt FRAM', 'Contact FRAM'),
    },
  },
});
