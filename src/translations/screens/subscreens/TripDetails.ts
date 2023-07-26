import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const TripDetailsTexts = {
  header: {
    title: _('Reisedetaljer', 'Trip details', 'Reisedetaljar'),
    titleFromTo: ({fromName, toName}: {fromName: string; toName: string}) =>
      _(
        `${fromName}  -  ${toName}`,
        `${fromName}  -  ${toName}`,
        `${fromName}  -  ${toName}`,
      ),
    titleFromToA11yLabel: ({
      fromName,
      toName,
    }: {
      fromName: string;
      toName: string;
    }) =>
      _(
        `Fra ${fromName} til ${toName}`,
        `From ${fromName} to ${toName}`,
        `Frå ${fromName} til ${toName}`,
      ),
    startEndTime: ({
      startTime,
      endTime,
    }: {
      startTime: string;
      endTime: string;
    }) =>
      _(
        `${startTime} - ${endTime}`,
        `${startTime} - ${endTime}`,
        `${startTime} - ${endTime}`,
      ),
    startEndTimeA11yLabel: ({
      startTime,
      endTime,
    }: {
      startTime: string;
      endTime: string;
    }) =>
      _(
        `Varighet: Fra ${startTime} til ${endTime}`,
        `Duration: From ${startTime} to ${endTime}`,
        `Varigheit: Frå ${startTime} til ${endTime}`,
      ),
  },
  trip: {
    leg: {
      onDemandTransportLabel: _(
        `Bestillingstransport`,
        `On-demand transport`,
        `Bestillingstransport`,
      ),
      relativeDayNames: (daysDifference: number) => {
        switch (daysDifference) {
          case -2:
            return _('i forgårs', 'the day before yesterday', 'i forgårs');
          case -1:
            return _('i går', 'yesterday', 'i går');
          case 0:
            return _('i dag', 'today', 'i dag');
          case 1:
            return _('i morgen', 'tomorrow', 'i morgon');
          case 2:
            return _('i overmorgen', 'the day after tomorrow', 'i overmorgon');
          default:
            return _('', '', '');
        }
      },
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
          `${publicCode} on this trip expires can be booked no sooner than ${
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
      circaLabel: _(`ca. `, `ca. `, `ca. `),
      bookOnline: _(`Reserver på nett`, `Book online`, `Reserver på nett`),
      bookByPhone: (phone: string) =>
        _(
          `Reserver på tlf. ${phone}`,
          `Book by phone ${phone}`,
          `Reserver på tlf. ${phone}`,
        ),
      a11yHelper: (stepNumber: number, travelMode: string) =>
        _(
          `Steg ${stepNumber}, ${travelMode}`,
          `Step ${stepNumber}, ${travelMode}`,
          `Steg ${stepNumber}, ${travelMode}`,
        ),
      lastPassedStop: (quayName: string, time: string) =>
        _(
          `Passerte ${quayName} kl. ${time}`,
          `Passed ${quayName} at ${time}`,
          `Passerte ${quayName} kl. ${time}`,
        ),
      start: {
        a11yLabel: {
          noRealTime: (placeName: string, aimedTime: string) =>
            _(
              `Fra ${placeName}, klokken ${aimedTime}`,
              `From ${placeName}, time ${aimedTime}`,
              `Frå ${placeName}, klokka ${aimedTime}`,
            ),
          singularTime: (placeName: string, time: string) =>
            _(
              `Fra ${placeName}, sanntid klokken ${time}`,
              `From ${placeName}, realtime ${time}`,
              `Frå ${placeName}, sanntid klokka ${time}`,
            ),
          realAndAimed: (
            placeName: string,
            realTime: string,
            aimedTime: string,
          ) =>
            _(
              `Fra ${placeName}, sanntid klokken ${realTime}. Rutetid klokken ${aimedTime}.`,
              `From ${placeName}, realtime ${realTime}. Route time ${aimedTime}.`,
              `Frå ${placeName}, sanntid klokka ${realTime}. Rutetid klokka ${aimedTime}.`,
            ),
        },
      },
      transport: {
        a11ylabel: (modeName: string, lineName: string) =>
          _(
            `${modeName} linje ${lineName}`,
            `${modeName} line ${lineName}`,
            `${modeName} linje ${lineName}`,
          ),
      },
      live: _('Se live', 'See live', 'Sjå live'),
      intermediateStops: {
        a11yLabel: (count: number, duration: string) =>
          _(
            `${count} mellomstopp. ${duration}.`,
            `${count} intermediate stop. ${duration}.`,
            `${count} mellomstopp. ${duration}.`,
          ),
        label: (count: number, duration: string) =>
          _(
            `${count} mellomstopp \n${duration}`,
            count > 1
              ? `${count} intermediate stops \n${duration}`
              : `${count} intermediate stop \n${duration}`,
            `${count} mellomstopp \n${duration}`,
          ),
        a11yHint: _(
          'Aktivér for å vise alle mellomstopp.',
          'Activate to show intermediate stops',
          'Aktiver for å vise alle mellomstopp',
        ),
      },
      walk: {
        label: (duration: string) =>
          _(`Gå i ${duration}`, `Walk for ${duration}`, `Gå i ${duration}`),
      },
      shortWalk: _(
        `Gå i mindre enn ett minutt`,
        `Walk for less than a minute`,
        `Gå i mindre enn eitt minutt`,
      ),
      wait: {
        label: (time: string) =>
          _(`Vent i ${time}`, `Wait for ${time}`, `Vent i ${time}`),
        messages: {
          shortTime: _(
            'Kort byttetid',
            'Short changeover time',
            'Kort byttetid',
          ),
        },
      },
      end: {
        a11yLabel: {
          noRealTime: (placeName: string, aimedTime: string) =>
            _(
              `Avslutter på ${placeName}, ca. klokken ${aimedTime}`,
              `Ending at ${placeName}, appr. time ${aimedTime}`,
              `Avsluttar på ${placeName}, ca. klokka ${aimedTime}`,
            ),
          singularTime: (placeName: string, time: string) =>
            _(
              `Avslutter på ${placeName}, klokken ${time}`,
              `Ending at ${placeName}, time ${time}`,
              `Avsluttar på ${placeName}, klokka ${time}`,
            ),
          realAndAimed: (
            placeName: string,
            realTime: string,
            aimedTime: string,
          ) =>
            _(
              `Avslutter på ${placeName}, forventet tid klokken ${realTime}. Rutetid klokken ${aimedTime}.`,
              `Ending at ${placeName}, ETA ${realTime}. Route time ${aimedTime}.`,
              `Avsluttar på ${placeName}, forventa tid klokka ${realTime}. Rutetid klokka ${aimedTime}.`,
            ),
        },
      },
    },
    summary: {
      showTripInMap: {
        label: _(
          'Vis reiserute i kart',
          'Show trip in map',
          'Vis reiserute i kart',
        ),
      },
      travelTime: {
        label: (time: string) =>
          _(
            `Total reisetid: ${time}`,
            `Total trip time: ${time}`,
            `Total reisetid: ${time}`,
          ),
        a11yLabel: (time: string) =>
          _(
            `Total reisetid: ${time}`,
            `Total trip time: ${time}`,
            `Total reisetid: ${time}`,
          ),
      },
      walkDistance: {
        label: (distanceInMetres: string) =>
          _(
            `Total gangavstand: ${distanceInMetres} meter`,
            `Total walking distance: ${distanceInMetres} meters`,
            `Total gangavstand: ${distanceInMetres} meter`,
          ),
        a11yLabel: (distanceInMetres: string) =>
          _(
            `Total gangavstand: ${distanceInMetres} meter`,
            `Total walking distance: ${distanceInMetres} meters`,
            `Total gangavstand: ${distanceInMetres} meter`,
          ),
      },
    },
    buyTicket: {
      text: _('Kjøp billett', 'Buy ticket', 'Kjøp billett'),
      a11yLabel: _(
        'Aktiver for å kjøpe billett',
        'Activate to buy ticket',
        'Aktiver for å kjøpe billett',
      ),
    },
  },

  messages: {
    shortTime: _(
      'Vær oppmerksom på kort byttetid.',
      'Please note short changeover time.',
      'Ver merksam på kort byttetid.',
    ),
    correspondenceNotGuaranteed: _('', '', ''),
    errorNetwork: _(
      'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
      'Hei, er du på nett? Vi kan ikkje hente reiseforslag sidan tilkoplinga di til internett manglar eller er ustabil.',
    ),
    errorDefault: _(
      'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?',
      'We could not update your trip plan. Perhaps your trip has changed or timed out?',
      'Vi kunne ikkje oppdatere reiseforslaget ditt. Det kan hende reisa har endra seg eller er utdatert.',
    ),
    tripIncludesRailReplacementBus: _(
      'Reisen inkluderer buss for tog.',
      'This trip includes rail replacement bus.',
      'Reisa inkluderer buss for tog.',
    ),
    departureIsRailReplacementBus: _(
      'Buss for tog',
      'Rail replacement bus',
      'Buss for tog',
    ),
    interchange: (
      fromPublicCode: string,
      toPublicCode: string,
      location: string,
    ) =>
      _(
        `Korrespondanse mellom ${fromPublicCode} og ${toPublicCode} på ${location}.`,
        `Correspondance between ${fromPublicCode} and ${toPublicCode} on ${location}.`,
        `Korrespondanse mellom ${fromPublicCode} og ${toPublicCode} på ${location}.`,
      ),
    interchangeWithUnknownFromPublicCode: (
      toPublicCode: string,
      location: string,
    ) =>
      _(
        `Korrespondanse med ${toPublicCode} på ${location}.`,
        `Correspondance with ${toPublicCode} on ${location}.`,
        `Korrespondanse med ${toPublicCode} på ${location}.`,
      ),
  },
};
export default orgSpecificTranslations(TripDetailsTexts, {
  fram: {
    messages: {
      correspondenceNotGuaranteed: _(
        'Kan ikke garantere korrespondanse.',
        'Cannot guarantee correspondence.',
        'Kan ikkje garantere korrespondanse',
      ),
    },
  },
});
