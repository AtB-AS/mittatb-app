import {translation as _} from '@atb/translations';

export const EditProfileTexts = {
  header: {
    title: _('Rediger Min profil', 'Edit My profile', 'Rediger Min profil'),
  },
  notProfile: _(
    'Det virker ikke som du er logget inn. Vennligst opprett en profil og logg inn.',
    'Looks like you are not logged in. Please create a profile and log in.',
    'Det verkar ikkje som du er logga inn. Ver venleg, lag ein profil og logg inn.',
  ),
  personalDetails: {
    header: _('Personalia', 'Personal details', 'Personalia'),
    firstName: {
      label: _('Fornavn', 'First name', 'Fornamn'),
      placeholder: _('Legg til fornavn', 'Add first name', 'Legg til fornamn'),
    },
    surname: {
      label: _('Etternavn', 'Surname', 'Etternamn'),
      placeholder: _('Legg til etternavn', 'Add surname', 'Legg til etternamn'),
    },
    phone: {
      header: _('Telefon', 'Phone', 'Telefon'),
      loggedIn: (phoneNumber: string | undefined) =>
        _(
          `${phoneNumber} kan ikke endres fordi telefonnummeret er brukt til innlogging`,
          `${phoneNumber} cannot be changed because the phone number is used for logging in.`,
          `${phoneNumber} kan ikkje endrast, fordi telefonnummeret ditt er brukt til innlogging.`,
        ),
    },
    email: {
      label: _('E-postadresse', 'E-mail address', 'E-postadresse'),
      placeholder: _(
        'Legg til e-post',
        'Add e-mail address',
        'Legg til e-post',
      ),
      formattingError: _(
        'Feil formatering',
        'Wrong formatting',
        'Feil formatering',
      ),
      unavailableError: _(
        'E-postadressen er allerede i bruk',
        'The e-mail address is already in use',
        'E-postadressen er allereie i bruk',
      ),
    },
    error: _(
      'Vi får ikke hentet profilinformasjonen din akkurat nå. Prøv igjen senere.',
      'We are not able to retrieve your profile information at the moment. Please try again later',
      'Vi får ikkje henta profilinformasjonen din akkurat no. Ver venleg og prøv igjen.',
    ),
  },
  profileInfo: {
    customerNumber: _('Kundenummer', 'Customer number', 'Kundenummer'),
    profile: _('Om profilen', 'About profile', 'Om profilen'),
    loginProvider: _(
      'Innloggingsmetode',
      'Log in provider',
      'Innloggingsmetode',
    ),
    otp: (phoneNumber: string | undefined) =>
      _(
        `Engangspassord på SMS til ${phoneNumber}`,
        `One-time password on SMS to ${phoneNumber}`,
        `Eingongspassord på SMS til ${phoneNumber}`,
      ),
  },
  button: {
    save: _('Lagre', 'Save', 'Lagre'),
    deleteProfile: _(
      'Slett Min profil',
      'Delete My profile',
      'Slett Min profil',
    ),
  },
  profileUpdate: {
    success: _('Profil oppdatert.', 'Profile updated.', 'Profil oppdatert.'),
    error: _(
      'Vi fikk ikke til å oppdatere din profil. Vennligst prøv igjen.',
      'We could not update you profile. Please try again.',
      'Vi klarte ikkje å oppdatere profilen din. Ver venleg og prøv igjen.',
    ),
  },
};
