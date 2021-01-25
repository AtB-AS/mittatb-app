import {translation as _} from '../../commons';

const PurchaseOverviewTexts = {
  header: {
    title: _('Kjøp ny billett', 'Buy new ticket'),
    leftButton: {
      text: _('Avbryt'),
      a11yLabel: _('Avbryt kjøpsprosessen', 'Cancel purchase'),
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    failedOfferSearch: _(
      'Klarte ikke å søke opp pris',
      'Unable to retrieve cost',
    ),
    failedReservation: _(
      'Klarte ikke å reservere billett',
      'Unable to book a ticket',
    ),
  },
  startTime: _('Oppstart nå', 'Starting now'),
  travellers: {
    travellersCount: (count: number) => _(`${count} reisende`),
    a11yHint: _('Aktivér for å velge reisende', 'Activate to select travellers'),
  },
  tariffZones: {
    a11yHint: _('Aktivér for å velge soner', 'Activate to select zones'),
  },
  primaryButton: {
    text: (totalPrice: number) => _(`Total: ${totalPrice},-`),
    a11yHint: _('Aktivér for å gå til betaling', 'Activate to continue to purchase'),
  },
};
export default PurchaseOverviewTexts;
