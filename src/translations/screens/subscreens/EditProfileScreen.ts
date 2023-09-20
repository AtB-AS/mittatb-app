import {translation as _} from '@atb/translations';

export const EditProfileTexts = {
  header: {
    title: _('Rediger Min profil', 'Edit My profile', ''),
  },
  personalia: {
    header: _('Personalia', 'Personalia', ''),
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
  },
  customerNumber: _('Kundenummer', 'Customer number', 'Kundenummer'),
  otp: (phoneNumber: string | undefined) =>
    _(
      `Engangspassord på SMS til ${phoneNumber}`,
      `One-time password on SMS til ${phoneNumber}`,
      '',
    ),

  save: _('Lagre', 'Save', 'Lagre'),
  deleteProfile: _('Slett Min profil', 'Delete My profile', 'Slett Min profil'),
};
