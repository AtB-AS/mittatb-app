import orgSpecificTranslations from '@atb/translations/utils';
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
    button: _('Kontakt kundeservice', 'Contact customer service'),
    a11yHint: _(
      'Aktiver for å kontakte kundeservice',
      'Activate to contact customer service',
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
      'Aktiver for å foreslå forbedringer',
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
