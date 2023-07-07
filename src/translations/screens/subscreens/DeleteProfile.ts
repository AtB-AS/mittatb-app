import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

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
      'An error occurred when we tried deleting My profile. Try again later and if it still does not work, please contact customer service.',
    ),
  },
};

export default orgSpecificTranslations(DeleteProfileTexts, {
  nfk: {
    unableToDeleteWithFareContracts: _(
      'Kan ikke slette Min profil mens du har aktive billetter. Kontakt Reis Nordland kundeservice for refusjon eller vent til billettene har utløpt.',
      'Unable to delete My profile while you have active tickets. Please contact Reis Nordland customer support for refund or wait until tickets expire.',
    ),
  },
  fram: {
    unableToDeleteWithFareContracts: _(
      'Kan ikke slette din bruker mens du har aktive billetter. Kontakt FRAM Kundesenter for refusjon eller vent til billettene har utløpt.',
      'Unable to delete your user while you have active tickets. Please contact FRAM Customer Centre for refund or wait until tickets expire.',
    ),
    header: {
      title: _('Slett min bruker', 'Delete my user'),
    },
    deleteInfo: _(
      'Når du sletter din bruker mister du tilgang på billett- og kjøpshistorikk, kvitteringer og dine innstillinger.',
      'When deleting your user you will lose access to recent tickets, receipts and settings',
    ),
    buttonA11ytext: (customerNumber: string | undefined) =>
      _(
        `Aktiver for å slette brukeren ${
          customerNumber
            ? 'med kundenummer ' + customerNumber?.split('').join(', ')
            : ''
        }`,

        `Activate to delete user ${
          customerNumber
            ? 'with customer number ' + customerNumber?.split('').join(', ')
            : ''
        }`,
      ),
    deleteConfirmation: {
      title: _('Slett min bruker', 'Delete my user'),
      message: _(
        'Dette vil slette brukeren din og alle dine lagrede data.',
        'This will erase you user and all your stored data.',
      ),
    },
    deleteError: {
      message: _(
        'Det oppstod en feil når vi prøvde å slette din bruker. Prøv igjen senere, og hvis det ikke hjelper, vennligst kontakt kundeservice.',
        'An error occurred when we tried deleting your user. Try again later and if it still does not work, please contact customer service.',
      ),
    },
  },
});
