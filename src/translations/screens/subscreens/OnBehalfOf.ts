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
  tooManyRecipients: _(
    'Du kan ikke legge til flere mottakere. Om du ønsker å sende til noen andre, må du fjerne en av mottakerne i listen ovenfor.',
    "You can't add more recipients. If you wish to send to someone else, then you need to remove one of the recipients in the list above.",
    'Du kan ikkje leggje til fleire mottakarar. Om du ønskjer sende til nokon andre, må du fjerne ein av mottakarane i lista ovanfor.',
  ),
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
    fetch_recipients_failed: _(
      'Kunne ikke laste mottakere',
      "Couldn't retrieve recipients",
      'Kunne ikkje laste mottakarar',
    ),
    no_recipient_selected: _(
      'Du må velge mottaker',
      'You need to choose recipient',
      'Du må velje mottakar',
    ),
    delete_recipient_failed: _(
      'Klarte ikke å slette mottaker',
      "Weren't able to delete recipient",
      'Klarte ikkje å slette mottakar',
    ),
    missing_recipient_name: _(
      'Du må legge inn navn på mottaker',
      'You need too add recipient name',
      'Du må leggja inn namn på mottakar',
    ),
    too_long_recipient_name: _(
      'Navnet er for langt',
      'The name is too long',
      'Namnet er for langt',
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
