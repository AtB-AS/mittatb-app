import {translation as _} from '../../commons';
const LoginTexts = {
  phoneInput: {
    title: _('Logg inn', 'Sign in'),
    description: _('Telefonnummer', 'Phone number'),
    input: {
      label: _('+47', '+47'),
      placeholder: _('Telefonnummer', 'Phone number'),
    },
    mainButton: _('Neste', 'Next'),
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
    title: _('Logg inn', 'Sign in'),
    description: (phoneNumber: string) =>
      _(
        `Vi har sendt en engangskode på SMS til ${phoneNumber}, vennligst skriv den inn nedenfor for å logge inn`,
        `We have sent a one time code by SMS to ${phoneNumber}, please write it below to log in`,
      ),
    input: {
      label: _('Engangskode', 'One time code'),
      placeholder: _(
        "Skriv inn engangskoden fra SMS'en",
        'Type the one time code from the SMS',
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
};
export default LoginTexts;
