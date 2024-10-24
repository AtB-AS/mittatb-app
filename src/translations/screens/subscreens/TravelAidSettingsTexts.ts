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
      'Reisehjelp er en forenklet modus spesielt tilrettelagt for deg som trenger ekstra støtte når du reiser.\n\n* Stopp en buss eller trikk med appen, fra holdeplassen der du skal på.\n* Raskere tilgang på sanntids-oppdateringer om ankomst og neste holdeplass.\n* Snarvei til gyldige billetter.',
      'Journey Aid is a simplified mode designed specifically for those who need extra support when traveling.\n\n* Use the app to signal a stop for a bus or tram from your boarding stop.\n* Get faster access to real-time updates on arrivals and upcoming stops, as well as a shortcut to your tickets.* Shortcut to valid tickets.',
      'Reisehjelp er ein forenkla modus spesielt tilrettelagt for deg som treng ekstra støtte når du reiser.\n\n* Stopp ein buss eller trikk med appen, frå haldeplassen der du skal på.\n* Raskare tilgang på sanntids-oppdateringar om ankomst og neste haldeplass.\n* Snarveg til gyldige billettar.',
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
        'Stoppsignal fra appen varsler sjåfør om at noen med ekstra behov skal av eller på.\n\n* I “Avganger”-fanen, velg holdeplassen du skal reise fra.\n* Fra buss-listen, velg riktig buss/trikk.\n* I visningen for bussen/trikken, trykk på Reisehjelp.\n* I Reisehjelp-modusen, trykk “Send stopp”.',
        'A stop signal from the app alerts the driver that someone with extra needs wants to get off or on.\n\n* In the "Departures" tab, select the stop you are departing from.\n* From the bus list, choose the correct bus/tram.\n* In the view for the bus/tram, tap on "Travel Assistance."\n* In Travel Assistance mode, press "Send Stop."',
        'Stoppsignal frå appen varslar sjåføren om at nokon med ekstra behov skal av eller på.\n\n* I "Avganger"-fanen, vel haldeplassen du skal reise frå.\n* Frå busslista, vel rett buss/trikk.\n* I visninga for bussen/trikken, trykk på "Reisehjelp."\n* I Reisehjelp-modusen, trykk "Send stopp."',
      ),
    },
    keepInMind: {
      title: _('Husk:', 'Keep in mind:', 'Husk:'),
      content: _(
        '* Følg retningslinjer, som å stå på ledelinjen eller lengst frem på holdeplassen, for å vise at du skal på.\n* Du kan bare stoppe én buss/trikk om gangen.\n* Du kan ikke angre et stoppsignal som er sendt.',
        '* Follow guidelines, such as standing on the tactile guiding line or at the front of the stop, to signal that you\'re boarding.\n* You can only stop one bus/tram at a time.\n * You cannot cancel a stop signal once it has been sent.',
        '* Følg retningslinjer, som å stå på ledelinja eller lengst fram på haldeplassen, for å vise at du skal på.\n* Du kan berre stoppe ein buss/trikk om gongen.\n* Du kan ikkje angre eit stoppsignal som er sendt.',
      ),
    },
  },
};

export default TravelAidSettingsTexts;
