import {translation as _} from '../commons';
import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';

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
export default orgSpecificTranslations(LoadingScreenTexts, {
  fram: {
    error: {
      heading: _(
        'Noe gikk galt...',
        'Something went wrong...',
        'Noko gjekk gale...',
      ),
      description: _(
        'Appen har problemer med å starte opp. Om det fortsetter, kan du forsøke å:\n' +
          '\n  • Sjekke om du har nett' +
          '\n  • Lukke og åpne appen igjen' +
          '\n  • Slette og installere appen igjen' +
          '\n  • Kontakte FRAM Kundesenter',
        'The app is having trouble starting up. If it continues, you can try to:\n' +
          '\n  • Check if you have internet' +
          '\n  • Close and reopen the app' +
          '\n  • Delete and reinstall the app' +
          '\n  • Contact FRAM Customer Service',
        'Appen har problem med å starta opp. Om det held fram, kan du prøve å:\n' +
          '\n  • Sjekka om du har nett' +
          '\n  • Lukke og opne appen igjen' +
          '\n  • Sletta og installere appen igjen' +
          '\n  • Kontakte FRAM Kundesenter',
      ),
      installId: (installId: string) =>
        _(
          `Install-id: ${installId}`,
          `Install-id: ${installId}`,
          `Install-id: ${installId}`,
        ),
      contactButton: {
        text: _(
          'Kontakt FRAM Kundesenter',
          'Contact FRAM Customer Centre',
          'Kontakt FRAM Kundesenter',
        ),
        a11yLabel: _(
          'Kontakt FRAM Kundesenter, åpner side i nettleser',
          'Contact FRAM Customer Centre, opens page in browser',
          'Kontakt FRAM Kundesenter, opner side i nettlesar',
        ),
      },
    },
  },
});
