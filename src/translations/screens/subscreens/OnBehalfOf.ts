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
    description: _(
      'Husk at mottakeren må ha AtB-appen for å få billetten.',
      'Remember that the person receiving the ticket must have the AtB app to get the ticket.',
      'Husk at mottakaren må ha AtB-appen for å få billetten.',
    ),
  },
  newRecipientLabel: _('Ny mottaker', 'New recipient', 'Ny mottakar'),
  nameInputLabel: _('Navn', 'Name', 'Namn'),
  nameInputPlaceholder: _('Skriv inn navn', 'Enter name', 'Skriv inn namn'),
  sendToOtherButton: _(
    'Send til noen andre',
    'Send to someone else',
    'Send til nokon andre',
  ),
  saveCheckBoxLabel: _(
    'Lagre denne mottakeren til senere',
    'Save this recipient for later',
    'Lagre denne mottakaren til seinare',
  ),
  errors: {
    fetchRecipients: _(
      'Kunne ikke hente mottakere',
      "Couldn't retrieve recipients",
      'Kunne ikkje hente mottakarar',
    ),
    missing_recipient_name: _(
      'Du må legge inn navn på mottaker',
      'You need too add recipient name',
      'Du må leggja inn namn på mottakar',
    ),
    name_already_exists: _(
      'Navnet er allerede tilknyttet en annen mottaker',
      'The phone number is used for another recipient',
      'Namnet er allerede knytta til ein annan mottakar',
    ),
  },
};

export default orgSpecificTranslations(OnBehalfOfTexts, {
  nfk: {
    chooseReceiver: {
      description: _(
        'Den du kjøper billett til, må være innlogget i Reis-appen for å få billetten.',
        'The person receiving the ticket must be logged in to the Reis app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i Reis-appen for å få billetten.',
      ),
    },
  },
  fram: {
    chooseReceiver: {
      description: _(
        'Den du kjøper billett til, må være innlogget i FRAM-appen for å få billetten.',
        'The person receiving the ticket must be logged in to the FRAM app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i FRAM-appen for å få billetten.',
      ),
    },
  },
  troms: {
    chooseReceiver: {
      description: _(
        'Den du kjøper billett til, må være innlogget i Svipper-appen for å få billetten.',
        'The person receiving the ticket must be logged in to the Svipper app to get the ticket.',
        'Den du kjøper billett til, må vere logga inn i Svipper-appen for å få billetten.',
      ),
    },
  },
});
