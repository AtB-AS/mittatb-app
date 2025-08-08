import {translation as _} from '@atb/translations';

export const EditProfileTexts = {
  header: {
    title: _('Rediger profil', 'Edit profile', 'Rediger profil'),
  },
  noProfile: _(
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
      loggedIn: (phoneNumber: string) =>
        _(
          `${phoneNumber} kan ikke endres fordi telefonnummeret er brukt til innlogging.`,
          `${phoneNumber} cannot be changed because the phone number is used for logging in.`,
          `${phoneNumber} kan ikkje endrast, fordi telefonnummeret ditt er brukt til innlogging.`,
        ),
    },
    birthdate: {
      header: _('Fødselsdato', 'Birthdate', 'Fødselsdato'),
      info: _(
        'Du har delt fødselsdatoen din med AtB via Vipps og kan trekke tilbake samtykket i Vipps-appen.',
        'You have shared your birthdate with AtB via Vipps and can withdraw your consent in the Vipps app.',
        'Du har delt fødselsdatoa di med AtB via Vipps og kan trekkje attende samtykket i Vipps-appen.',
      ),
      a11yHintLink: _(
        'Gå til Vipps-appen',
        'Go to the Vipps app',
        'Gå til Vipps-appen',
      ),
      link: _('Vipps', 'Vipps', 'Vipps'),
      openVippsError: _(
        'Vipps er ikke installert',
        'Vipps is not installed',
        'Vipps er ikkje installert',
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
        'E-postadressa er allereie i bruk',
      ),
      disabledWithRemoteConfig: _(
        'Appen støtter foreløpig ikke lagring av e-postadresse.',
        'The app currently does not support saving your e-mail address.',
        'Appen støttar førebels ikkje lagring av e-postadresse.',
      ),
    },
    error: _(
      'Vi fikk ikke hentet profilinformasjonen din akkurat nå.',
      'We were not able to retrieve your profile information.',
      'Vi fekk ikkje henta profilinformasjonen din akkurat no.',
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
    deleteProfile: _('Slett Profil', 'Delete Profile', 'Slett Profil'),
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
