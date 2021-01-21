import {translation as _} from '../../commons';
import {UserProfileWithCount} from '../../../screens/Ticketing/Purchase/Travellers/use-user-count-state';

const TravellersTexts = {
  header: {
    title: _('Velg sone'),
    leftButton: {
      text: _('Avbryt'),
      a11yLabel: _('Avbryt kjøpsprosessen'),
    },
  },
  travellerCounter: {
    text: (u: UserProfileWithCount) => _(u.name.value),
  },
  primaryButton: {
    text: _('Bekreft valg'),
    a11yHint: _('Aktivér for å bekrefte valg'),
  },
};
export default TravellersTexts;
