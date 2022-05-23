import {translation as _} from '../../commons';
import orgSpecificTranslations from '@atb/translations/utils';

const PurchaseOverviewTexts = {
  header: {
    title: {
      single: _('Enkeltbillett', 'Single ticket'),
      period: _('Periodebillett', 'Periodic ticket'),
      carnet: _('Klippekort', 'Carnet ticket'),
    },
  },
  errorMessageBox: {
    title: _('Det oppstod en feil', 'An error occurred'),
    message: _(
      'Oops - vi klarte ikke å søke opp prisen. Supert om du prøver igjen 🤞',
      'Whoops - we were unable to retrieve cost. Please try again 🤞',
    ),
  },
  travelDate: {
    now: _('Oppstart nå', 'Starting now'),
    futureDate: (time: string) => _(`Oppstart ${time}`, `Start time ${time}`),
    a11yHint: _(
      'Aktivér for å velge starttidspunkt',
      `Activate to select start time`,
    ),
  },
  travellers: {
    prefix: _('Nåværende valg: ', 'Current selection: '),
    noTravellers: _(`Ingen reisende`, `No travellers`),
    travellersCount: (count: number) =>
      _(`${count} reisende`, `${count} travellers`),
    a11yHint: _(
      'Aktivér for å velge reisende',
      `Activate to select travellers`,
    ),
  },
  tariffZones: {
    a11yHint: _('Aktivér for å velge soner', 'Activate to select zones'),
  },
  product: {
    a11yHint: _(
      'Aktivér for å velge billettype',
      'Activate to select ticket type',
    ),
  },
  warning: _(
    'Når du er ute og reiser må du ha med t:kortet som er registrert på din profil.',
    'When traveling, you need to bring the t:card registered on your profile.',
  ),
  samarbeidsbillettenInfo: {
    single: _(
      'Enkeltbilletter i sone A kan også brukes på tog i sone A.',
      'Single tickets in zone A can also be used on train in zone A.',
    ),
    period: _(
      'Periodebilletter i sone A kan også brukes på tog i sone A.',
      'Periodic tickets in zone A can also be used on train in zone A.',
    ),
  },
  notInspectableTokenDeviceWarning: _(
    'Du kan ikke reise med denne mobilen. Du kan bytte hvor du bruker billetten din fra **Min profil**.',
    `You can't travel with this phone. Go to **My profile** to switch where your tickets are used.`,
  ),
  zones: {
    label: {
      text: _('Velg sone(r)', 'Select zone(s)'),
      a11yLabel: _('Velg soner', 'Select zones'),
    },
  },
  duration: {
    title: _('Velg varighet', 'Select duration'),
    days: _('dager', 'days'),
    chipHint: _('Aktiver for å velge varighet', 'Activate to select duration'),
  },
  travellerSelection: {
    title: _('Velg passasjerkategori', 'Select travellers'),
    a11yHint: _('Aktiver for å velge reisende', 'Activate to select traveller'),
  },
  startTime: {
    title: _('Velg oppstartstidspunkt', 'Select start time'),
    now: _('Oppstart nå', 'Start now'),
    later: _('Senere', 'Later'),
    a11yLaterHint: _(
      'Aktiver for å velge et senere oppstartstidspunkt',
      'Activate to select a later start time',
    ),
    a11yNowHint: _(
      'Aktiver for å sette oppstartstidspunkt til nå.',
      'Activate to set ticket start time to now.',
    ),
  },
  summary: {
    price: (priceString: string) =>
      _(`Total ${priceString} kr`, `Total ${priceString} kr`),
    message: _(
      `Gjelder for buss/trikk i valgte soner`,
      `Applies for bus/tram in selected zones`,
    ),
    button: _('Til betaling', 'To payment'),
  },
};

export default orgSpecificTranslations(PurchaseOverviewTexts, {
  nfk: {
    warning: _(
      'Når du er ute og reiser må du ha med reisekortet som er registrert på din profil.',
      'When traveling, you need to bring the travelcard registered on your profile.',
    ),
  },
});
