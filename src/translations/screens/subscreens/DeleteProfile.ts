import {translation as _} from '../../commons';
const DeleteProfileTexts = {
  header: {
    title: _('Slett Min profil', 'Delete My profile'),
  },
  deleteInfo: _(
    'Når du sletter Min profil mister du tilgang på billett- og kjøpshistorikk, kvitteringer og dine innstillinger.',
    'When deleting My profile you will lose access to recent tickets, receipts and settings',
  ),
  buttonA11ytext: (customerNumber: string | undefined) =>
    _(
      `Aktiver for å slette kundeprofil ${
        customerNumber
          ? 'med kundenummer ' + customerNumber?.split('').join(', ')
          : ''
      }`,

      `Activate to delete customer profile ${
        customerNumber
          ? 'with customer number ' + customerNumber?.split('').join(', ')
          : ''
      }`,
    ),
  unableToDeleteWithFareContracts: _(
    'Kan ikke slette Min profil mens du har aktive billetter. Kontakt AtB kundeservice for refusjon eller vent til billettene har utløpt.',
    'Unable to delete My profile while you have active tickets. Please contact customer support to refund or wait until tickets expire.',
  ),
  customerNumber: _('Kundenummer', 'Customer number'),
  deleteConfirmation: {
    title: _('Slett Min profil', 'Delete My profile'),
    message: _(
      'Dette vil slette brukerprofilen din og alle dine lagrede data.',
      'This will erase you user profile and all your stored data.',
    ),
    confirm: _('OK', 'OK'),
    cancel: _('Avbryt', 'Cancel'),
  },
  deleteError: {
    title: _('Feil ved sletting', 'Error when deleting'),
    message: _(
      'Det oppstod en  feil når vi prøvde å slette Min profil. Prøv igjen senere, og hvis det ikke hjelper, vennligst kontakt kundeservice.',
      'An error occured when we tried deleting My profile. Try again later and if it still does not work, please contact customer service.',
    ),
  },
};

export default DeleteProfileTexts;
