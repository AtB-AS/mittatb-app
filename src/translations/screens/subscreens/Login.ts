import {translation as _} from '../../commons';
const LoginTexts = {
  onboarding: {
    title: _(
      'Nå kan du kjøpe periodebilletter!',
      'Period tickets – available now!',
    ),
    description: _(
      'Når du logger inn kan du kjøpe periodebilletter på 7, 30 eller 180 dagers varighet.',
      'Log in to purchase 7, 30 or 180-day tickets.',
    ),
    button: _('Ta meg til innlogging', 'Take me to login'),
    laterButton: _('Jeg vil logge inn senere', 'I want to log in later'),
    carrotTitle: _('Det er lurt å logge inn', 'Smart travellers log in...'),
    carrotBody: _(
      'Da kan du også lagre betalingskort og etter hvert andre smarte reiseting slik at du enkelt finner dem igjen – selv ved bytte av mobil.',
      '...to store payment cards for later use. Soon, login will store personal preferences to your profile so that you can carry them with you when swapping phones.',
    ),
  },
  phoneInput: {
    title: _('Logg inn', 'Log in'),
    description: _(
      'Logg inn med engangskode sendt til din mobil',
      'Log in with a one-time code sent to your mobile',
    ),
    input: {
      heading: _('Mobilnummer', 'Mobile number'),
      label: _('+47', '+47'),
      placeholder: _('Skriv inn ditt telefonnummer', 'Type your mobile number'),
    },
    mainButton: _('Send engangskode', 'Send one-time code'),
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
    title: _('Skriv inn engangskoden', 'Enter your one-time code'),
    description: (phoneNumber: string) =>
      _(
        `Vi har sendt en engangskode til ${phoneNumber}`,
        `We just sent a one-time code to ${phoneNumber}`,
      ),
    input: {
      label: _('Engangskode', 'One-time code'),
      placeholder: _('Skriv inn engangskoden', 'Enter your one-time code'),
    },
    mainButton: _('Logg inn', 'Log in'),
    resendButton: _('Send engangskode på nytt', 'Request new one-time code'),
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
