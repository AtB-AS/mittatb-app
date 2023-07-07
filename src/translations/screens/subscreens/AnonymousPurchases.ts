import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const AnonymousPurchases = {
  warning: {
    title: _('Anonyme billettkjøp', 'Anonymous ticket purchases'),
    message: _(
      `Du er ikke innlogget og billettkjøp har dermed noen begrensninger.`,
      `You are not logged in and ticket purchases thus have some limitations.`,
    ),
    checkHere: _('Klikk her for å se', 'Click here to see!'),
  },
  consequences: {
    title: _('Når du kjøper anonymt...', 'When you buy anonymously...'),
    messages: [
      _(
        'mister du tilgangen på tidligere kjøpte billetter hvis du mister eller får ny telefon',
        'you lose access to previous tickets if you change phones',
      ),
      _(
        'har du tilgang på kvitteringer etter kjøp i en begrenset periode',
        'you only have access to receipts for a limited time',
      ),
      _(
        'har du selv ansvar for å ta vare på ordre-ID hvis du skulle ha behov for hjelp vedrørende et billettkjøp',
        'you must save the order ID if you need help regarding a ticket purchase',
      ),
    ],
    button: {
      accept: {
        label: _('Jeg godtar begrensningene', 'I accept the restrictions'),
        a11yHint: _(
          'Aktiver for å godta begrensningene',
          'Activate to accept the restrictions',
        ),
      },
      login: {
        label: _('Jeg vil logge inn', 'I want to log in'),
        a11yHint: _('Aktiver for å logge inn', 'Activate to log in'),
      },
      logout: {
        label: _('Logg ut likevel', 'Log out anyway'),
        a11yHint: _('Aktiver for å logge ut', 'Activate to log out'),
      },
      stayLoggedIn: {
        label: _('Forbli innlogget', 'Stay logged in'),
        a11yHint: _(
          'Aktiver for å forbli pålogget',
          'Activate to stay logged in',
        ),
      },
      cancel: {
        label: _('Avbryt', 'Cancel'),
        a11yHint: _('Aktiver for å avbryte', 'Activate to cancel'),
      },
    },
  },
  unknown_error: _(
    'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
    'Whoops - something went wrong. Please try again 🤞',
  ),
};

export default orgSpecificTranslations(AnonymousPurchases, {
  fram: {
    consequences: {
      title: _(
        'Når du kjøper uten å logge inn...',
        'When you buy without signing in...',
      ),
      messages: [
        _(
          'mister du tilgangen på tidligere kjøpte billetter hvis du mister eller får ny telefon',
          'you lose access to previous tickets if you change phones',
        ),
        _(
          'har du tilgang på kvitteringer etter kjøp i en begrenset periode',
          'you only have access to receipts for a limited time',
        ),
        _(
          'har du selv ansvar for å ta vare på ordre-ID hvis du skulle ha behov for hjelp angående en billett du har kjøpt',
          'you must save the order ID if you need help regarding a ticket purchase',
        ),
      ],
      button: {
        accept: {
          label: _(
            'Jeg vil forsette uten å logge inn',
            'I want to continue without signing in',
          ),
        },
      },
    },
  },
});
