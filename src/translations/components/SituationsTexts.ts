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
    withSuggestion: {
      error: _(
        'Denne reisen har kritiske advarsler. Se detaljer for mer info.',
        'This trip has critical warnings. See details for more information.',
        'Denne reisa har kritiske merknader. Sjå detaljar for meir info.',
      ),
      warning: _(
        'Denne reisen har advarsler. Se detaljer for mer info.',
        'This trip has warnings. See details for more information.',
        'Denne reisa har merknader. Sjå detaljar for meir info.',
      ),
      info: _(
        'Denne reisen har ekstra informasjon. Se detaljer for mer info.',
        'This trip has extra information. See details for more information.',
        'Denne reisa har ekstra informasjon. Sjå detaljar for meir info.',
      ),
    },
  },
  bottomSheet: {
    title: {
      info: _('Informasjon', 'Information', 'Informasjon'),
      warning: _('Advarsel', 'Warning', 'Advarsel'),
      error: _('Feil', 'Error', 'Feil'),
    },
    affectedStopPlaces: {
      header: _('Påvirker', 'Affects', 'Påverkar'),
      otherStops: (count: number) =>
        _(
          `${count} andre stopp`,
          `${count} other stops`,
          `${count} andre stopp`,
        ),
    },
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
