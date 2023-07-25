import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';

const LoginTexts = {
  logInOptions: {
    title: _('Logg inn', 'Log in', 'Logg inn'),
    selectLoginMethod: _(
      'Velg innloggingsmetode',
      'Select login method',
      'Vel innloggingsmetode',
    ),
    or: _('Eller logg inn med', 'Or log in with', 'Eller logg inn med'),
    options: {
      phoneAndCode: _(
        'Mobilnummer og engangskode',
        'Mobile number and one-time code',
        'Mobilnummer og engangskode',
      ),
      vipps: {
        label: _('Logg inn med ', 'Log in with ', 'Logg inn med '),
        a11yLabel: _(
          'Logg inn med Vipps',
          'Log in with Vipps',
          'Logg inn med Vipps',
        ),
      },
    },
  },
  activeFareContractPrompt: {
    title: _(
      'Vent litt, du har en gyldig billett',
      'Wait a sec – you have a valid ticket',
      'Vent litt, du har ein gyldig billett',
    ),
    body: _(
      'Billetten kan **ikke** overføres til din profil og vil slettes ved innlogging. Dersom du trenger billetten, vent til den er utløpt **før** du logger inn.',
      'This ticket can **not** be transferred to your profile, and will be deleted upon login. If you need the ticket, wait until it has expired **before** logging in.',
      'Billetten kan **ikkje** overførast til din profil og vil slettast ved innlogging. Dersom du treng billetten, vent til den er gått ut **før** du loggar inn.',
    ),
    laterButton: _('Logg inn senere', 'Log in later', 'Logg inn seinare'),
    continueButton: _(
      'Jeg vil logge inn likevel',
      'I want to log in anyway',
      'Eg vil logge inn likevel',
    ),
  },
  onboarding: {
    title: _(
      'Logg inn for å kjøpe!',
      'Log in to purchase!',
      'Logg inn for å kjøpe!',
    ),
    description: _(
      'Denne billetten krever at du er innlogget for å kunne kjøpe.',
      'This ticket requires that you are logged in to purchase.',
      'Denne billetten krev at du er innlogga for å kunne kjøpe.',
    ),
    button: _(
      'Ta meg til innlogging',
      'Take me to login',
      'Ta meg til innlogging',
    ),
    laterButton: _(
      'Jeg vil logge inn senere',
      'I want to log in later',
      'Eg vil logge inn seinare',
    ),
    carrotTitle: _(
      'Det er lurt å logge inn',
      'Smart travellers log in...',
      'Det er lurt å logge inn',
    ),
    carrotBody: _(
      'Da kan du også lagre betalingskort og etterhvert andre smarte reiseting slik at du enkelt finner dem igjen – selv ved bytte av mobil.',
      '...to store payment cards for later use. Soon, login will store personal preferences to your profile so that you can carry them with you when swapping phones.',
      'Då kan du også lagre betalingskort og etterhvert andre smarte reiseting slik at du enkelt finn dei igjen – sjølv ved byte av mobil.',
    ),
  },
  vipps: {
    errors: {
      outdated_app_version: _(
        'Oppdater Vipps-appen før du bruker den til å logge inn.',
        'Please update the Vipps app before using it to log in.',
        'Oppdater Vipps-appen før du bruker den til å logge inn.',
      ),
      unknown_error: _(
        'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
        'Whoops - something went wrong. Please try again 🤞',
        'Oops - noko gjekk gale. Supert om du prøver på nytt 🤞',
      ),
    },
  },
  phoneInput: {
    title: _('Logg inn', 'Log in', 'Logg inn'),
    description: _(
      'Logg inn med engangskode sendt til din mobil',
      'Log in with a one-time code sent to your phone',
      'Logg inn med engangskode sendt til din mobil',
    ),
    input: {
      heading: _('Mobilnummer', 'Phone number', 'Mobilnummer'),
      label: _('+47', '+47', '+47'),
      placeholder: _(
        'Skriv inn ditt telefonnummer',
        'Type in your phone number',
        'Skriv inn ditt telefonnummer',
      ),
    },
    mainButton: _('Send engangskode', 'Send one-time code', 'Send engangskode'),
    errors: {
      invalid_phone: _(
        'Er du sikker på at telefonnummeret er korrekt?',
        'Are you certain the phone number is correct?',
        'Er du sikker på at telefonnummeret er korrekt?',
      ),
      unknown_error: _(
        'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
        'Whoops - something went wrong. Please try again 🤞',
        'Oops - noko gjekk gale. Supert om du prøver på nytt 🤞',
      ),
    },
  },
  confirmCode: {
    title: _(
      'Skriv inn engangskoden',
      'Enter your one-time code',
      'Skriv inn engangskoden',
    ),
    description: (phoneNumber: string) =>
      _(
        `Vi har sendt en engangskode til ${phoneNumber}`,
        `We just sent a one-time code to ${phoneNumber}`,
        `Vi har sendt ein engangskode til ${phoneNumber}`,
      ),
    input: {
      label: _('Engangskode', 'One-time code', 'Engangskode'),
      placeholder: _(
        'Skriv inn engangskoden',
        'Enter your one-time code',
        'Skriv inn engangskoden',
      ),
    },
    mainButton: _('Logg inn', 'Log in', 'Logg inn'),
    resendButton: _(
      'Send engangskode på nytt',
      'Request new one-time code',
      'Send engangskode på nytt',
    ),
    errors: {
      invalid_phone: _(
        'Er du sikker på at telefonnummeret er korrekt?',
        'Are you certain the phone number is correct?',
        'Er du sikker på at telefonnummeret er korrekt?',
      ),
      invalid_code: _(
        'Er du sikker på at engangskoden er korrekt?',
        'Are you certain the one time code is correct?',
        'Er du sikker på at engangskoden er korrekt?',
      ),
      unknown_error: _(
        'Oops - noe gikk galt. Supert om du prøver på nytt 🤞',
        'Whoops - something went wrong. Please try again 🤞',
        'Oops - noko gjekk gale. Supert om du prøver på nytt 🤞',
      ),
    },
  },
  skipLoginWarning: {
    title: _('Er du sikker?', 'Are you sure?', 'Er du sikker?'),
    description: _(
      'Hvis du bytter eller mister telefonen vil vi ikke kunne finne fram billettene dine igjen.\n\nDu kan også logge inn senere under "Min profil"',
      'If you switch or lose your phone your tickets will be lost.\n\nYou can also log in at a later time under "My profile"',
      'Viss du bytter eller mister telefonen vil vi ikkje kunne finne billettane dine att. \n\nDu kan også logge inn seinare under "Min profil"',
    ),
    mainButton: _(
      'Godta og gå videre',
      'Accept and continue',
      'Godta og gå vidare',
    ),
    wantToLoginButton: _(
      'Jeg vil logge inn likevel',
      'I want to log in',
      'Eg vil logge inn likevel',
    ),
  },
};

export default orgSpecificTranslations(LoginTexts, {
  fram: {
    activeFareContractPrompt: {
      body: _(
        'Billetten kan **ikke** overføres til din bruker og vil slettes ved innlogging. Dersom du trenger billetten, vent til den er utløpt **før** du logger inn.',
        'This ticket can **not** be transferred to your user, and will be deleted upon login. If you need the ticket, wait until it has expired **before** logging in.',
        'Billetten kan **ikkje** overførast til din brukar, og vil slettast ved innlogging. Om du treng billetten ber vi deg vente til den er gått ut **før** du loggar inn.',
      ),
    },
    skipLoginWarning: {
      description: _(
        'Hvis du bytter eller mister telefonen vil vi ikke kunne finne fram billettene dine igjen.\n\nDu kan også logge inn senere under "Min bruker"',
        'If you switch or lose your phone your tickets will be lost.\n\nYou can also log in at a later time under "My user"',
        'Viss du bytter eller mistar telefonen vil vi ikkje kunne finne billettane dine att. \n\nDu kan også logga inn seinare under "Min brukar"',
      ),
    },
  },
});
