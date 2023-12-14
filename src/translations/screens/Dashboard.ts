import { translation as _ } from '../commons';

const DashboardTexts = {
  header: {
    title: _('Reisesøk', 'Travel search', 'Reisesøk'),
    accessibility: {
      logo: _('Nullstill reisesøk', 'Reset search', 'Nullstill reisesøk'),
    },
  },
  buyButton: _('Kjøp billetter', 'Buy tickets', 'Kjøp billettar'),
  announcemens: {
    header: _('Aktuelt', 'Announcements', 'Aktuelt'),
    button: {
      accessibility: _(
        'Aktiver for å lese mer',
        'Activate to read more',
        'Aktiver for å lese meir',
      ),
    },
    announcement: {
      closeA11yHint: _('Lukk melding', 'Close announcement', 'Lukk melding'),
    },
    buttonAction: {
      external: _(
        `Aktiver for å lese mer på ekstern side`,
        `Activate to read more (external content)`,
        `Aktiver for å lese meir på ekstern side`,
      ),
      deeplink: _('Aktiver for å åpne lenke', 'Activate to open link', 'Aktiver for å opne lenke'),
      bottom_sheet: _(
        `Aktiver for å lese mer i appen`,
        `Activate to read more (in app)`,
        `Aktiver for å lese meir i appen`,
      ),
    },
  },
};

export default DashboardTexts;
