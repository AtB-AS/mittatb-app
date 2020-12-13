import {translation as _} from '../commons';

const Pagination = {
  previous: {
    label: _('Forrige'),
    a11yHint: _('Aktivér for å vise forrige side'),
  },
  next: {
    label: _('Neste'),
    a11yHint: _('Aktivér for å vise neste side'),
  },
  current: {
    label: (current: number, total: number) => _(`${current} av ${total}`),
    a11yLabel: (current: number, total: number) =>
      _(`Viser ${current} av totalt ${total} sider`),
  },
};
export default Pagination;
