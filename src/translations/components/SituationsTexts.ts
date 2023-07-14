import {translation as _} from '../commons';

const SituationsTexts = {
  a11yLabel: {
    error: _(
      'Med kritiske advarsler',
      'With critical warnings',
      'Med kritiske merknader',
    ),
    warning: _('Med advarsler', 'With warnings', 'Med merknader'),
    info: _('Med ekstra info', 'With extra information', 'Med ekstra info'),
  },
  bottomSheet: {
    button: _('Lukk', 'Close', 'Lukk'),
    validity: {
      from: (fromDate: string) =>
        _(
          `Gyldig fra ${fromDate}`,
          `Valid from ${fromDate}`,
          `Gyldig frå ${fromDate}`,
        ),
      to: (toDate: string) =>
        _(`Gyldig til ${toDate}`, `Valid to ${toDate}`, `Gyldig til ${toDate}`),
      fromAndTo: (fromDate: string, toDate: string) =>
        _(
          `Gyldig fra ${fromDate} til ${toDate}`,
          `Valid from ${fromDate} to ${toDate}`,
          `Gyldig frå ${fromDate} til ${toDate}`,
        ),
    },
  },
};

export default SituationsTexts;
