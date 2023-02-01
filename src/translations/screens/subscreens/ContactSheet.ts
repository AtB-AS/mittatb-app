import {orgSpecificTranslations} from '@atb/translations';
import {translation as _} from '../../commons';
const ContactSheetTexts = {
  header: {
    title: _('Kontakt AtB', 'Contact AtB'),
  },
  customer_service: {
    title: _('Spørsmål til kundeservice', 'Questions for customer service'),
    body: _(
      'Har du spørsmål eller trenger hjelp?',
      'Do you have questions or need help?',
    ),
    button: _(
      'Kontakt kundeservice (åpnes i nettleser)',
      'Contact customer service (opens in browser)',
    ),
    a11yHint: _(
      'Aktivér for å kontakte kundeservice, åpner side i nettleser',
      'Activate to contact customer service, opens page in browser',
    ),
  },
  customer_feedback_website: {
    title: _('Tilbakemelding om appen', 'Feedback about the app'),
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
    title: _('Tilbakemelding om appen', 'Feedback about the app'),
    body: _(
      'Vil du foreslå forbedringer til appen?',
      'Do you have suggestions on how we can improve the app?',
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
});
