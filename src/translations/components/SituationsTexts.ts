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
  tripSummary: {
    detailedPrefix: _(
      'Denne reisen har følgende meldinger',
      'This trip has the following notices',
      'Denne reisa har følgjande meldingar',
    ),
    warnings: _(
      'Reisen har advarsler',
      'The trip has warnings',
      'Reisa har åtvaringar',
    ),
    notices: _(
      'Reisen har ekstra info',
      'The trip has extra information',
      'Reisa har ekstra info',
    ),
    warningsAndNotices: _(
      'Reisen har advarsler og ekstra info',
      'The trip has warnings and extra information',
      'Reisa har åtvaringar og ekstra info',
    ),
    openDetailsForMoreInfo: _(
      'Åpne detaljer for mer informasjon',
      'Open details for more information',
      'Opne detaljar for meir informasjon',
    ),
  },
  bottomSheet: {
    title: {
      info: _('Informasjon', 'Information', 'Informasjon'),
      warning: _('Advarsel', 'Warning', 'Advarsel'),
      error: _('Feil', 'Error', 'Feil'),
    },
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
