import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const OnBehalfOfTexts = {
  chooseReceiver: {
    header: _('Kjøp for andre', 'Buy for others', 'Kjøp for andre'),
    title: _(
      'Hvem skal motta billetten?',
      'Who will receive the ticket?',
      'Kven skal få billetten?',
    ),
    subtitle: _(
      'Husk at mottakeren må ha AtB-appen for å få billetten.',
      'Remember that the person receiving the ticket must have the AtB app to get the ticket.',
      'Husk at mottakaren må ha AtB-appen for å få billetten.',
    ),
    errorText: _(
      'Ingen konto tilknyttet dette telefonnummeret',
      'No account is associated with this phone number',
      'Ingen konto knytta til dette telefonnummeret',
    ),
  },
  nameInputLabel: _('Navn', 'Name', 'Namn'),
  nameInputPlaceholder: _('Skriv inn navn', 'Enter name', 'Skriv inn namn'),
  saveCheckBoxLabel: _(
    'Lagre denne mottakeren til senere',
    'Save this recipient for later',
    'Lagre denne mottakaren til seinare',
  ),
  errors: {
    missing_recipient_name: _(
      'Du må legge inn navn på mottaker',
      'You need too add recipient name',
      'Du må leggja inn namn på mottakar',
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
  troms: {
    chooseReceiver: {
      subtitle: _(
        'Den du kjøper billett til, må være innlogget i Svipper-appen for å få billetten.',
        'The person receiving the ticket must be logged in to the Svipper app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i Svipper-appen for å få billetten.',
      ),
    },
  },
});
