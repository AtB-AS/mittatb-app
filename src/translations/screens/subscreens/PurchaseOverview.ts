import {translation as _} from '../../commons';

const PurchaseOverviewTexts = {
  header: {
    title: _('Kjøp ny billett'),
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
  startTime: _('Oppstart nå'),
  travellers: {
    travellersCount: (count: number) => _(`${count} reisende`),
    a11yHint: _('Aktivér for å velge reisende'),
  },
  tariffZones: {
    a11yHint: _('Aktivér for å velge soner'),
  },
  primaryButton: {
    text: (totalPrice: number) => _(`Total: ${totalPrice},-`),
    a11yHint: _('Aktivér for å gå til betaling'),
  },
};
export default PurchaseOverviewTexts;
