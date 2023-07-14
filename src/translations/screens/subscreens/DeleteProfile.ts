import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const DeleteProfileTexts = {
  header: {
    title: _('Slett Min profil', 'Delete My profile', 'Slett Min profil'),
  },
  deleteInfo: _(
    'Når du sletter Min profil mister du tilgang på billett- og kjøpshistorikk, kvitteringer og dine innstillinger.',
    'When deleting My profile you will lose access to recent tickets, receipts and settings',
    'Dersom du sletter Min profil vil du miste tilgang til billett- og kjøpshistorikk, kvitteringar og innstillingane dine.',
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

      `Aktiver for å slette kundeprofil ${
        customerNumber
          ? 'med kundenummer ' + customerNumber?.split('').join(', ')
          : ''
      }`,
    ),
  unableToDeleteWithFareContracts: _(
    'Kan ikke slette Min profil mens du har aktive billetter. Kontakt AtB kundeservice for refusjon eller vent til billettene har utløpt.',
    'Unable to delete My profile while you have active tickets. Please contact customer support to refund or wait until tickets expire.',
    'Det er ikkje mogleg å slette Min profil mens du har aktive billettar. Kontakt AtB kundeservice for refusjon eller vent til billettane har gått ut.',
  ),
  customerNumber: _('Kundenummer', 'Customer number', 'Kundenummer'),
  deleteConfirmation: {
    title: _('Slett Min profil', 'Delete My profile', 'Slett Min Profil'),
    message: _(
      'Dette vil slette brukerprofilen din og alle dine lagrede data.',
      'This will erase you user profile and all your stored data.',
      'Dette vil slette brukarprofilen din og alle lagra data.',
    ),
    confirm: _('OK', 'OK', 'OK'),
    cancel: _('Avbryt', 'Cancel', 'Avbryt'),
  },
  deleteError: {
    title: _('Feil ved sletting', 'Error when deleting', 'Feil ved sletting'),
    message: _(
      'Det oppstod en  feil når vi prøvde å slette Min profil. Prøv igjen senere, og hvis det ikke hjelper, vennligst kontakt kundeservice.',
      'An error occurred when we tried deleting My profile. Try again later and if it still does not work, please contact customer service.',
      'Det oppsto ein feil då vi prøvde å slette Min profil. Prøv igjen seinare, og dersom det framleis ikkje fungerer, ver venleg og kontakt kundeservice.',
    ),
  },
};

export default orgSpecificTranslations(DeleteProfileTexts, {
  nfk: {
    unableToDeleteWithFareContracts: _(
      'Kan ikke slette Min profil mens du har aktive billetter. Kontakt Reis Nordland kundeservice for refusjon eller vent til billettene har utløpt.',
      'Unable to delete My profile while you have active tickets. Please contact Reis Nordland customer support for refund or wait until tickets expire.',
      'Kan ikkje slette Min profil medan du har aktive billettar. Kontakt Reis Nordland kundeservice for refusjon eller vent til billettane har gått ut.',
    ),
  },
  fram: {
    unableToDeleteWithFareContracts: _(
      'Kan ikke slette din bruker mens du har aktive billetter. Kontakt FRAM Kundesenter for refusjon eller vent til billettene har utløpt.',
      'Unable to delete your user while you have active tickets. Please contact FRAM Customer Centre for refund or wait until tickets expire.',
      'Kan ikkje slette brukaren din mens du har aktive billettar. Kontakt FRAM Kundesenter for refusjon eller vent til billettane har gått ut.',
    ),
    header: {
      title: _('Slett min bruker', 'Delete my user', 'Slett min brukar'),
    },
    deleteInfo: _(
      'Når du sletter din bruker mister du tilgang på billett- og kjøpshistorikk, kvitteringer og dine innstillinger.',
      'When deleting your user you will lose access to recent tickets, receipts and settings',
      'Når du slettar brukaren din mistar du tilgang på billett- og kjøpshistorikk, kvitteringar og dine innstillingar.',
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

        `Aktiver for å slette brukaren ${
          customerNumber
            ? 'med kundenummer ' + customerNumber?.split('').join(', ')
            : ''
        }`,
      ),
    deleteConfirmation: {
      title: _('Slett min bruker', 'Delete my user', 'Slett min brukar'),
      message: _(
        'Dette vil slette brukeren din og alle dine lagrede data.',
        'This will erase you user and all your stored data.',
        'Dette vil slette brukaren din og alle dine lagra data.',
      ),
    },
    deleteError: {
      message: _(
        'Det oppstod en feil når vi prøvde å slette din bruker. Prøv igjen senere, og hvis det ikke hjelper, vennligst kontakt FRAM Kundesenter.',
        'An error occurred when we tried deleting your user. Try again later and if it still does not work, please contact FRAM Customer Centre.',
        'Det oppstod ein feil då vi prøvde å sletta brukaren din. Prøv igjen seinare, og om det ikkje hjelper, kontakt FRAM Kundesenter.',
      ),
    },
  },
});
