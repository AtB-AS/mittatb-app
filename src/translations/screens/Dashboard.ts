import {translation as _} from '../commons';

const DashboardTexts = {
  header: {
    title: _('Reisesøk', 'Travel search', 'Reisesøk'),
    accessibility: {
      logo: _('Nullstill reisesøk', 'Reset search', 'Nullstill reisesøk'),
    },
  },
  buyButton: _('Kjøp billetter', 'Buy tickets', 'Kjøp billettar'),
  announcemens: {
    header: _('Aktuelt', 'Latest', 'Aktuelt'),
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
      a11yHint: {
        external: _(
          `Aktiver for å lese mer på ekstern side`,
          `Activate to read more (external content)`,
          `Aktiver for å lese meir på ekstern side`,
        ),
        deeplink: _(
          'Aktiver for å åpne lenke',
          'Activate to open link',
          'Aktiver for å opne lenke',
        ),
        bottom_sheet: _(
          `Aktiver for å lese mer`,
          `Activate to read more`,
          `Aktiver for å lese meir`,
        ),
      },
      defaultLabel: (announcementTitle?: string) =>
        announcementTitle
          ? _(
              `Les mer om ${announcementTitle}`,
              `Read more about ${announcementTitle}`,
              `Les meir om ${announcementTitle}`,
            )
          : _('Les mer', 'Read mre', 'Les meir'),
    },
  },
};

export default DashboardTexts;
