import {translation as _} from '../../commons';
import {UserProfileWithCount} from '../../../screens/Ticketing/Purchase/Travellers/use-user-count-state';

const TravellersTexts = {
  header: {
    title: _('Reisende'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
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
