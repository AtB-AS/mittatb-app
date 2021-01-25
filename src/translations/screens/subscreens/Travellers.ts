import {translation as _} from '../../commons';
import {UserProfileWithCount} from '../../../screens/Ticketing/Purchase/Travellers/use-user-count-state';

const TravellersTexts = {
  header: {
    title: _('Velg sone', 'Select zone'),
    leftButton: {
      text: _('Avbryt', 'Cancel'),
      a11yLabel: _('Avbryt kjøpsprosessen', 'Cancel purchase'),
    },
  },
  primaryButton: {
    text: _('Bekreft valg', 'Confirm choice'),
    a11yHint: _(
      'Aktivér for å bekrefte valg',
      'Activate to confirm your choice',
    ),
  },
};
export default TravellersTexts;
