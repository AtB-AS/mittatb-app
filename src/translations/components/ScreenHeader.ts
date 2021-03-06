import {translation as _} from '../commons';

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
    home: {
      a11yHint: _(
        'Aktivér for å gå til startskjerm',
        'Ativate to go to start screen',
      ),
    },
    skip: {
      text: _('Hopp over', 'Skip'),
      a11yHint: _('Aktivér for å hoppe over', 'Activate to skip'),
    },
  },
};

export default ScreenHeaderTexts;
