import {orgSpecificTranslations} from '../../orgSpecificTranslations';
import {translation as _} from '../../commons';
const ContactSheetTexts = {
  header: {
    title: _('Kontakt AtB', 'Contact AtB', 'Kontakt AtB'),
  },
  customer_service: {
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
    button: _('Forbedre appen', 'Improve the app', 'Forbetre appen'),
    a11yHint: _(
      'Aktivér for å foreslå forbedringer',
      'Activate to suggest improvements',
      'Aktivér for å foreslå forbetringar',
    ),
  },
  parking_violations: {
    buttonText: _(
      'Rapporter feilparkert sparkesykkel',
      'Report wrongly parked scooter',
      'Rapporter feilparkert sparkesykkel',
    ),
    a11yHint: _(
      'Aktivér for å rapportere feilparkert sparkesykkel',
      'Activate to report wrongly parked scooter',
      'Aktivér for å rapportere feilparkert sparkesykkel',
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
  troms: {
    header: {
      title: _('Kontakt Svipper', 'Contact Svipper', 'Kontakt Svipper'),
    },
  },
});
