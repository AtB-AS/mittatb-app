import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';
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
      'Ikke mulig å sende stopp signal nå',
      'Not possible to send stop signal now',
      'Ikke mogleg å sende stopp signal no',
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
      'Vil du aktivere Reisehjelp?',
      'Do you want to enable Journey Aid?',
      'Vil du aktivere Reisehjelp?',
    ),
    description: _(
      'Reisehjelp er en egen visning i avganger hvor du kan sende stoppsignal til AtB sine busser rett fra appen.',
      'Journey Aid is a dedicated view in departures where you can send a stop signal to AtB buses directly from the app.',
      'Reisehjelp er ein eigen visning i avgangar der du kan sende stopp-signal til AtB sine bussar rett frå appen.',
    ),
    activate: _('Aktiver', 'Enable', 'Aktiver'),
    dismiss: _('Ikke aktiver', 'Do not enable', 'Ikke aktiver'),
  },
};

export default orgSpecificTranslations(TravelAidTexts, {
  fram: {
    onboarding: {
      description: _(
        'Reisehjelp er en egen visning i avganger hvor du kan sende stoppsignal til FRAM sine busser rett fra appen.',
        'Journey Aid is a dedicated view in departures where you can send a stop signal to FRAM buses directly from the app.',
        'Reisehjelp er ein eigen visning i avgangar der du kan sende stopp-signal til FRAM sine bussar rett frå appen.',
      ),
    },
  },
  nfk: {
    onboarding: {
      description: _(
        'Reisehjelp er en egen visning i avganger hvor du kan sende stoppsignal til Reis sine busser rett fra appen.',
        'Journey Aid is a dedicated view in departures where you can send a stop signal to Reis buses directly from the app.',
        'Reisehjelp er ein eigen visning i avgangar der du kan sende stopp-signal til Reis sine bussar rett frå appen.',
      ),
    },
  },
  troms: {
    onboarding: {
      description: _(
        'Reisehjelp er en egen visning i avganger hvor du kan sende stoppsignal til Svipper sine busser rett fra appen.',
        'Journey Aid is a dedicated view in departures where you can send a stop signal to Svipper buses directly from the app.',
        'Reisehjelp er ein eigen visning i avgangar der du kan sende stopp-signal til Svipper sine bussar rett frå appen.',
      ),
    },
  },
});
