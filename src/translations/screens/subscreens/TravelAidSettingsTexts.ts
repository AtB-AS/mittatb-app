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
    title: _(
      'Reisehjelp i Avganger',
      'Journey Aid in Departures',
      'Reisehjelp i Avgangar',
    ),
  },
  description: _(
    'Reisehjelp gir deg sanntidsinformasjon før ankomst på valgt holdeplass og under reisen.\n\nDu finner Reisehjelp ved å velge en buss eller trikk under Avganger i hovedmenyen. ',
    'Journey Aid provides real-time information before arrival at the selected stop and during the journey.\n\nYou can find Journey Aid by selecting a bus or tram under Departures in the main menu.',
    'Reisehjelp gir deg sanntidsinformasjon før ankomst på vald haldeplass og under reisa.\n\nDu finn Reisehjelp ved å velje ein buss eller trikk under Avgangar i hovudmenyen.',
  ),

  button: {
    importantInfo: {
      title: _('Viktig å vite', 'Important information', 'Viktig å vite'),
      a11yHint: _(
        'Aktivér for å vise informasjonsside',
        'Activate to show information page',
        'Aktivér for å vise informasjonsside',
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
        "* Follow guidelines, such as standing on the tactile guiding line or at the front of the stop, to signal that you're boarding.\n* You can only stop one bus/tram at a time.\n * You cannot cancel a stop signal once it has been sent.",
        '* Følg retningslinjer, som å stå på ledelinja eller lengst fram på haldeplassen, for å vise at du skal på.\n* Du kan berre stoppe ein buss/trikk om gongen.\n* Du kan ikkje angre eit stoppsignal som er sendt.',
      ),
    },
  },
};

export default TravelAidSettingsTexts;
