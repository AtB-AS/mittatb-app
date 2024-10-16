import {translation as _} from '../../commons';
export const TravelAidTexts = {
  close: _('Lukk Reisehjelp', 'Close Journey Aid', 'Lukk Reisehjelp'),
  arrivesAt: _('Kommer til:', 'Arrives at:', 'Kommer'),
  from: _('Fra:', 'From:', 'Frå'),
  nextStop: _('Neste holdeplass:', 'Next stop:', 'Neste holdeplass'),
  scheduledTime: (time: string) =>
    _(`Rutetid kl. ${time}`, `Scheduled at ${time}`, `Rutetid kl. ${time}`),
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
