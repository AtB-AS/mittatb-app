import {translation as _} from '@atb/translations';

export const EditProfileTexts = {
  header: {
    title: _('Rediger Min profil', 'Edit My profile', ''),
  },
  notProfile: _(
    'Det virker ikke som du er logget inn',
    'Looks like you are not logged in',
    'Det verkar ikkje som du er logga inn',
  ),
  personalia: {
    header: _('Personalia', 'Personalia', 'Personalia'),
    firstName: {
      label: _('Fornavn', 'First name', ''),
      placeholder: _('Legg til fornavn', 'Add first name', ''),
    },
    surname: {
      label: _('Etternavn', 'Surname', ''),
      placeholder: _('Legg til etternavn', 'Add surname', ''),
    },
    phone: {
      header: _('Telefon', 'Phone', ''),
      loggedIn: (phoneNumber: string | undefined) =>
        _(
          `${phoneNumber} kan ikke endres fordi telefonnummeret er brukt til innlogging`,
          `${phoneNumber} cannot be changed because the phone number is used for logging in.`,
          '',
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
  },
  profileInfo: {
    customerNumber: _('Kundenummer', 'Customer number', 'Kundenummer'),
    profile: _('Om profil', 'About profile', 'Om profil'),
    loginProvider: _(
      'Innlogingsleverandør',
      'Log in provider',
      'Innlogingsleverandør',
    ),
    otp: (phoneNumber: string | undefined) =>
      _(
        `Engangspassord på SMS til ${phoneNumber}`, // Is Engangspassord configurable?
        `One-time password on SMS to ${phoneNumber}`,
        '',
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
      'En feil har skjedd. Profil ble ikke oppdatert.',
      'En error occured. Profile was not updated.',
      '',
    ),
  },
};
