import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const OnBehalfOfTexts = {
  chooseReceiver: {
    header: _('Kjøp til andre', 'Buy for others', 'Kjøp til andre'),
    title: _(
      'Hvem skal motta billetten?',
      'Who will receive the ticket?',
      'Kven skal få billetten?',
    ),
    subtitle: _(
      'Den du kjøper billett til, må være innlogget i AtB-appen for å få billetten.',
      'The person receiving the ticket must be logged in to the AtB app to get the ticket.',
      'Den du kjøper billett til, må vere logga inn i AtB-appen for å få billetten.',
    ),
    errorText: _(
      'Ingen konto tilknyttet dette telefonnummeret',
      'No account is associated with this phone number',
      'Ingen konto knytta til dette telefonnummeret',
    ),
  },
};

export default orgSpecificTranslations(OnBehalfOfTexts, {
  nfk: {
    chooseReceiver: {
      subtitle: _(
        'Den du kjøper billett til, må være innlogget i Reis-appen for å få billetten.',
        'The person receiving the ticket must be logged in to the Reis app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i Reis-appen for å få billetten.',
      ),
    },
  },
  fram: {
    chooseReceiver: {
      subtitle: _(
        'Den du kjøper billett til, må være innlogget i FRAM-appen for å få billetten.',
        'The person receiving the ticket must be logged in to the FRAM app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i FRAM-appen for å få billetten.',
      ),
    },
  },
});
