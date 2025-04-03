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
      'Begrensninger ved billettkjøp når du ikke logger inn',
      'Restrictions on anonymous ticket purchases',
      'Begrensningar ved billettkjøp når du ikkje loggar inn',
    ),
    messages: [
      _(
        'Du mister tilgangen på tidligere kjøpte billetter, historikk og rabatter hvis du mister eller får ny telefon.',
        'You lose access to previously purchased tickets, history and discounts if you lose or get a new phone.',
        'Du mistar tilgongen til tidlegare kjøpte billettar, historikk og rabattar om du mistar eller får ny telefon.',
      ),
      _(
        'Kvitteringer etter kjøp er bare tilgjengelig i en begrenset periode.',
        'Receipts after purchase are available for a limited time only.',
        'Kvitteringar etter kjøp er berre tilgjengeleg i ein begrensa periode.',
      ),
      _(
        'Du har selv ansvar for å ta vare på ordre-ID hvis du trenger hjelp med billettkjøp.',
        'You are responsible for taking care of your order ID if you need help with ticket purchases.',
        'Du har sjølv ansvar for å ta vare på ordre-ID om du treng hjelp med billettkjøp.',
      ),
    ],
    button: {
      accept: {
        label: _(
          'Aksepter begrensninger',
          'Accept limitations',
          'Aksepter avgrensingane',
        ),
        a11yHint: _(
          'Aktiver for å akseptere begrensningene',
          'Activate to accept the restrictions',
          'Aktiver for å akseptere avgrensingane',
        ),
      },
      // todo: remove this (login)
      login: {
        label: _('Jeg vil logge inn', 'I want to log in', 'Eg vil logge inn'),
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
    select_payment_method: _(
      'Logg inn for å lagre kort for fremtidige kjøp',
      'Log in to save cards for future purchases',
      'Logg inn for å lagra kort for framtidige kjøp',
    ),
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
  nfk: {
    consequences: {
      messages: [
        _(
          'Du mister tilgangen på tidligere kjøpte billetter hvis du mister eller får ny telefon.',
          'You lose access to previously purchased tickets if you lose or get a new phone.',
          'Du mistar tilgongen til tidlegare kjøpte billettar om du mistar eller får ny telefon.',
        ),
        _(
          'Kvitteringer etter kjøp er bare tilgjengelig i en begrenset periode.',
          'Receipts after purchase are available for a limited time only.',
          'Kvitteringar etter kjøp er berre tilgjengeleg i ein begrensa periode.',
        ),
        _(
          'Du har selv ansvar for å ta vare på ordre-ID hvis du trenger hjelp med billettkjøp.',
          'You are responsible for taking care of your order ID if you need help with ticket purchases.',
          'Du har sjølv ansvar for å ta vare på ordre-ID om du treng hjelp med billettkjøp.',
        ),
      ],
    },
  },
  troms: {
    consequences: {
      messages: [
        _(
          'Du mister tilgangen på tidligere kjøpte billetter hvis du mister eller får ny telefon.',
          'You lose access to previously purchased tickets if you lose or get a new phone.',
          'Du mistar tilgongen til tidlegare kjøpte billettar om du mistar eller får ny telefon.',
        ),
        _(
          'Kvitteringer etter kjøp er bare tilgjengelig i en begrenset periode.',
          'Receipts after purchase are available for a limited time only.',
          'Kvitteringar etter kjøp er berre tilgjengeleg i ein begrensa periode.',
        ),
        _(
          'Du har selv ansvar for å ta vare på ordre-ID hvis du trenger hjelp med billettkjøp.',
          'You are responsible for taking care of your order ID if you need help with ticket purchases.',
          'Du har sjølv ansvar for å ta vare på ordre-ID om du treng hjelp med billettkjøp.',
        ),
      ],
    },
  },
});
