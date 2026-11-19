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
    termsOfUse: _('Vilkår for bruk', 'Terms of use', 'Vilkår for bruk'),
    options: {
      phoneAndCode: {
        label: _(
          'Engangskode på SMS',
          'One-time code via SMS',
          'Eingongskode på SMS',
        ),
        a11yLabel: _(
          'Engangskode på SMS',
          'One-time code via SMS',
          'Eingongskode på SMS',
        ),
      },
      email: {
        label: _(
          'Fortsett med e-post',
          'Continue with e-mail',
          'Hald fram med e-post',
        ),
        a11yLabel: _(
          'Fortsett med e-post og passord',
          'Continue with e-mail and password',
          'Hald fram med e-post og passord',
        ),
      },
      moreOptions: {
        show: _('Flere alternativer', 'More options', 'Fleire alternativ'),
        hide: _('Færre alternativer', 'Fewer options', 'Færre alternativ'),
      },
      vipps: {
        label: _('Fortsett med ', 'Log in with ', 'Hald fram med '),
        a11yLabel: _(
          'Fortsett med Vipps',
          'Log in with Vipps',
          'Hald fram med Vipps',
        ),
      },
      anonymous: {
        label: _(
          'Fortsett uten å logge inn',
          'Use the app anonymously',
          'Hald fram utan å logge inn',
        ),
        a11yLabel: _(
          'Fortsett uten å logge inn',
          'Use the app anonymously',
          'Hald fram utan å logge inn',
        ),
      },
    },
  },
  terms: {
    title: _('Betingelser', 'Terms', 'Vilkår'),
  },
  availableFareContractPrompt: {
    header: _('Logg inn', 'Log in', 'Logg inn'),
    title: _(
      'Billetten din slettes ved innlogging',
      'Your ticket will be deleted upon logging in',
      'Billetten din slettast ved innlogging',
    ),
    body: _(
      'Billetten din kan ikke overføres til en profil, fordi den er kjøpt anonymt. Vent med å logge inn til billetten utløper, for å unngå at den blir slettet. Slettede billetter **refunderes ikke.**',
      'Your ticket cannot be transferred to a profile because it was purchased anonymously. Please wait until it expires before you log in, to avoid deletion. Deleted tickets are **non-refundable.**',
      'Billetten din kan ikkje overførast til ein profil, sidan den vart kjøpt anonymt. Vent med å logge inn til billetten går ut, for å unngå at den blir sletta. Sletta billettar blir **ikkje refunderte.**',
    ),
    ticketReservationBody: _(
      'Billetten din er under behandling og kan ikke overføres til en profil, fordi den er kjøpt anonymt. Vent med å logge inn til billetten er behandlet og utløpt, for å unngå at den blir slettet. Slettede billetter **refunderes ikke.**',
      'Your ticket is being processed and cannot be transferred to a profile because it was purchased anonymously. Please wait until processing is finished and it expires before you log in, to avoid deletion. Deleted tickets are **non-refundable.**',
      'Billetten din er under behandling og kan ikkje overførast til ein profil, sidan den vart kjøpt anonymt. Vent med å logge inn til billetten er behandla og går ut, for å unngå at den blir sletta. Sletta billettar blir **ikkje refunderte.**',
    ),
    logInAndDeleteButton: _(
      'Logg inn og slett',
      'Log in and delete',
      'Logg inn og slett',
    ),
    cancelButton: _('Avbryt', 'Cancel', 'Avbryt'),
  },
  onboarding: {
    title: _(
      'Logg inn for å kjøpe',
      'Log in to purchase',
      'Logg inn for å kjøpe',
    ),
    description: _(
      'Denne billetten krever at du er innlogget for å kunne kjøpe.',
      'This ticket requires that you are logged in to purchase.',
      'Denne billetten krev at du er innlogga for å kunne kjøpe.',
    ),
    button: _('Logg inn', 'Log in', 'Logg inn'),
    laterButton: _('Avbryt', 'Cancel', 'Avbryt'),
    carrotTitle: _(
      'Det er lurt å logge inn',
      'Smart travellers log in...',
      'Det er lurt å logge inn',
    ),
    carrotBody: _(
      'Da kan du også lagre betalingskort og etter hvert andre smarte reiseting slik at du enkelt finner dem igjen – selv ved bytte av mobil.',
      '...to store payment cards for later use. Soon, login will store personal preferences to your profile so that you can carry them with you when swapping phones.',
      'Då kan du også lagre betalingskort og etter kvart andre smarte reiseting slik at du enkelt finn dei igjen – sjølv ved byte av mobil.',
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
        'Klarte ikke å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
        "Couldn't log you in. Please try again or contact customer service for assistance.",
        'Klarte ikkje å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
      ),
    },
  },
  phoneInput: {
    title: _('Logg inn', 'Log in', 'Logg inn'),
    description: _(
      'Logg inn med engangskode sendt til din mobil',
      'Log in with a one-time code sent to your phone',
      'Logg inn med eingongskode sendt til din mobil',
    ),
    mainButton: _(
      'Send engangskode',
      'Send one-time code',
      'Send eingongskode',
    ),
  },
  confirmCode: {
    title: _('Engangskode', 'One-time code', 'Eingongskode'),
    description: (phoneNumber: string) =>
      _(
        `Skriv inn engangskoden vi sendte til ${phoneNumber}`,
        `Enter the one-time code we sent to ${phoneNumber}`,
        `Skriv inn eingongskoden vi sendte til ${phoneNumber}`,
      ),
    input: {
      label: _('Engangskode', 'One-time code', 'Eingongskode'),
      placeholder: _(
        'Skriv inn engangskoden',
        'Enter your one-time code',
        'Skriv inn eingongskoden',
      ),
    },
    mainButton: _('Logg inn', 'Log in', 'Logg inn'),
    resendButton: _(
      'Send engangskode på nytt',
      'Request new one-time code',
      'Send eingongskode på nytt',
    ),
    errors: {
      invalid_phone: _(
        'Er du sikker på at telefonnummeret er korrekt?',
        'Are you certain the phone number is correct?',
        'Er du sikker på at telefonnummeret er korrekt?',
      ),
      invalid_code: _(
        'Engangskoden er ugyldig. Sjekk at den er riktig, eller be om en ny.',
        'The one-time code is invalid. Ensure that it is correct, or request a new one.',
        'Eingongskoden er ugyldig. Sjekk at den er riktig, eller be om ein ny.',
      ),
      session_expired: _(
        'Engangskoden har utløpt. Vennligst be om en ny.',
        'The one-time code has expired. Please request a new one.',
        'Eingongskoden har gått ut. Ver venleg og be om ein ny.',
      ),
      unknown_error: _(
        'Klarte ikke å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
        "Couldn't log you in. Please try again or contact customer service for assistance.",
        'Klarte ikkje å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
      ),
      too_many_attempts: _(
        'Du har prøvd for mange ganger. Vennligst vent litt før du prøver igjen.',
        'You have tried too many times. Please wait a bit before trying again.',
        'Du har prøvd for mange gonger. Ver venleg og vent litt før du prøver igjen.',
      ),
    },
  },
  email: {
    input: {
      title: _(
        'Logg inn med e-post',
        'Log in with e-mail',
        'Logg inn med e-post',
      ),
      description: _(
        'Skriv inn e-postadressen din. Har du ikke konto, lager vi en til deg.',
        "Enter your e-mail address. If you don't have an account, we'll create one for you.",
        'Skriv inn e-postadressa di. Har du ikkje konto, lagar vi ein til deg.',
      ),
      label: _('E-post', 'E-mail', 'E-post'),
      placeholder: _(
        'Skriv inn e-postadressen din',
        'Enter your e-mail address',
        'Skriv inn e-postadressa di',
      ),
      mainButton: _('Fortsett', 'Continue', 'Hald fram'),
      federated: (providers: string) =>
        _(
          `Denne e-postadressen brukes med ${providers}. Logg inn med ${providers}, eller lag et passord.`,
          `This e-mail address is used with ${providers}. Log in with ${providers}, or create a password.`,
          `Denne e-postadressa blir brukt med ${providers}. Logg inn med ${providers}, eller lag eit passord.`,
        ),
      createPasswordButton: _('Lag passord', 'Create password', 'Lag passord'),
    },
    password: {
      title: _('Skriv inn passord', 'Enter password', 'Skriv inn passord'),
      description: (email: string) =>
        _(
          `Logg inn som ${email}`,
          `Log in as ${email}`,
          `Logg inn som ${email}`,
        ),
      label: _('Passord', 'Password', 'Passord'),
      placeholder: _(
        'Skriv inn passordet ditt',
        'Enter your password',
        'Skriv inn passordet ditt',
      ),
      mainButton: _('Logg inn', 'Log in', 'Logg inn'),
      forgotPassword: _(
        'Glemt passord?',
        'Forgot password?',
        'Gløymt passord?',
      ),
    },
    createPassword: {
      signUpTitle: _('Lag et passord', 'Create a password', 'Lag eit passord'),
      resetTitle: _(
        'Velg nytt passord',
        'Choose a new password',
        'Vel nytt passord',
      ),
      description: (minLength: number) =>
        _(
          `Passordet må ha minst ${minLength} tegn.`,
          `The password must have at least ${minLength} characters.`,
          `Passordet må ha minst ${minLength} teikn.`,
        ),
      label: _('Passord', 'Password', 'Passord'),
      placeholder: _('Velg et passord', 'Choose a password', 'Vel eit passord'),
      mainButton: _('Fortsett', 'Continue', 'Hald fram'),
    },
    confirmCode: {
      description: (email: string) =>
        _(
          `Skriv inn engangskoden vi sendte til ${email}`,
          `Enter the one-time code we sent to ${email}`,
          `Skriv inn eingongskoden vi sende til ${email}`,
        ),
      verifyDescription: (email: string) =>
        _(
          `E-postadressen din er ikke bekreftet. Skriv inn engangskoden vi sendte til ${email}`,
          `Your e-mail address is not verified. Enter the one-time code we sent to ${email}`,
          `E-postadressa di er ikkje stadfesta. Skriv inn eingongskoden vi sende til ${email}`,
        ),
    },
    errors: {
      invalid_email: _(
        'Er du sikker på at e-postadressen er riktig?',
        'Are you certain the e-mail address is correct?',
        'Er du sikker på at e-postadressa er riktig?',
      ),
      wrong_credentials: _(
        'Feil e-post eller passord.',
        'Wrong e-mail or password.',
        'Feil e-post eller passord.',
      ),
      email_not_verified: _(
        'E-postadressen er ikke bekreftet.',
        'The e-mail address is not verified.',
        'E-postadressa er ikkje stadfesta.',
      ),
      weak_password: _(
        'Passordet må ha mellom 8 og 128 tegn.',
        'The password must have between 8 and 128 characters.',
        'Passordet må ha mellom 8 og 128 teikn.',
      ),
      invalid_code: _(
        'Engangskoden er ugyldig. Sjekk at den er riktig, eller be om en ny.',
        'The one-time code is invalid. Ensure that it is correct, or request a new one.',
        'Eingongskoden er ugyldig. Sjekk at den er riktig, eller be om ein ny.',
      ),
      session_expired: _(
        'Engangskoden har utløpt. Vennligst be om en ny.',
        'The one-time code has expired. Please request a new one.',
        'Eingongskoden har gått ut. Ver venleg og be om ein ny.',
      ),
      user_exists: _(
        'Det finnes allerede en konto med denne e-postadressen.',
        'An account with this e-mail address already exists.',
        'Det finst allereie ein konto med denne e-postadressa.',
      ),
      too_many_attempts: _(
        'Du har prøvd for mange ganger. Vennligst vent litt før du prøver igjen.',
        'You have tried too many times. Please wait a bit before trying again.',
        'Du har prøvd for mange gonger. Ver venleg og vent litt før du prøver igjen.',
      ),
      unknown_error: _(
        'Klarte ikke å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
        "Couldn't log you in. Please try again or contact customer service for assistance.",
        'Klarte ikkje å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
      ),
    },
  },
  skipLoginWarning: {
    title: _('Er du sikker?', 'Are you sure?', 'Er du sikker?'),
    description: _(
      'Hvis du bytter eller mister telefonen vil vi ikke kunne finne fram billettene dine igjen.\n\nDu kan også logge inn senere under "Profil"',
      'If you switch or lose your phone your tickets will be lost.\n\nYou can also log in at a later time under "Profile"',
      'Viss du bytter eller mister telefonen vil vi ikkje kunne finne billettane dine att. \n\nDu kan også logge inn seinare under "Profil"',
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
    availableFareContractPrompt: {
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
