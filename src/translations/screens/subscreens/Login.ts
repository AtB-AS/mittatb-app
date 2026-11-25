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
    termsConsent: {
      prefix: _(
        'Ved å fortsette godtar du ',
        'By continuing, you accept the ',
        'Ved å halde fram godtek du ',
      ),
      link: _('vilkårene for bruk', 'terms of use', 'vilkåra for bruk'),
      suffix: _('.', '.', '.'),
    },
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
      otherMethods: {
        hint: {
          withVipps: _(
            'Har du brukt Vipps eller telefonnummer før?',
            'Have you used Vipps or your phone number before?',
            'Har du brukt Vipps eller telefonnummer før?',
          ),
          phoneOnly: _(
            'Har du brukt telefonnummer før?',
            'Have you used your phone number before?',
            'Har du brukt telefonnummer før?',
          ),
        },
        link: {
          withVipps: _(
            'Logg inn med Vipps eller telefonnummer',
            'Log in with Vipps or phone number',
            'Logg inn med Vipps eller telefonnummer',
          ),
          phoneOnly: _(
            'Logg inn med telefonnummer',
            'Log in with phone number',
            'Logg inn med telefonnummer',
          ),
        },
        a11yLabel: {
          withVipps: _(
            'Har du brukt Vipps eller telefonnummer før? Logg inn med Vipps eller telefonnummer',
            'Have you used Vipps or your phone number before? Log in with Vipps or phone number',
            'Har du brukt Vipps eller telefonnummer før? Logg inn med Vipps eller telefonnummer',
          ),
          phoneOnly: _(
            'Har du brukt telefonnummer før? Logg inn med telefonnummer',
            'Have you used your phone number before? Log in with phone number',
            'Har du brukt telefonnummer før? Logg inn med telefonnummer',
          ),
        },
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
  logInOtherMethods: {
    title: _(
      'Andre innloggingsmetoder',
      'Other login methods',
      'Andre innloggingsmetodar',
    ),
    description: _(
      'Logg inn på samme måte som før for å beholde billettene og profilen din.',
      'Log in the same way as before to keep your tickets and profile.',
      'Logg inn på same måte som før for å behalde billettane og profilen din.',
    ),
    phone: {
      label: _(
        'Fortsett med telefonnummer',
        'Continue with phone number',
        'Hald fram med telefonnummer',
      ),
      a11yHint: _(
        'Logg inn med en engangskode på SMS',
        'Log in with a one-time code sent by SMS',
        'Logg inn med ein eingongskode på SMS',
      ),
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
    headers: {
      createAccount: _('Opprett konto', 'Create account', 'Opprett konto'),
      resetPassword: _(
        'Tilbakestill passord',
        'Reset password',
        'Tilbakestill passord',
      ),
    },
    passwordToggle: {
      show: _('Vis', 'Show', 'Vis'),
      hide: _('Skjul', 'Hide', 'Skjul'),
      showA11yLabel: _('Vis passord', 'Show password', 'Vis passord'),
      hideA11yLabel: _('Skjul passord', 'Hide password', 'Skjul passord'),
    },
    input: {
      title: _(
        'Logg inn eller opprett konto',
        'Log in or create account',
        'Logg inn eller opprett konto',
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
      federated: (provider: string) =>
        _(
          `Du har tidligere brukt ${provider} med denne e-postadressen. Lag et passord for å logge inn med e-post.`,
          `You've previously used ${provider} with this e-mail address. Create a password to log in with e-mail.`,
          `Du har tidlegare brukt ${provider} med denne e-postadressa. Lag eit passord for å logge inn med e-post.`,
        ),
      federatedUnknown: _(
        'Denne e-postadressen er koblet til en annen innloggingsmetode. Lag et passord for å logge inn med e-post.',
        'This e-mail address is connected to another login method. Create a password to log in with e-mail.',
        'Denne e-postadressa er kopla til ein annan innloggingsmetode. Lag eit passord for å logge inn med e-post.',
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
      changeEmail: _(
        'Ikke deg? Bytt e-post',
        'Not you? Change e-mail',
        'Ikkje deg? Byt e-post',
      ),
    },
    createPassword: {
      signUpTitle: _('Lag et passord', 'Create a password', 'Lag eit passord'),
      resetTitle: _(
        'Velg nytt passord',
        'Choose a new password',
        'Vel nytt passord',
      ),
      emailLabel: _('E-post', 'E-mail', 'E-post'),
      label: _('Passord', 'Password', 'Passord'),
      placeholder: _('Velg et passord', 'Choose a password', 'Vel eit passord'),
      lengthHint: (minLength: number) =>
        _(
          `Minst ${minLength} tegn`,
          `At least ${minLength} characters`,
          `Minst ${minLength} teikn`,
        ),
      lengthHintMet: (minLength: number) =>
        _(
          `Minst ${minLength} tegn, oppfylt`,
          `At least ${minLength} characters, met`,
          `Minst ${minLength} teikn, oppfylt`,
        ),
      signUpButton: _('Opprett konto', 'Create account', 'Opprett konto'),
      resetButton: _('Lagre passord', 'Save password', 'Lagre passord'),
      newCodeButton: _(
        'Send meg en ny kode',
        'Send me a new code',
        'Send meg ein ny kode',
      ),
    },
    confirmCode: {
      description: (email: string) =>
        _(
          `Vi sendte en kode til ${email}.`,
          `We sent a code to ${email}.`,
          `Vi sende ein kode til ${email}.`,
        ),
      verifyDescription: (email: string) =>
        _(
          `E-postadressen din er ikke bekreftet. Vi sendte en kode til ${email}.`,
          `Your e-mail address is not verified. We sent a code to ${email}.`,
          `E-postadressa di er ikkje stadfesta. Vi sende ein kode til ${email}.`,
        ),
      hint: _(
        'Koden er gyldig i 15 minutter. Finner du den ikke, sjekk søppelpost.',
        "The code is valid for 15 minutes. If you can't find it, check your spam folder.",
        'Koden er gyldig i 15 minutt. Finn du han ikkje, sjekk søppelpost.',
      ),
      signUpNotice: (email: string) =>
        _(
          `Vi fant ingen konto for ${email}, så vi oppretter en ny.`,
          `We found no account for ${email}, so we'll create a new one.`,
          `Vi fann ingen konto for ${email}, så vi opprettar ein ny.`,
        ),
      changeEmail: _(
        'Feil e-post? Bytt',
        'Wrong e-mail? Change',
        'Feil e-post? Byt',
      ),
      resend: _('Send ny kode', 'Send new code', 'Send ny kode'),
      resendIn: (countdown: string) =>
        _(
          `Send ny kode om ${countdown}`,
          `Send new code in ${countdown}`,
          `Send ny kode om ${countdown}`,
        ),
    },
    errors: {
      invalid_email: _(
        'Er du sikker på at e-postadressen er riktig?',
        'Are you certain the e-mail address is correct?',
        'Er du sikker på at e-postadressa er riktig?',
      ),
      wrong_credentials: _('Feil passord.', 'Wrong password.', 'Feil passord.'),
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
        'For mange feil forsøk med denne koden. Be om en ny kode.',
        'Too many wrong attempts with this code. Request a new code.',
        'For mange feil forsøk med denne koden. Be om ein ny kode.',
      ),
      too_many_codes_sent: _(
        'Du har bedt om for mange koder. Vent noen minutter og prøv igjen.',
        "You've requested too many codes. Wait a few minutes and try again.",
        'Du har bede om for mange kodar. Vent nokre minutt og prøv igjen.',
      ),
      login_locked: _(
        'For mange forsøk. Prøv igjen om 15 minutter, eller tilbakestill passordet ditt.',
        'Too many attempts. Try again in 15 minutes, or reset your password.',
        'For mange forsøk. Prøv igjen om 15 minutt, eller tilbakestill passordet ditt.',
      ),
      session_lost: _(
        'Noe gikk galt underveis. Vennligst start på nytt.',
        'Something went wrong along the way. Please start again.',
        'Noko gjekk gale undervegs. Ver venleg og start på nytt.',
      ),
      password_lost: _(
        'Skriv inn passordet ditt på nytt for å fortsette.',
        'Enter your password again to continue.',
        'Skriv inn passordet ditt på nytt for å halde fram.',
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
