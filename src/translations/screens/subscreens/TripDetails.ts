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
            `${count} intermediate stop \n${duration}`,
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
      'Reisen inneholder reisetilbud som krever billett fra andre selskap enn AtB.',
      'Parts of this journey requires tickets from providers other than AtB.',
    ),
    errorNetwork: _(
      'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
    ),
    errorDefault: _(
      'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?',
      'We could not update your trip plan. Perhaps your trip has changed or timed out?',
    ),
  },
};
export default TripDetailsTexts;
