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
  travelDate: {
    now: _('Oppstart nå', 'Starting now'),
    futureDate: (time: string) => _(`Oppstart ${time}`, `Start time ${time}`),
    a11yHint: _(
      'Aktivér for å velge starttidspunkt',
      `Activate to select start time`,
    ),
  },
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
  product: {
    a11yHint: _(
      'Aktivér for å velge billettype',
      'Activate to select ticket type',
    ),
  },
  totalPrice: (totalPrice: number) =>
    _(`Totalt: ${totalPrice} kr`, `Total: ${totalPrice} kr`),
  primaryButton: _('Gå til betaling', 'Go to payment'),
};
export default PurchaseOverviewTexts;
