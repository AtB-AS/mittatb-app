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
  intercom: {
    title: _('Tilbakemelding på appen', 'Feedback on the app'),
    body: _(
      'Vil du rapportere feil eller foreslå forbedringer?',
      'Do you want to report errors or suggest improvements?',
    ),
    button: _('Gi tilbakemelding på app', 'Give feedback on the app'),
    a11yHint: _('Aktiver for å gi tilbakemelding', 'Activate to give feedback'),
  },
};
export default ContactSheetTexts;
