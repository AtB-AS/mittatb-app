import {translation as _} from '../../commons';

const TravelAidSettingsTexts = {
  header: {
    accessibility: {
      title: _('Tilgjengelighet', 'Accessibility', 'Tilgjengelegheit'),
    },
    howTo: {
      title: _('Viktig å vite', 'Important information', 'Viktig å vite'),
    },
  },

  toggle: {
    title: _('Reisehjelp', 'Journey Aid', 'Reisehjelp'),
    subText: _(
      'Reisehjelp er en forenklet modus spesielt tilrettelagt for deg som trenger ekstra støtte når du reiser.\n\n* Stoppe en buss eller trikk med appen, fra holdeplassen der du skal på.\n* Raskere tilgang på sanntids-oppdateringer om ankomst og neste holdeplass.\n* Snarvei til gyldige billetter.\n* Invitasjonskode for tilgang til funksjonen får du gjennom Blindeforbundet eller AtBs kundeservice.',
      'Journey Aid is a simplified mode designed specifically for those who need extra support when traveling.\n\n* Use the app to signal a stop for a bus or tram from your boarding stop.\n* Get faster access to real-time updates on arrivals and upcoming stops, as well as a shortcut to your tickets.* Shortcut to valid tickets.* You can request an invitation code for this feature through the The Norwegian Association of the Blind and Partially Sighted or AtB’s customer service.',
      'Reisehjelp er en forenklet modus spesielt tilrettelagt for deg som trenger ekstra støtte når du reiser.\n\n* Stoppe en buss eller trikk med appen, fra holdeplassen der du skal på.\n* Raskere tilgang på sanntids-oppdateringer om ankomst og neste holdeplass.\n* Snarvei til gyldige billetter.\n* Invitasjonskode for tilgang til funksjonen får du gjennom Blindeforbundet eller AtBs kundeservice.',
    ),
  },

  button: {
    importantInfo: {
      title: _('Viktig å vite', 'Important information', 'Viktig å vite'),
      a11yHint: _(
        'Aktivér for å vise informasjonsside',
        'Activate to show information page',
        'Aktivér for å vise informasjonsside',
      ),
    },
    contact: {
      title: _(
        'Ring kundeservice',
        'Call Customer Service',
        'Ring kundeservice',
      ),
      a11yHint: _(
        'Aktivér for å ringe kundeservice',
        'Activate to call customer service',
        'Trykk for å ringe kundeservice',
      ),
    },
  },

  information: {
    howTo: {
      title: _(
        'Hvordan sende stopp',
        'How to send a stop',
        'Hvordan sende stopp',
      ),
      content: _(
        'Stoppsignal fra appen varsler sjåfør om at noen med ekstra behov skal av eller på.\n\n<br/>* I “Avganger”-fanen, velg holdeplassen du skal reise fra.\n* Fra buss-listen, velg riktig buss/trikk.\n* I visningen for bussen/trikken, trykk på Reisehjelp.\n* I Reisehjelp-modusen, trykk “Send stopp”.',
        '',
        '',
      ),
    },
    keepInMind: {
      title: _('Husk:', 'Keep in mind:', 'Husk:'),
      content: _(
        '* Følg retningslinjer, som å stå på ledelinjen eller lengst frem på holdeplassen, for å vise at du skal på.\n* Du kan bare stoppe én buss/ trikk om gangen.\n* Du kan ikke angre et stoppsignal som er sendt.',
        '* Follow guidelines, such as standing on the tactile guiding line or at the front of the stop, to signal that you’re boarding.\n* You can only stop one bus/tram at a time.\n * You cannot cancel a stop signal once it has been sent.',
        '',
      ),
    },
  },
};

export default TravelAidSettingsTexts;
