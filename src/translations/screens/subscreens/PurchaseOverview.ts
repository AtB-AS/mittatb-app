import {translation as _} from '../../commons';

const PurchaseOverviewTexts = {
  header: {
    title: {
      single: _('Enkeltbillett', 'Single ticket'),
      period: _('Periodebillett', 'Period ticket'),
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    message: _(
      'Oops - vi klarte ikke å søke opp prisen. Supert om du prøver igjen 🤞',
      'Whoops - we were unable to retrieve cost. Please try again 🤞',
    ),
  },
  startTime: _('Oppstart nå', 'Starting now'),
  travellers: {
    noTravellers: _(`Ingen reisende`, `No travellers`),
    travellersCount: (count: number) =>
      _(`${count} reisende`, `${count} travellers`),
    a11yHint: _(
      'Aktivér for å velge reisende',
      `Activate to select travellers`,
    ),
  },
  tariffZones: {
    a11yHint: _('Aktivér for å velge soner', 'Activate to select zones'),
  },
  primaryButton: {
    text: (totalPrice: number) =>
      _(`Total: ${totalPrice},-`, `Total: ${totalPrice},-`),
    a11yLabel: (totalPrice: number) =>
      _(`Betal totalt ${totalPrice}`, `Pay a total of ${totalPrice}`),
    a11yHint: _(
      'Aktivér for å gå til betaling',
      'Activate to continue to purchase',
    ),
  },
};
export default PurchaseOverviewTexts;
