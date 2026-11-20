import {translation as _} from '../commons';

export const NotificationBadgeTexts = {
  a11yLabel: (count: number) =>
    count === 1
      ? _(`${count} ny`, `${count} new`, `${count} ny`)
      : _(`${count} nye`, `${count} new`, `${count} nye`),
};
