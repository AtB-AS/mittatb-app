import {translation as _} from '../commons';

const TravelCardTexts = {
  card: {
    a11yHint: _(
      'Aktivér for å se detaljer om reisen.',
      'Activate to see trip details.',
      'Aktivér for å se detaljer om reisen.',
    ),
    a11yPrefix: {
      tripSuggestion: (cardIndex: number, numberOfCards: number) => {
        const index = numberOfCards === 1 ? '' : ` ${cardIndex + 1}`;
        return _(
          `Reiseforslag${index}.`,
          `Trip suggestion${index}.`,
          `Reiseforslag${index}.`,
        );
      },
      savedTrip: (cardIndex: number, numberOfCards: number) => {
        const index = numberOfCards === 1 ? '' : ` ${cardIndex + 1}`;
        return _(
          `Lagret reise${index}.`,
          `Saved trip${index}.`,
          `Lagret reise${index}.`,
        );
      },
      bookingOption: (cardIndex: number, numberOfCards: number) => {
        const index = numberOfCards === 1 ? '' : ` ${cardIndex + 1}`;
        return _(
          `Bestillingsalternativ${index}.`,
          `Booking option${index}.`,
          `Bestillingsalternativ${index}.`,
        );
      },
    },
    modesPrefix: (modes: string[]) => {
      return _(
        `Med ${modes.join(' og ')}`,
        `With ${modes.join(' and ')}`,
        `Med ${modes.join(' og ')}`,
      );
    },
  },
  header: {
    flexTransportInfo: (publicCode: string) =>
      _(
        `Henting med ${publicCode}`,
        `Pickup with ${publicCode}`,
        `Henting med ${publicCode}`,
      ),
    totalDuration: _('Reisetid', 'Trip duration', 'Reisetid'),
    day: {
      today: _('I dag', 'Today', 'I dag'),
      tomorrow: _(`I morgen`, `Tomorrow`, `I morgon`),
      dayAfterTomorrow: _(`I overmorgen`, `Day after tomorrow`, `I overmorgon`),
    },
    originalTime: _('Opprinnelig', 'Original', 'Opprinnelig'),
    pastTime: _('Avreise passert', 'Departure passed', 'Avreise passert'),
    fromToInfo: {
      a11yLabel: (fromPlace: string, toPlace: string) =>
        _(
          `Fra ${fromPlace} til ${toPlace}`,
          `From ${fromPlace} to ${toPlace}`,
          `Frå ${fromPlace} til ${toPlace}`,
        ),
    },
    expectedTime: {
      a11yLabel: (startTime: string, endTime: string, hasAimedTime: boolean) =>
        _(
          `${hasAimedTime ? 'Ny tid fra' : 'Fra'} ${startTime} til ${endTime}`,
          `${hasAimedTime ? 'New time from' : 'From'} ${startTime} to ${endTime}`,
          `${hasAimedTime ? 'Ny tid fra' : 'Fra'} ${startTime} til ${endTime}`,
        ),
    },
    aimedTime: {
      a11yLabel: (startTime: string, endTime: string) =>
        _(
          `Opprinnelig fra ${startTime} til ${endTime}`,
          `Originally scheduled from ${startTime} to ${endTime}`,
          `Opprinnelig fra ${startTime} til ${endTime}`,
        ),
    },
    duration: {
      a11yLabel: (duration: string) =>
        _(
          `Total reisetid ${duration}`,
          `Total journey time ${duration}`,
          `Total reisetid ${duration}`,
        ),
    },
  },
  legs: {
    prefix: _('Reisedetaljer', 'Journey details', 'Reisedetaljar'),
    foot: {
      a11yLabel: (time: string) =>
        _(`Gå ${time}`, `Walk ${time}`, `Gå ${time}`),
    },
    transportation: {
      a11yLabel: (modeName: string, publicCode: string) =>
        _(
          `Ta ${modeName} ${publicCode}`,
          `Take ${modeName} ${publicCode}`,
          `Ta ${modeName} ${publicCode}`,
        ),
    },
    wait: {
      a11yLabel: (time: string) =>
        _(`Vent ${time}`, `Wait ${time}`, `Vent ${time}`),
    },
  },
};

export default TravelCardTexts;
