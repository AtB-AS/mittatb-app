import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const ScreenHeaderTexts = {
  headerButton: {
    back: {
      text: _('Tilbake', 'Back'),
      a11yHint: _('Aktivér for å gå tilbake', 'Activate to go back'),
    },
    cancel: {
      text: _('Avbryt', 'Cancel'),
      a11yHint: _('Aktivér for å avbryte', 'Activate to cancel'),
    },
    close: {
      text: _('Lukk', 'Close'),
      a11yHint: _('Aktivér for å lukke', 'Activate to close'),
    },
    'status-disruption': {
      a11yHint: _(
        'Aktivér for å gå til driftsavvik',
        'Ativate to go to service disruptions',
      ),
    },
    skip: {
      text: _('Hopp over', 'Skip'),
      a11yHint: _('Aktivér for å hoppe over', 'Activate to skip'),
    },
    chat: {
      a11yHint: _('Kontakt AtB', 'Contact AtB'),
    },
  },
};

export default orgSpecificTranslations(ScreenHeaderTexts, {
  nfk: {
    headerButton: {
      chat: {
        a11yHint: _('Kontakt Reis Nordland', 'Contact Reis Nordland'),
      },
    },
  },
});
