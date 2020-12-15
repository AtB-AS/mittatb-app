import {translation as _} from '../../commons';
const TripDetailsTexts = {
  header: {
    title: _('Reisedetaljer', 'Trip details'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  trip: {
    leg: {
      a11yHelper: (step: number, travelMode: string) =>
        _(`${step}. steg, ${travelMode}`),

      start: {
        a11yLabel: {
          noRealTime: (placeName: string, aimedTime: string) =>
            _(`Fra ${placeName}, ca. klokken ${aimedTime}`),
          singularTime: (placeName: string, time: string) =>
            _(`Fra ${placeName}, klokken ${time}`),
          realAndAimed: (
            placeName: string,
            realTime: string,
            aimedTime: string,
          ) =>
            _(
              `Fra ${placeName}, forventet avgang klokken ${realTime}. Rutetid klokken ${aimedTime}.`,
            ),
        },
      },
      transport: {
        a11ylabel: (modeName: string, lineName: string) =>
          _(`${modeName} linje ${lineName}`),
      },
      intermediateStops: {
        a11yLabel: (count: number, duration: string) =>
          _(`${count} mellomstopp. ${duration}.`),
        label: (count: number, duration: string) =>
          _(`${count} mellomstopp \n${duration}`),
        a11yHint: _('Aktivér for å vise alle mellomstopp.'),
      },
      walk: {
        label: (duration: string) =>
          _(`Gå i ${duration}`, `Walk for ${duration}`),
      },
      wait: {
        label: (time: string) => _(`Vent i ${time}`, `Wait for ${time}`),
        messages: {
          shortTime: _('Kort byttetid'),
        },
      },
      end: {
        a11yLabel: {
          noRealTime: (placeName: string, aimedTime: string) =>
            _(`Avstigning på ${placeName}, ca. klokken ${aimedTime}`),
          singularTime: (placeName: string, time: string) =>
            _(`Avstigning på ${placeName}, klokken ${time}`),
          realAndAimed: (
            placeName: string,
            realTime: string,
            aimedTime: string,
          ) =>
            _(
              `Avstigning på ${placeName}, forventet tid klokken ${realTime}. Rutetid klokken ${aimedTime}.`,
            ),
        },
      },
    },
    summary: {
      travelTime: {
        label: (time: string) => _(`Reisetid: ${time}`),
        a11yLabel: (time: string) => _(`Total reisetid: ${time}`),
      },
      walkDistance: {
        label: (distanceInMetres: string) =>
          _(`Gangavstand: ${distanceInMetres} m`),
      },
    },
  },

  messages: {
    shortTime: _('Vær oppmerksom på kort byttetid'),
    errorNetwork: _(
      'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.',
    ),
    errorDefault: _(
      'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?',
    ),
  },
};
export default TripDetailsTexts;
