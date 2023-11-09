import { translation as _ } from '../commons';

const ShareTravelHabitsTexts = {
  title: _(
    'Vil du dele data om dine reisevaner?',
    'Do you want to share data about your travel habits?',
    'Vil du dele data om reisevanane dine?',
  ),
  description: {
    improvement: _(
      'Med din hjelp kan vi gjøre reisetilbudet i Trøndelag enda bedre.',
      'With your help, we can make the travel offer in Trøndelag even better.',
      'Med di hjelp kan vi gjere reisetilbodet i Trøndelag enda betre.',
    ),
    safety: _(
      'Å dele data med oss er helt trygt, og du kan når som helst ombestemme deg.',
      'Sharing data with us is completely safe and you can change your mind at any time.',
      'Å dele data med oss er heilt trygt, og du kan når som helst ombestemme deg.',
    ),
  },
  readMoreAboutDataSharing: _(
    'Les hvordan vi bruker dine personopplysninger',
    'Read how we use your personal data',
    'Les korleis vi brukar personopplysningane dine',
  ),
  readMoreAboutDataSharingA11yHint: _(
    'Les hvordan vi bruker dine personopplysninger på ekstern side',
    'Read how we use your personal data (external content)',
    'Les korleis vi brukar personopplysningane dine på ekstern side',
  ),
  bluetoothInfo: _(
    'Hvis du tillater at appen bruker Bluetooth, skrur du samtidig på deling av dine reisevaner og av busser og holdeplasser i nærheten av deg. Du skrur også på varslinger om relevante undersøkelser.',
    'If you allow the app to use Bluetooth, you simultaneously turn on the sharing of your travel habits and of buses and stops near you. You also turn on notifications about relevant surveys.',
    'Om du tillet at appen brukar Bluetooth, skrur du samtidig på deling av reisevanane dine og av bussar og haldeplassar i nærheita av deg. Du skrur også på varslingar om relevante undersøkingar.',
  ),
  choosePermissions: _('Velg tillatelser', 'Choose permissions', 'Vel løyve'),
  permissions: {
    bluethooth: {
      title: _('Bluetooth', 'Bluetooth', 'Bluetooth'),
      message: _(
        "Du gir oss lov til å gjenkjenne busser og bussholdeplasser i nærheten. Det gjør at vi kan analysere hvor du og andre kunder reiser, og til å sende deg relevante undersøkelser. Det vil hjelpe oss til å kunne forbedre reisetilbudet.",
        "You give us permission to recognize buses and bus stops nearby. This enables us to analyze where you and other customers travel, and to send you relevant surveys. It will help us to be able to improve the travel offer.",
        "Du gir oss løyve til å kjenna att bussar og buss-stopp i nærleiken. Dette gjer at vi kan analysere kvar du og andre kundar reiser, og til å senda deg relevante undersøkingar. Det vil hjelpa oss til å kunne betra reisetilbodet."
      )
    },
    locationAlways: {
      title: _('Posisjon', 'Location', 'Posisjon'),
      message: _(
        "I tillegg til å kunne vise din posisjon i kart og til å planlegge reiser, vil vi få verdifull læring om hvor du og andre kunder reiser. Det vil hjelpe oss til å kunne forbedre reisetilbudet.",
        "In addition to displaying your location on maps and planning trips, we gain valuable insights into where you and other customers travel. This helps us improve our travel offerings.",
        "I tillegg til å kunne vise di posisjon i kart og til å planleggje reiser, vil vi få verdifull læring om kor du og andre kundar reiser. Det vil hjelpe oss til å kunne forbetre reisetilbodet."
      )
    },
    locationWhenInUser: {
      title: _('Posisjon', 'Location', 'Posisjon'),
      message: _(
        'Vi bruker posisjon til å vise din posisjon i kart og reisesøk, og til å finne holdeplasser og steder i nærheten.',
        'We use your location to display it on maps and in travel searches, and to find stops and places nearby.',
        'Vi brukar posisjon til å vise di posisjon i kart og reisesøk, og til å finne haldeplassar og stader i nærleiken.'
      ),
    },
    motion: {
      title: _('Fysisk aktivitet', 'Physical activity', 'Fysisk aktivitet'),
      message: _(
        "Du gir tillatelse til å bruke bevegelsesdata til analyse og større forståelse av reisemønster, f.eks. for å skille mellom sykling, gåing og bilkjøring.",
        "You give permission to use movement data for analysis and greater understanding of travel patterns, e.g. to distinguish between cycling, walking and driving.",
        "Du gir løyve til å bruke rørsledata til analyse og større forståing av reisemønster, til dømes for å skilje mellom sykling, gåing og bilkøyring."
      )
    },
  }
};
export default ShareTravelHabitsTexts;
