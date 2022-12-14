import {translation as _} from '../commons';

const SituationsTexts = {
  a11yLabel: {
    error: _('Med kritiske advarsler', 'With critical warnings'),
    warning: _('Med advarsler', 'With warnings'),
    info: _('Med ekstra info', 'With extra information'),
  },
  bottomSheet: {
    button: _('Lukk', 'Close'),
    validity: {
      from: (fromDate: string) =>
        _(`Gyldig fra ${fromDate}`, `Valid from ${fromDate}`),
      to: (toDate: string) => _(`Gyldig til ${toDate}`, `Valid to ${toDate}`),
      fromAndTo: (fromDate: string, toDate: string) =>
        _(
          `Gyldig fra ${fromDate} til ${toDate}`,
          `Valid from ${fromDate} to ${toDate}`,
        ),
    },
  },
};

export default SituationsTexts;
