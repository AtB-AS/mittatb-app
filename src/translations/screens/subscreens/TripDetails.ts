import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
import {translation as _} from '../../commons';

const TripDetailsTexts = {
  header: {
    title: _('Reisedetaljer', 'Trip details'),
    titleFromTo: ({fromName, toName}: {fromName: string; toName: string}) =>
      _(`${fromName}  -  ${toName}`, `${fromName}  -  ${toName}`),
    titleFromToA11yLabel: ({
      fromName,
      toName,
    }: {
      fromName: string;
      toName: string;
    }) => _(`Fra ${fromName} til ${toName}`, `From ${fromName} to ${toName}`),
    startEndTime: ({
      startTime,
      endTime,
    }: {
      startTime: string;
      endTime: string;
    }) => _(`${startTime} - ${endTime}`, `${startTime} - ${endTime}`),
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
      ),
  },
  trip: {
    leg: {
      a11yHelper: (stepNumber: number, travelMode: string) =>
        _(
          `Steg ${stepNumber}, ${travelMode}`,
          `Step ${stepNumber}, ${travelMode}`,
        ),
      lastPassedStop: (quayName: string, time: string) =>
        _(`Passerte ${quayName} kl. ${time}`, `Passed ${quayName} at ${time}`),
      start: {
        a11yLabel: {
          noRealTime: (placeName: string, aimedTime: string) =>
            _(
              `Fra ${placeName}, klokken ${aimedTime}`,
              `From ${placeName}, time ${aimedTime}`,
            ),
          singularTime: (placeName: string, time: string) =>
            _(
              `Fra ${placeName}, sanntid klokken ${time}`,
              `From ${placeName}, realtime ${time}`,
            ),
          realAndAimed: (
            placeName: string,
            realTime: string,
            aimedTime: string,
          ) =>
            _(
              `Fra ${placeName}, sanntid klokken ${realTime}. Rutetid klokken ${aimedTime}.`,
              `From ${placeName}, realtime ${realTime}. Route time ${aimedTime}.`,
            ),
        },
      },
      transport: {
        a11ylabel: (modeName: string, lineName: string) =>
          _(`${modeName} linje ${lineName}`, `${modeName} line ${lineName}`),
      },
      live: _('Se live', 'See live'),
      intermediateStops: {
        a11yLabel: (count: number, duration: string) =>
          _(
            `${count} mellomstopp. ${duration}.`,
            `${count} intermediate stop. ${duration}.`,
          ),
        label: (count: number, duration: string) =>
          _(
            `${count} mellomstopp \n${duration}`,
            count > 1
              ? `${count} intermediate stops \n${duration}`
              : `${count} intermediate stop \n${duration}`,
          ),
        a11yHint: _(
          'Aktivér for å vise alle mellomstopp.',
          'Activate to show intermediate stops',
        ),
      },
      walk: {
        label: (duration: string) =>
          _(`Gå i ${duration}`, `Walk for ${duration}`),
      },
      shortWalk: _(`Gå i mindre enn ett minutt`, `Walk for less than a minute`),
      wait: {
        label: (time: string) => _(`Vent i ${time}`, `Wait for ${time}`),
        messages: {
          shortTime: _('Kort byttetid', 'Short changeover time'),
        },
      },
      end: {
        a11yLabel: {
          noRealTime: (placeName: string, aimedTime: string) =>
            _(
              `Avslutter på ${placeName}, ca. klokken ${aimedTime}`,
              `Ending at ${placeName}, appr. time ${aimedTime}`,
            ),
          singularTime: (placeName: string, time: string) =>
            _(
              `Avslutter på ${placeName}, klokken ${time}`,
              `Ending at ${placeName}, time ${time}`,
            ),
          realAndAimed: (
            placeName: string,
            realTime: string,
            aimedTime: string,
          ) =>
            _(
              `Avslutter på ${placeName}, forventet tid klokken ${realTime}. Rutetid klokken ${aimedTime}.`,
              `Ending at ${placeName}, ETA ${realTime}. Route time ${aimedTime}.`,
            ),
        },
      },
    },
    summary: {
      showTripInMap: {
        label: _('Vis reiserute i kart', 'Show trip in map'),
      },
      travelTime: {
        label: (time: string) =>
          _(`Total reisetid: ${time}`, `Total trip time: ${time}`),
        a11yLabel: (time: string) =>
          _(`Total reisetid: ${time}`, `Total trip time: ${time}`),
      },
      walkDistance: {
        label: (distance: string) =>
          _(
            `Total gangavstand: ${distance}`,
            `Total walking distance: ${distance}`,
          ),
        a11yLabel: (distanceInMetres: string) =>
          _(
            `Total gangavstand: ${distanceInMetres} meter`,
            `Total walking distance: ${distanceInMetres} meters`,
          ),
      },
    },
    buyTicket: {
      text: _('Kjøp billett', 'Buy ticket'),
      a11yLabel: _('Aktiver for å kjøpe billett', 'Activate to buy ticket'),
    },
  },

  messages: {
    shortTime: _(
      'Vær oppmerksom på kort byttetid.',
      'Please note short changeover time.',
    ),
    correspondenceNotGuaranteed: _('', ''),
    errorNetwork: _(
      'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
    ),
    errorDefault: _(
      'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?',
      'We could not update your trip plan. Perhaps your trip has changed or timed out?',
    ),
    tripIncludesRailReplacementBus: _(
      'Reisen inkluderer buss for tog.',
      'This trip includes rail replacement bus.',
    ),
    departureIsRailReplacementBus: _('Buss for tog', 'Rail replacement bus'),
    interchange: (
      fromPublicCode: string,
      toPublicCode: string,
      location: string,
    ) =>
      _(
        `Korrespondanse mellom ${fromPublicCode} og ${toPublicCode} på ${location}.`,
        `Correspondance between ${fromPublicCode} and ${toPublicCode} on ${location}.`,
      ),
    interchangeWithUnknownFromPublicCode: (
      toPublicCode: string,
      location: string,
    ) =>
      _(
        `Korrespondanse med ${toPublicCode} på ${location}.`,
        `Correspondance with ${toPublicCode} on ${location}.`,
      ),
  },
};
export default orgSpecificTranslations(TripDetailsTexts, {
  fram: {
    messages: {
      correspondenceNotGuaranteed: _(
        'Kan ikke garantere korrespondanse.',
        'Cannot guarantee correspondence.',
      ),
    },
  },
});
