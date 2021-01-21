import {translation as _} from '../commons';

const TicketsTexts = {
  header: {
    title: _('Billetter'),
    leftButton: {
      a11yLabel: _('Gå til startside'),
    },
  },
  buyTicketsTab: {
    label: _('Kjøp'),
  },
  activeTicketsTab: {
    label: _('Aktive'),
    noTickets: _('Du har ingen aktive billetter'),
  },
  expiredTicketsTab: {
    label: _('Utløpte'),
    noTickets: _('Fant ingen billetthistorikk'),
  },
  ticket: {
    valid: {
      a11yLabel: _('Gyldig billett'),
      text: (duration: string) => _(`Gyldig i ${duration}`),
      durationDelimiter: _(` og `),
    },
    expired: {
      a11yLabel: _('Utløpt billett'),
      text: (dateTime: string) => _(`Kjøpt ${dateTime}`),
    },
  },
  reservation: {
    processing: _('Prosesseres... ikke gyldig enda'),
    approved: _('Betaling godkjent. Henter billett...'),
    orderId: (orderId: string) => _(`Ordre-id ${orderId}`),
    paymentType: {
      vipps: _('Vipps'),
      creditcard: _('kredittkort'),
    },
    goToVipps: _('Gå til Vipps for betaling'),
  },
};
export default TicketsTexts;
