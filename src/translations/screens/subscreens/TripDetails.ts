import orgSpecificTranslations from '@atb/translations/utils';
import {translation as _} from '../../commons';
const TripDetailsTexts = {
  header: {
    title: _('Reisedetaljer', 'Trip details'),
  },
  trip: {
    leg: {
      a11yHelper: (stepNumber: number, travelMode: string) =>
        _(
          `Steg ${stepNumber}, ${travelMode}`,
          `Step ${stepNumber}, ${travelMode}`,
        ),

      start: {
        a11yLabel: {
          noRealTime: (placeName: string, aimedTime: string) =>
            _(
              `Fra ${placeName}, ca. klokken ${aimedTime}`,
              `From ${placeName}, appr. time ${aimedTime}`,
            ),
          singularTime: (placeName: string, time: string) =>
            _(
              `Fra ${placeName}, klokken ${time}`,
              `From ${placeName}, time ${time}`,
            ),
          realAndAimed: (
            placeName: string,
            realTime: string,
            aimedTime: string,
          ) =>
            _(
              `Fra ${placeName}, forventet tid klokken ${realTime}. Rutetid klokken ${aimedTime}.`,
              `From ${placeName}, expected time ${realTime}. Route time ${aimedTime}.`,
            ),
        },
      },
      transport: {
        a11ylabel: (modeName: string, lineName: string) =>
          _(`${modeName} linje ${lineName}`, `${modeName} line ${lineName}`),
      },
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
      travelTime: {
        label: (time: string) => _(`Reisetid: ${time}`, `Trip time: ${time}`),
        a11yLabel: (time: string) =>
          _(`Total reisetid: ${time}`, `Total trip time: ${time}`),
      },
      walkDistance: {
        label: (distanceInMetres: string) =>
          _(
            `Gangavstand: ${distanceInMetres} m`,
            `Walking distance: ${distanceInMetres} m`,
          ),
        a11yLabel: (distanceInMetres: string) =>
          _(
            `Total gangavstand: ${distanceInMetres} m`,
            `Total walking distance: ${distanceInMetres} m`,
          ),
      },
    },
  },

  messages: {
    shortTime: _(
      'Vær oppmerksom på kort byttetid',
      'Please note short changeover time',
    ),
    ticketsWeDontSell: _(
      'Om reisen din går utenfor sone A kan det kreve billetter som må kjøpes fra andre selskaper enn AtB.',
      'If your trip goes outside zone A, it may require tickets that must be purchased from companies other than AtB.',
    ),
    collabTicketInfo: _(
      `Med enkelt- og periodebillett for sone A fra AtB kan du reise med tog i denne sonen.\n\n`,
      `With a single and period ticket for zone A from AtB, you can travel by train in this zone.\n\n`,
    ),
    errorNetwork: _(
      'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
    ),
    errorDefault: _(
      'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?',
      'We could not update your trip plan. Perhaps your trip has changed or timed out?',
    ),
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
  nfk: {
    messages: {
      ticketsWeDontSell: _(
        'Reisen krever billett som ikke er tilgjengelig i denne appen, eller som må kjøpes fra et annet selskap enn Reis Nordland.',
        'This journey requires a ticket that is not available from this app, or must be purchased from a provider other than Reis Nordland.',
      ),
    },
  },
});
