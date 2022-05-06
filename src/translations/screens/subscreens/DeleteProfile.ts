import {translation as _} from '../../commons';
const DeleteProfileTexts = {
  header: {
    title: _('Slett min profil', 'Delete my profile'),
  },
  deleteInfo: _(
    'Når du sletter Min profil mister du tilgang på billett- og kjøpshistorikk, kvitteringer og dine innstillinger.',
    'When deleting My Profile you will lose access to recent tickets, receipts and settings',
  ),
  unableToDeleteWithTickets: _(
    'Kan ikke slette Min profil mens du har aktive billetter. Kontakt AtB kundeservice for refusjon eller vent til billettene har utløpt.',
    'Unable to delete My Profile while you have active tickets. Please contact customer support to refund or wait until tickets expire.',
  ),
  customerNumber: _('Kundenummer', 'Customer number'),
  deleteConfirmation: {
    title: _('Slett Min Profil', 'Delete My Profile'),
    message: _(
      'Dette vil slette brukerprofilen din og all data som er lagret hos AtB',
      'This will erase you user profile and all data stored at AtB',
    ),
    confirm: _('OK', 'OK'),
    cancel: _('Avbryt', 'Cancel'),
  },
  deleteError: {
    title: _('Feil ved sletting', 'Error when deleting'),
    message: _(
      'Det oppstod en  feil når vi prøvde å slette Min Profil. Prøv igjen senere, og hvis det ikke hjelper, vennligst kontakt kundeservice.',
      'An error occured when we tried deleting My Profile. Try again later and if that still does not work, please contact customer service.',
    ),
  },
};
export default DeleteProfileTexts;
