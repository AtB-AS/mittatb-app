import {translation as _} from '../../commons';
import {UserProfileWithCount} from '../../../screens/Ticketing/Purchase/Travellers/use-user-count-state';

const TravellersTexts = {
  header: {
    title: _('Velg sone', 'Select zone'),
    leftButton: {
      text: _('Avbryt', 'Cancel'),
      a11yLabel: _('Avbryt kjøpsprosessen', 'Cancel purchase'),
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    failedOfferSearch: _(
      'Klarte ikke å søke opp pris',
      'Unable to retrieve price',
    ),
    failedReservation: _(
      'Klarte ikke å reservere billett',
      'Unable to book a ticket',
    ),
  },
  tariffZones: {
    a11yHint: _('Aktivér for å velge soner', 'Activate to select zones'),
  },
  travellerCounter: {
    text: (u: UserProfileWithCount) => _(u.name.value),
  },
  totalCost: {
    title: _('Totalt', 'Total'),
    label: _('Inkl. 6% mva', 'Incl. 6% VAT'),
  },
  paymentButtonVipps: {
    text: _('Betal med Vipps', 'Pay by Vipps service'),
    a11yHint: _(
      'Aktivér for å betale billett med Vipps',
      'Activate to pay ticket with Vipps service',
    ),
  },
  paymentButtonCard: {
    text: _('Betal med bankkort', 'Pay by credit card'),
    a11yHint: _(
      'Aktivér for å betale billett med bankkort',
      'Activate to pay by credit card',
    ),
  },
};
export default TravellersTexts;
