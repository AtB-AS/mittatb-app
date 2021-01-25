import {translation as _} from '../../commons';

const PurchaseOverviewTexts = {
  header: {
    title: _('Kjøp ny billett', 'Buy new ticket'),
    leftButton: {
      text: _('Avbryt', 'Cancel'),
      a11yLabel: _('Avbryt kjøpsprosessen', 'Cancel the purchase process'),
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
  startTime: _('Oppstart nå', 'Valid from now'),
  travellers: {
    travellersCount: (count: number) => _(`${count} reisende`),
    a11yHint: _('Aktivér for å velge reisende'),
  },
  tariffZones: {
    a11yHint: _('Aktivér for å velge soner', 'Activate to select zones'),
  },
  primaryButton: {
    text: (totalPrice: number) => _(`Total: ${totalPrice},-`),
    a11yHint: _('Aktivér for å gå til betaling'),
  },
};
export default PurchaseOverviewTexts;
