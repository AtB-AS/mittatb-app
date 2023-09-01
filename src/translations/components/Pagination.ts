import {translation as _} from '../commons';

const Pagination = {
  previous: {
    label: _('Forrige', 'Previous', 'Førre'),
    a11yHint: _(
      'Aktivér for å vise forrige side',
      'Activate to show previous page',
      'Aktiver for å vise førre side',
    ),
  },
  next: {
    label: _('Neste', 'Next', 'Neste'),
    a11yHint: _(
      'Aktivér for å vise neste side',
      'Activate to show next page',
      'Aktiver for å vise neste side',
    ),
  },
  current: {
    label: (current: number, total: number) =>
      _(
        `${current} av ${total}`,
        `${current} of ${total}`,
        `${current} av ${total}`,
      ),
    a11yLabel: (current: number, total: number) =>
      _(
        `Viser ${current} av totalt ${total} sider`,
        `Showing ${current} of ${total} pages`,
        `Viser ${current} av totalt ${total} sider`,
      ),
  },
  date: {
    a11yLabel: (date: string) => _(`${date}`, `${date}`, `${date}`),
  },
};
export default Pagination;
