import {translation as _} from '../../commons';
import {UserProfileWithCount} from '../../../screens/Ticketing/Purchase/Travellers/use-user-count-state';

const TravellersTexts = {
  header: {
    title: _('Velg reisende', 'Select travellers'),
    leftButton: {
      a11yLabel: _('Gå tilbake', 'Cancel'),
      a11yHint: _(
        'Aktivèr for å gå tilbake uten å lagre valg av reisende',
        'Activate to go back without selecting travellers',
      ),
    },
  },
  primaryButton: {
    text: _('Lagre valg av reisende', 'Confirm travellers selection'),
    a11yHint: _(
      'Aktivér for å lagre valg av reisende',
      'Activate to confirm your selection of travellers',
    ),
  },
};
export default TravellersTexts;
