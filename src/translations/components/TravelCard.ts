import {type TravelCardType} from '@atb/screen-components/travel-card';
import {translation as _} from '../commons';

const TravelCardTexts = {
  card: {
    a11yHint: _(
      'Aktivér for å se detaljer om reisen.',
      'Activate to see trip details.',
      'Aktivér for å se detaljer om reisen.',
    ),
    typePrefix: (
      type: TravelCardType,
      cardIndex: number,
      numberOfCards: number,
    ) => {
      const singular = numberOfCards === 1;
      const index = singular ? '' : ` ${cardIndex + 1}`;
      switch (type) {
        case 'trip-search':
          return _(
            `Reiseforslag${index}.`,
            `Trip suggestion${index}.`,
            `Reiseforslag${index}.`,
          );
        case 'saved-trip':
          return _(
            `Lagret reise${index}.`,
            `Saved trip${index}.`,
            `Lagret reise${index}.`,
          );
      }
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
          `${hasAimedTime ? 'Sanntid fra' : 'Fra'} ${startTime} til ${endTime}`,
          `${hasAimedTime ? 'Real-time from' : 'From'} ${startTime} to ${endTime}`,
          `${hasAimedTime ? 'Sanntid fra' : 'Fra'} ${startTime} til ${endTime}`,
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
