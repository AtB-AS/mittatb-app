import {translation as _} from '../commons';

const FlexibleTransportTexts = {
  needsBookingWhatIsThisTitle: (publicCode: string) =>
    _(
      `Hva er ${publicCode}?`,
      `What is ${publicCode}?`,
      `Kva er ${publicCode}?`,
    ),
  contentTitle: (publicCode: string) =>
    _(
      `${publicCode} kjører på bestilling innenfor bestemte soner og tider.`,
      `${publicCode} runs on demand within specific zones and times.`,
      `${publicCode} køyrer på bestilling innanfor bestemte sonar og tider.`,
    ),
  steps: [
    _(
      `Reserver sete i taxi/minibuss.`,
      `Book a seat in a taxi/minibus.`,
      `Reserver sete i taxi/minibuss.`,
    ),
    _(
      `Motta bekreftelse og hentetidspunkt på SMS.`,
      `Receive confirmation and pick-up time by SMS.`,
      `Motta bekrefting og hentetidspunkt på SMS.`,
    ),
    _(
      `Kjøp vanlig bussbillett før du går om bord.`,
      `Buy a regular bus ticket before boarding.`,
      `Kjøp vanlig bussbillett før du går om bord.`,
    ),
  ],
  readMoreAbout: (publicCode: string) =>
    _(
      `Mer om ${publicCode}`,
      `More about ${publicCode}`,
      `Meir om ${publicCode}`,
    ),
  bookOnline: _(`Reserver på nett`, `Book online`, `Reserver på nett`),
  bookByPhone: (phone: string) =>
    _(
      `Reserver på tlf. ${phone}`,
      `Book by phone ${phone}`,
      `Reserver på tlf. ${phone}`,
    ),
  bookByPhoneA11yHint: _(
    `Klikk for å ringe`,
    `Tap to call`,
    `Klikk for å ringe`,
  ),
  onDemandTransportLabel: _(
    `Bestillingstransport`,
    `On-demand transport`,
    `Bestillingstransport`,
  ),
  needsBookingAndIsAvailable: (
    publicCode: string,
    formattedTimeForBooking: string,
    isUrgent: boolean,
  ) =>
    _(
      `Frist for reservasjon av ${publicCode} på denne reisen går ut ${
        (isUrgent ? 'om ' : '') + formattedTimeForBooking
      }.`,
      `Deadline for reservation of ${publicCode} on this trip expires ${
        (isUrgent ? 'in ' : '') + formattedTimeForBooking
      }.`,
      `Frist for reservasjon av ${publicCode} på denne reisa går ut ${
        (isUrgent ? 'om ' : '') + formattedTimeForBooking
      }.`,
    ),
  needsBookingButIsTooEarly: (
    publicCode: string,
    formattedTimeForBooking: string,
    isImminent: boolean,
  ) =>
    _(
      `${publicCode} på denne reisen kan tidligst reserveres ${
        (isImminent ? 'om ' : '') + formattedTimeForBooking
      }.`,
      `${publicCode} on this trip can be booked no sooner than ${
        (isImminent ? 'in ' : '') + formattedTimeForBooking
      }.`,
      `${publicCode} på denne reisa kan tidlegast reserverast ${
        (isImminent ? 'om ' : '') + formattedTimeForBooking
      }.`,
    ),
  needsBookingWhatIsThis: (publicCode: string) =>
    _(
      `Hva er ${publicCode}?`,
      `What is ${publicCode}?`,
      `Kva er ${publicCode}?`,
    ),
};

export default FlexibleTransportTexts;
