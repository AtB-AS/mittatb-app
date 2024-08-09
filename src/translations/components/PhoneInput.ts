import {translation as _} from '../commons';

const PhoneInputTexts = {
  input: {
    title: _('Telefonnummer', 'Phone number', 'Telefonnummer'),
    placeholder: {
      login: _(
        'Skriv inn ditt telefonnummer',
        'Type in your phone number',
        'Skriv inn ditt telefonnummer',
      ),
      sendTicket: _(
        'Skriv inn telefonnummer',
        'Enter phone number',
        'Skriv inn telefonnummer',
      ),
    },
  },
  errors: {
    invalid_phone: _(
      'Er du sikker på at telefonnummeret er korrekt?',
      'Are you certain the phone number is correct?',
      'Er du sikker på at telefonnummeret er korrekt?',
    ),
    no_associated_account: _(
      'Ingen konto tilknyttet dette telefonnummeret',
      'No account is associated with this phone number',
      'Ingen konto knytta til dette telefonnummeret',
    ),
    phone_already_exists: _(
      'Telefonnummeret er allerede tilknyttet en annen mottaker',
      'The phone number is used for another recipient',
      'Telefonnummeret er allereie knytta til ein annan mottakar',
    ),
    too_many_attempts: _(
      'Du har prøvd for mange ganger. Vennligst vent noen minutter før du prøver igjen.',
      'You have tried too many times. Please wait a few minutes before trying again.',
      'Du har prøvd for mange gangar. Ver venleg og vent nokon minutt før du prøver igjen.',
    ),
    unknown_error: _(
      'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
      'Whoops - something went wrong. Please try again 🤞',
      'Oops - noko gjekk gale. Supert om du prøver på nytt 🤞',
    ),
  },
};

export default PhoneInputTexts;
