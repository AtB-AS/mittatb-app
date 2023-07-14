import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const AnonymousPurchases = {
  warning: {
    title: _(
      'Anonyme billettkjøp',
      'Anonymous ticket purchases',
      'Anonyme billettkjøp',
    ),
    message: _(
      `Du er ikke innlogget og billettkjøp har dermed noen begrensninger.`,
      `You are not logged in and ticket purchases thus have some limitations.`,
      `Du er ikkje logga inn og det er difor visse avgrensingar ved billettkjøp.`,
    ),
    checkHere: _(
      'Klikk her for å se',
      'Click here to see!',
      'Klikk her for å sjå',
    ),
  },
  consequences: {
    title: _(
      'Når du kjøper anonymt...',
      'When you buy anonymously...',
      'Når du kjøper anonymt...',
    ),
    messages: [
      _(
        'mister du tilgangen på tidligere kjøpte billetter hvis du mister eller får ny telefon',
        'you lose access to previous tickets if you change phones',
        'mistar du tilgangen til tidlegare kjøpte billettar om du byter eller mistar telefonen din',
      ),
      _(
        'har du tilgang på kvitteringer etter kjøp i en begrenset periode',
        'you only have access to receipts for a limited time',
        'har du tilgang på kvitteringar i ein avgrensa periode',
      ),
      _(
        'har du selv ansvar for å ta vare på ordre-ID hvis du skulle ha behov for hjelp vedrørende et billettkjøp',
        'you must save the order ID if you need help regarding a ticket purchase',
        'har du sjølv ansvaret for å ta vare på ordre-ID om du treng hjelp vedrørande eit billettkjøp',
      ),
    ],
    button: {
      accept: {
        label: _(
          'Jeg godtar begrensningene',
          'I accept the restrictions',
          'Eg godtar avgrensingane',
        ),
        a11yHint: _(
          'Aktiver for å godta begrensningene',
          'Activate to accept the restrictions',
          'Aktiver for å godta avgrensingane',
        ),
      },
      login: {
        label: _('jeg vil logge inn', 'I want to log in', 'Eg vil logge inn'),
        a11yHint: _(
          'Aktiver for å logge inn',
          'Activate to log in',
          'Aktiver for å logge inn',
        ),
      },
      logout: {
        label: _('Logg ut likevel', 'Log out anyway', 'Logg ut likevel'),
        a11yHint: _(
          'Aktiver for å logge ut',
          'Activate to log out',
          'Aktiver for å logge ut',
        ),
      },
      stayLoggedIn: {
        label: _('Forbli innlogget', 'Stay logged in', 'Forbli innlogga'),
        a11yHint: _(
          'Aktiver for å forbli innlogget',
          'Activate to stay logged in',
          'Aktiver for å halde deg innlogga',
        ),
      },
      cancel: {
        label: _('Avbryt', 'Cancel', 'Avbryt'),
        a11yHint: _(
          'Aktiver for å avbryte',
          'Activate to cancel',
          'Aktiver for å avbryte',
        ),
      },
    },
  },
  unknown_error: _(
    'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
    'Whoops - something went wrong. Please try again ��',
    'Oi - noko gjekk gale. Prøv igjen 🤞',
  ),
};

export default orgSpecificTranslations(AnonymousPurchases, {
  fram: {
    consequences: {
      title: _(
        'Når du kjøper uten å logge inn...',
        'When you buy without signing in...',
        'Når du kjøper utan å logge inn...',
      ),
      messages: [
        _(
          'mister du tilgangen på tidligere kjøpte billetter hvis du mister eller får ny telefon',
          'you lose access to previous tickets if you change phones',
          'mister du tilgangen på tidlegare kjøpte billettar om du mistar eller får ny telefon',
        ),
        _(
          'har du tilgang på kvitteringer etter kjøp i en begrenset periode',
          'you only have access to receipts for a limited time',
          'har du tilgang på kvitteringar etter kjøp i ei avgrensa periode',
        ),
        _(
          'har du selv ansvar for å ta vare på ordre-ID hvis du skulle ha behov for hjelp angående en billett du har kjøpt',
          'you must save the order ID if you need help regarding a ticket purchase',
          'har du sjølv ansvar for å ta vare på ordre-ID viss du skulle trenge hjelp om ein billett du har kjøpt',
        ),
      ],
      button: {
        accept: {
          label: _(
            'Jeg vil forsette uten å logge inn',
            'I want to continue without signing in',
            'Eg vil halde fram utan å logge inn',
          ),
        },
      },
    },
  },
});
