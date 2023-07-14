import {orgSpecificTranslations} from '../../orgSpecificTranslations';
import {translation as _} from '../../commons';
const ContactSheetTexts = {
  header: {
    title: _('Kontakt AtB', 'Contact AtB', 'Kontakt AtB'),
  },
  customer_service: {
    body: _(
      'Har du spørsmål eller trenger hjelp?',
      'Do you have questions or need help?',
      'Har du spørsmål eller treng hjelp?',
    ),
    button: _(
      'Kontakt kundeservice',
      'Contact customer service',
      'Kontakt kundeservice',
    ),
    a11yHint: _(
      'Aktivér for å kontakte kundeservice, åpner side i nettleser',
      'Activate to contact customer service, opens page in browser',
      'Trykk for å kontakte kundeservice, åpner side i nettlesar',
    ),
  },
  customer_feedback_website: {
    body: _(
      'Vil du foreslå forbedringer til appen?',
      'Do you have suggestions on how we can improve the app?',
      'Vil du foreslå forbetringar til appen?',
    ),
    button: _(
      'Forbedre appen (åpnes i nettleser)',
      'Improve the app (opens in browser)',
      'Forbetre appen (opnar i nettlesar)',
    ),
    a11yHint: _(
      'Aktivér for å foreslå forbedringer, åpner side i nettleser',
      'Activate to suggest improvements, opens page in browser',
      'Trykk for å foreslå forbetringar, opnar side i nettlesar',
    ),
  },
  customer_feedback: {
    body: _(
      'Vil du foreslå forbedringer eller rapportere feil i appen?',
      'Would you like to suggest improvements or report errors in the app?',
      'Vil du foreslå forbetringar eller rapportere feil i appen?',
    ),
    button: _('Forbedre appen', 'Improve the app', 'Forbetre appen'),
    a11yHint: _(
      'Aktivér for å foreslå forbedringer',
      'Activate to suggest improvements',
      'Aktivér for å foreslå forbetringar',
    ),
  },
};
export default orgSpecificTranslations(ContactSheetTexts, {
  nfk: {
    header: {
      title: _(
        'Kontakt Reis Nordland',
        'Contact Reis Nordland',
        'Kontakt Reis Nordland',
      ),
    },
  },
  fram: {
    header: {
      title: _('Kontakt FRAM', 'Contact FRAM', 'Kontakt FRAM'),
    },
    customer_service: {
      button: _(
        'Kontakt FRAM Kundesenter',
        'Contact FRAM Customer Centre',
        'Kontakt FRAM Kundesenter',
      ),
    },
  },
});
