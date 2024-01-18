import {translation as _} from '../commons';

const PhoneInputTexts = {
  input: {
    title: _('Mobilnummer', 'Phone number', 'Mobilnummer'),
    placeholder: _(
      'Skriv inn ditt telefonnummer',
      'Type in your phone number',
      'Skriv inn ditt telefonnummer',
    ),
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
    unknown_error: _(
      'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
      'Whoops - something went wrong. Please try again 🤞',
      'Oops - noko gjekk gale. Supert om du prøver på nytt 🤞',
    ),
  },
};

export default PhoneInputTexts;
