import {translation as _} from '../../commons';
const LoginTexts = {
  phoneInput: {
    title: _('Logg inn', 'Sign in'),
    description: _(
      'Ingen profil enda? Skriv inn telefonnummeret ditt nedenfor og følg instruksjonene, så lager vi en til deg!',
      'No profile yet? Type your phone number below and follow the instructions, and we will create a profile for you!',
    ),
    input: {
      heading: _('Telefonnummer', 'Phone number'),
      label: _('+47', '+47'),
      placeholder: _('Skriv inn ditt telefonnummer', 'Type your phone number'),
    },
    mainButton: _('Send engangskode', 'Send one time code'),
    errors: {
      invalid_phone: _(
        'Er du sikker på at telefonnummeret er korrekt?',
        'Are you certain the phone number is correct?',
      ),
      unknown_error: _(
        'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
        'Whoops - something went wrong. Please try again 🤞',
      ),
    },
  },
  confirmCode: {
    title: _('Bekreft kode', 'Confirm code'),
    description: (phoneNumber: string) =>
      _(
        `Vi har sendt deg en SMS med engangskode til ${phoneNumber}.`,
        `We have sent you a SMS with a one time code to ${phoneNumber}.`,
      ),
    input: {
      label: _('Engangskode', 'One time code'),
      placeholder: _(
        'Skriv inn koden du fikk tilsendt',
        'Type the one time code sent to you',
      ),
    },
    mainButton: _('Logg inn', 'Sign in'),
    resendButton: _('Send engangskode på nytt', 'Resend the one time code'),
    errors: {
      invalid_phone: _(
        'Er du sikker på at telefonnummeret er korrekt?',
        'Are you certain the phone number is correct?',
      ),
      invalid_code: _(
        'Er du sikker på at engangskoden er korrekt?',
        'Are you certain the one time code is correct?',
      ),
      unknown_error: _(
        'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
        'Whoops - something went wrong. Please try again 🤞',
      ),
    },
  },
  skipLoginWarning: {
    title: _('Er du sikker?', 'Are you sure?'),
    description: _(
      'Hvis du bytter eller mister telefonen vil vi ikke kunne finne fram billettene dine igjen.\n\nDu kan også logge inn senere under "Mitt AtB"',
      'If you switch or lose your phone your tickets will be lost.\n\nYou can also sign in at a later time under "My AtB"',
    ),
    mainButton: _('Godta og gå videre', 'Accept and continue'),
    wantToLoginButton: _('Jeg vil logge inn likevel', 'I want to sign in'),
  },
};
export default LoginTexts;
