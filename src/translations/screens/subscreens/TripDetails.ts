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
      circaLabel: _(`ca. `, `ca. `, `ca. `),
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
          noRealTime: (
            placeName: string,
            aimedTime: string,
            timeIsApproximation: boolean,
          ) =>
            _(
              `Fra ${placeName},${
                timeIsApproximation ? ' cirka' : ''
              } klokken ${aimedTime}`,
              `From ${placeName},${
                timeIsApproximation ? ' circa' : ''
              } time ${aimedTime}`,
              `Frå ${placeName},${
                timeIsApproximation ? ' cirka' : ''
              } klokka ${aimedTime}`,
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
            timeIsApproximation: boolean,
          ) =>
            _(
              `Fra ${placeName}, sanntid klokken ${realTime}. Rutetid klokken${
                timeIsApproximation ? ' cirka' : ''
              } ${aimedTime}.`,
              `From ${placeName}, realtime ${realTime}. Route time${
                timeIsApproximation ? ' circa' : ''
              } ${aimedTime}.`,
              `Frå ${placeName}, sanntid klokka ${realTime}. Rutetid klokka${
                timeIsApproximation ? ' cirka' : ''
              } ${aimedTime}.`,
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
  flexibleTransport: {
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
