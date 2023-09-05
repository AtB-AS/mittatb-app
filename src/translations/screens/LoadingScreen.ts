import {translation as _} from '../commons';

const LoadingScreenTexts = {
  error: {
    heading: _('Noe gikk galt', 'Something went wrong', 'Noko gjekk gale'),
    description: _(
      'Vi har trøbbel med å starte opp appen. Hvis problemet vedvarer så kan du forsøke å:\n' +
        '\n  • Lukke og åpne appen på nytt' +
        '\n  • Reinstallere appen' +
        '\n  • Kontakte kundeservice',
      'We are having trouble starting the app properly. If the problem continues you can try to:\n' +
        '\n  • Close and reopen the app' +
        '\n  • Reinstall the app' +
        '\n  • Contact customer service',
      'Vi har trøbbel med å starte opp appen. Hvis problemet held fram så kan du forsøke å:' +
        '\n  • Lukke og åpne appen på nytt' +
        '\n  • Reinstallere appen' +
        '\n  • Kontakte kundeservice',
    ),
    installId: (installId: string) =>
      _(
        `Install-id: ${installId}`,
        `Install-id: ${installId}`,
        `Install-id: ${installId}`,
      ),
    contactButton: {
      text: _(
        'Kontakt kundeservice',
        'Contact customer support',
        'Kontakt kundeservice',
      ),
      a11yLabel: _(
        'Kontakt kundeservice, åpner side i nettleser',
        'Contact customer service, opens page in browser',
        'Kontakt kundeservice, åpner side i nettlesar',
      ),
    },
  },
};
export default LoadingScreenTexts;
