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
      'Reisehjelp er en forenklet visning av buss- og trikkeavganger, tilpasset for deg som trenger ekstra støtte på reisen. Den gir rask tilgang til sanntidsoppdateringer om ankomsttid og neste holdeplass.\n\n* Aktiver Reisehjelp ved å trykke på bryteren øverst til høyre.\n* Velg holdeplass under «Avganger»-fanen.\n* Velg riktig buss eller trikk fra listen.\n* Trykk på knappen for Reisehjelp øverst i visningen.\n\nVi jobber fortsatt med funksjonen, og ny funksjonalitet vil komme fortløpende. Del gjerne din tilbakemelding!',
      'Journey Aid is a simplified view of bus and tram departures, designed for those who need extra support when traveling. It provides quick access to real-time updates on arrival times and the next stop.\n\n* Activate Journey Aid by tapping the switch at the top right.\n* Select your stop under the "Departures" tab.\n* Choose the correct bus or tram from the list.\n* Tap the Journey Aid button at the top of the screen.\n\nWe are still working on this feature, and new functionality will be added continuously. Please share your feedback with us!',
      'Reisehjelp er ei forenkla visning av buss- og trikkeavgangar, tilpassa for deg som trenger ekstra støtte på reisa. Den gir rask tilgang til sanntidsoppdateringer om framkomsttid og neste haldeplass.\n\n* Aktivér Reisehjelp ved å trykke på brytaren øvst til høgre.\n* Velg haldeplass under «Avgangar»-fanen.\n* Velg riktig buss eller trikk frå lista.\n* Trykk på knappen for Reisehjelp øvst i visninga.\n\nVi jobbar fortsatt med funksjonen, og ny funksjonalitet vil komme fortløpande. Del gjerne din tilbakemelding!',
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
