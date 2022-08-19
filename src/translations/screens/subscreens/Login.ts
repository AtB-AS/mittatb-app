import orgSpecificTranslations from '@atb/translations/utils';
import {translation as _} from '../../commons';
const LoginTexts = {
  logInOptions: {
    title: _('Logg inn', 'Log in'),
    selectLoginMethod: _('Velg innloggingsmetode', 'Select login method'),
    or: _('Eller logg inn med', 'or Log in with'),
    options: {
      phoneAndCode: _(
        'Mobilnummer og engangskode',
        'Mobile number and one-time code',
      ),
      vipps: {
        label: _('Logg inn med ', 'Log in with '),
        a11yLabel: _('Logg inn med Vipps', 'Log in with Vipps'),
      },
    },
  },
  activeTicketPrompt: {
    title: _(
      'Vent litt, du har en gyldig billett',
      'Wait a sec – you have a valid ticket',
    ),
    body: _(
      'Billetten kan **ikke** overføres til din profil og vil slettes ved innlogging. Dersom du trenger billetten, vent til den er utløpt **før** du logger inn.',
      'This ticket can **not** be transferred to your profile, and will be deleted upon login. If you need the ticket, wait until it has expired **before** logging in.',
    ),
    laterButton: _('Logg inn senere', 'Log in later'),
    continueButton: _('Jeg vil logge inn likevel', 'I want to log in anyway'),
  },
  onboarding: {
    title: _(
      'Nå kan du kjøpe periodebilletter!',
      'Periodic tickets – available now!',
    ),
    description: _(
      'Når du logger inn kan du kjøpe periodebilletter på 7, 30, 60, 90 eller 180 dagers varighet.',
      'Log in to purchase 7, 30, 60, 90 or 180-day tickets.',
    ),
    button: _('Ta meg til innlogging', 'Take me to login'),
    laterButton: _('Jeg vil logge inn senere', 'I want to log in later'),
    carrotTitle: _('Det er lurt å logge inn', 'Smart travellers log in...'),
    carrotBody: _(
      'Da kan du også lagre betalingskort og etterhvert andre smarte reiseting slik at du enkelt finner dem igjen – selv ved bytte av mobil.',
      '...to store payment cards for later use. Soon, login will store personal preferences to your profile so that you can carry them with you when swapping phones.',
    ),
  },
  vipps: {
    errors: {
      outdated_app_version: _(
        'Er du sikker på at telefonnummeret er korrekt?',
        'Are you certain the phone number is correct?',
      ),
      unknown_error: _(
        'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
        'Whoops - something went wrong. Please try again 🤞',
      ),
    },
  },
  phoneInput: {
    title: _('Logg inn', 'Log in'),
    description: _(
      'Logg inn med engangskode sendt til din mobil',
      'Log in with a one-time code sent to your phone',
    ),
    input: {
      heading: _('Mobilnummer', 'phone number'),
      label: _('+47', '+47'),
      placeholder: _(
        'Skriv inn ditt telefonnummer',
        'Type in your phone number',
      ),
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
      'Hvis du bytter eller mister telefonen vil vi ikke kunne finne fram billettene dine igjen.\n\nDu kan også logge inn senere under "Min profil"',
      'If you switch or lose your phone your tickets will be lost.\n\nYou can also log in at a later time under "My profile"',
    ),
    mainButton: _('Godta og gå videre', 'Accept and continue'),
    wantToLoginButton: _('Jeg vil logge inn likevel', 'I want to log in'),
  },
};
export default LoginTexts;
