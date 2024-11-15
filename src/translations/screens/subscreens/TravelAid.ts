import {translation as _} from '../../commons';
export const TravelAidTexts = {
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
      'Ikke mulig å sende stopp signal nå',
      'Not possible to send stop signal now',
      'Ikke mogleg å sende stopp signal no',
    ),
  },
  error: {
    message: _(
      'Det oppstod en feil ved henting av reisedata for denne avgangen.',
      'There was a problem loading travel data for this trip.',
      'Det oppstod ein feil då vi prøvde å hente reisedata for denne avgangen.',
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
};
