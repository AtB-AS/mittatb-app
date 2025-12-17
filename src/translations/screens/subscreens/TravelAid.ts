import {translation as _} from '../../commons';

const TravelAidTexts = {
  close: _('Lukk Reisehjelp', 'Close Journey Aid', 'Lukk Reisehjelp'),
  stopPlaceHeader: {
    from: _('Fra:', 'From:', 'Frå:'),
    arrivesAt: _('Kommer til:', 'Arrives at:', 'Kommer til:'),
    nextStop: _('Neste holdeplass:', 'Next stop:', 'Neste haldeplass:'),
    endOfLine: _('Siste holdeplass:', 'Last stop:', 'Siste haldeplass:'),
  },
  scheduledTime: (time: string) =>
    _(`Rutetid kl. ${time}`, `Scheduled at ${time}`, `Rutetid kl. ${time}`),
  scheduledTimeA11yLabel: (time: string) =>
    _(
      `Rutetid klokken. ${time}`,
      `Scheduled at ${time}`,
      `Rutetid klokken. ${time}`,
    ),
  stopButton: {
    text: _('Send stopp', 'Send stop', 'Send stopp'),
    successMessage: _(
      'Stoppet er sendt!',
      'The stop is sent!',
      'Stoppet er sendt!',
    ),
    notAvailable: _(
      'Ikke mulig å sende stoppsignal nå',
      'Not possible to send stop signal now',
      'Ikke mogleg å sende stoppsignal no',
    ),
  },
  apiError: {
    message: _(
      'Det oppstod en feil ved henting av reisedata for denne avgangen.',
      'There was a problem loading travel data for this trip.',
      'Det oppstod ein feil då vi prøvde å hente reisedata for denne avgangen.',
    ),
  },
  noEstimatedCallsError: {
    message: _(
      'Denne reisen har ingen kommende avganger.',
      'This journey has no upcoming departures.',
      'Denne reisa har ingen kommende avgangar.',
    ),
  },
  noRealtimeError: {
    title: _(
      'Reisehjelp utilgjengelig for avgangen',
      'Journey aid unavailable for this departure',
      'Reisehjelp utilgjengeleg for denne avgangen',
    ),
    message: _(
      'Vi har ingen kontakt med kjøretøyet. Prøv igjen senere eller velg en annen avgang.',
      'We currently have no contact with the vehicle. Please try again later or choose a different departure.',
      'Vi har ingen kontakt med køyretøyet. Prøv igjen seinare eller velg ein annan avgang.',
    ),
  },
  onboarding: {
    title: _(
      'Vil du prøve stoppknapp?',
      'Want to try our stop button?',
      'Vil du prøve stoppknapp?',
    ),
    description: _(
      'For å få tilgang til stoppknappen i appen, må du slå på Reisehjelp her på denne siden eller i appens tilgjengelighetsinnstillinger.\n\nReisehjelp gir deg mulighet til å stoppe buss og trikk fra holdeplass. I tillegg får du sanntidsinformasjon før ankomst på valgt holdeplass og under reisen.\n\nDu finner Reisehjelp ved å velge en buss eller trikk under Avganger i hovedmenyen.',
      "To access the stop button in the app, you need to enable Journey Aid here on this page or in the app's accessibility settings.\n\nJourney Aid lets you stop buses and trams from the stop. In addition, you get real-time information before arrival at the selected stop and during the journey.\n\nYou can find Journey Aid by selecting a bus or tram under Departures in the main menu.",
      'For å få tilgang til stoppknappen i appen, må du slå på Reisehjelp her på denne sida eller i appens tilgjengelegheitsinnstillingar.\n\nReisehjelp gir deg moglegheit til å stoppe buss og trikk frå haldeplass. I tillegg får du sanntidsinformasjon før ankomst på vald haldeplass og under reisa.\n\nDu finn Reisehjelp ved å velje ein buss eller trikk under Avgangar i hovudmenyen.',
    ),
    activate: _('Slå på Reisehjelp', 'Enable Journey Aid', 'Slå på Reisehjelp'),
    skip: _('Hopp over', 'Skip', 'Hopp over'),
  },
};

export default TravelAidTexts;
