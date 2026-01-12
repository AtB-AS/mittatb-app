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
        'Vi klarte ikke å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
        'We couldn’t log you in. Please try again or contact customer service for assistance.',
        'Vi klarte ikkje å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
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
        'Vi klarte ikke å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
        'We couldn’t log you in. Please try again or contact customer service for assistance.',
        'Vi klarte ikkje å logge deg inn. Prøv igjen, eller kontakt kundeservice for hjelp.',
      ),
      too_many_attempts: _(
        'Du har prøvd for mange ganger. Vennligst vent litt før du prøver igjen.',
        'You have tried too many times. Please wait a bit before trying again.',
        'Du har prøvd for mange gonger. Ver venleg og vent litt før du prøver igjen.',
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
