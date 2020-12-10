import {translation as _} from '../../commons';
const TripDetailsTexts = {
  header: {
    title: _('Reisedetaljer', 'Trip details'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
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
  legs: {
    walk: {
      label: (duration: string) =>
        _(`Gå i ${duration}`, `Walk for ${duration}`),
    },
    wait: {
      label: (time: string) => _(`Vent i ${time}`, `Wait for ${time}`),
    },
  },
};
export default TripDetailsTexts;
