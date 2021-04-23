import {translation as _} from '../commons';

const Pagination = {
  previous: {
    label: _('Forrige', 'Previous'),
    a11yHint: _(
      'Aktivér for å vise forrige side',
      'Activate to show previous page',
    ),
  },
  next: {
    label: _('Neste', 'Next'),
    a11yHint: _('Aktivér for å vise neste side', 'Activate to show next page'),
  },
  current: {
    label: (current: number, total: number) =>
      _(`${current} av ${total}`, `${current} of ${total}`),
    a11yLabel: (current: number, total: number) =>
      _(
        `Viser ${current} av totalt ${total} sider`,
        `Showing ${current} of ${total} pages`,
      ),
  },
  date: {
    a11yLabel: (date: string) => _(`${date}`, `${date}`),
  },
};
export default Pagination;
