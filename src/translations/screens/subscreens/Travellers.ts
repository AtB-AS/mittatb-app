import {translation as _} from '../../commons';
import {UserProfileWithCount} from '../../../screens/Ticketing/Purchase/Travellers/use-user-count-state';

const TravellersTexts = {
  header: {
    title: _('Velg sone'),
    leftButton: {
      text: _('Avbryt'),
      a11yLabel: _('Avbryt kjøpsprosessen'),
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil'),
    failedOfferSearch: _('Klarte ikke å søke opp pris'),
    failedReservation: _('Klarte ikke å reservere billett'),
  },
  tariffZones: {
    a11yHint: _('Aktivér for å velge soner'),
  },
  travellerCounter: {
    text: (u: UserProfileWithCount) => _(u.name.value),
  },
  totalCost: {
    title: _('Totalt'),
    label: _('Inkl. 6% mva'),
  },
  paymentButtonVipps: {
    text: _('Betal med Vipps'),
    a11yHint: _('Aktivér for å betale billett med Vipps'),
  },
  paymentButtonCard: {
    text: _('Betal med bankkort'),
    a11yHint: _('Aktivér for å betale billett med bankkort'),
  },
};
export default TravellersTexts;
