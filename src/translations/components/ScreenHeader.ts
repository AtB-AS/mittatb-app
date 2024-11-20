import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const ScreenHeaderTexts = {
  headerButton: {
    back: {
      text: _('Tilbake', 'Back', 'Tilbake'),
      a11yHint: _(
        'Aktivér for å gå tilbake',
        'Activate to go back',
        'Aktivér for å gå tilbake',
      ),
    },
    cancel: {
      text: _('Avbryt', 'Cancel', 'Avbryt'),
      a11yHint: _(
        'Aktivér for å avbryte',
        'Activate to cancel',
        'Aktivér for å avbryte',
      ),
    },
    close: {
      text: _('Lukk', 'Close', 'Lukk'),
      a11yHint: _(
        'Aktivér for å lukke',
        'Activate to close',
        'Aktivér for å lukke',
      ),
    },
    'status-disruption': {
      a11yHint: _(
        'Aktivér for å gå til driftsavvik',
        'Ativate to go to service disruptions',
        'Aktivér for å gå til driftsavvik',
      ),
    },
    skip: {
      text: _('Hopp over', 'Skip', 'Hopp over'),
      a11yHint: _(
        'Aktivér for å hoppe over',
        'Activate to skip',
        'Aktivér for å hoppe over',
      ),
    },
    chat: {
      a11yHint: _('Kontakt AtB', 'Contact AtB', 'Kontakt AtB'),
    },
    info: {
      text: _('Info', 'Info', 'Info'),
    },
  },
};

export default orgSpecificTranslations(ScreenHeaderTexts, {
  nfk: {
    headerButton: {
      chat: {
        a11yHint: _(
          'Kontakt Reis Nordland',
          'Contact Reis Nordland',
          'Kontakt Reis Nordland',
        ),
      },
    },
  },
  fram: {
    headerButton: {
      chat: {
        a11yHint: _('Kontakt FRAM', 'Contact FRAM', 'Kontakt FRAM'),
      },
    },
  },
  troms: {
    headerButton: {
      chat: {
        a11yHint: _('Kontakt Svipper', 'Contact Svipper', 'Kontakt Svipper'),
      },
    },
  },
});
