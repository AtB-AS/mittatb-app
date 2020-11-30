import {translation as _} from '../utils';

const ProfileTexts = {
  header: {
    title: _('Mitt AtB'),
    logo: {
      a11yLabel: _('Gå til startskjerm'),
    },
    backButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  favoriteList: {
    title: _('Favoritter'),
    add: _('Legg til favorittsted'),
    editButton: {
      a11yLabel: (place: string) => _(`Rediger favoritt: ${place}`),
    },
  },
  privacyStatementLabel: _(
    'Les vår personvernerklæring',
    'Go to our privacy statement',
  ),
};
export default ProfileTexts;
