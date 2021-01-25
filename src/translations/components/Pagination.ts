import {translation as _} from '../commons';

const Pagination = {
  previous: {
    label: _('Forrige', 'Previous'),
    a11yHint: _(
      'Aktivér for å vise forrige side',
      'Activate to show last page',
    ),
  },
  next: {
    label: _('Neste', 'Next'),
    a11yHint: _('Aktivér for å vise neste side', 'Activate to show next page'),
  },
  current: {
    label: (current: number, total: number) => _(`${current} av ${total}`),
    a11yLabel: (current: number, total: number) =>
      _(`Viser ${current} av totalt ${total} sider`),
  },
};
export default Pagination;
