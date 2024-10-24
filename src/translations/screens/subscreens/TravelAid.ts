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
  clock: (time: string) => _(`kl. ${time}`, `${time}`, `kl. ${time}`),
  error: {
    message: _(
      'Det oppstod en feil ved henting av reisedata for denne avgangen.',
      'There was a problem loading travel data for this trip.',
      'Det oppstod ein feil då vi prøvde å hente reisedata for denne avgangen.',
    ),
  },
  noRealtimeError: {
    title: _(
      'Ingen kontakt med kjøretøy',
      'No connection with vehicle',
      'Ingen kontakt med køyretøy',
    ),
    message: _(
      'Vi får ikke oppdatert kjøretøyets posisjon, og Reisehjelp er derfor utilgjengelig for denne avgangen. Vi jobber med å få kontakt.',
      "We're not receiving updates on the vehicle's position, so Journey Aid is unavailable for this trip. We're working to establish a connection.",
      'Vi får ikkje oppdatert køyretøyets posisjon, og Reisehjelp er difor utilgjengeleg for denne avgangen. Vi jobbar med å få kontakt.',
    ),
  },
};
