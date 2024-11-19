import {translation as _} from '../../commons';
const PrivacySettingsTexts = {
  sections: {
    items: {
      clarCollectedData: {
        title: _(
          'Tøm innsamlet data',
          'Clear collected data',
          'Tøm innsamla data',
        ),
      },
      dataSharingButton: {
        title: _(
          'Les om hvordan vi bruker dine personopplysninger',
          'Read about how we use your personal data',
          'Les om korleis vi bruker personopplysningane dine',
        ),
        a11yHint: _(
          'Aktiver for å lese mer på ekstern side',
          'Activate to read more (external content)',
          'Aktiver for å lese meir på ekstern side',
        ),
      },
      controlPanel: {
        title: _(
          'Kontrollpanel for datainnsamling',
          'Control panel for data collection',
          'Kontrollpanel for datainnsamling',
        ),
        subTitle: _(
          'Du kan se og laste ned data som blir samlet om dine reisevaner. Det gjelder også data om busser og holdeplasser du er i nærheten av.',
          'You can view and download data that is collected about your travel habits. This also applies to data about buses and stops you are close to.',
          'Du kan sjå og laste ned data som blir samla om reisevanane dine. Det gjeld også data om bussar og haldeplassar du er i nærleiken av.',
        ),
        a11yHint: _(
          'Aktivér for å gå til kontrollpanel for datainnsamling (ekstern side)',
          'Activate to go to control panel for data collection (external content)',
          'Aktiver for å gå til kontrollpanel for datainnsamling (ekstern side)',
        ),
      },
    },
    consents: {
      title: _('Samtykke', 'Consent', 'Samtykke'),
      items: {
        CollectTravelHabits: {
          title: _(
            'Samle reisevaner',
            'Collect travel habits',
            'Samle reisevanar',
          ),
          subText: _(
            'Du gir oss samtykke til å samle og analysere dine reisevaner. Vi kan for eksempel samle data om holdeplasser i nærheten, busser du tar, hvor du reiser og om du går, sykler eller reiser med bil. Dataene brukes til å forbedre reisetilbudet ditt i Trøndelag. Samtykket lar oss sende deg undersøkelser som er relevante for deg.',
            'You give us consent to collect and analyze your travel habits. For example, we may collect data about nearby stops, buses you take, where you travel and whether you walk, cycle or travel by car. The data is used to improve your travel offer in Trøndelag. The consent allows us to send you surveys that are relevant to you.',
            'Du gir oss samtykke til å samle og analysere reisevanane dine. Vi kan for eksempel samle data om haldeplassar i nærleiken, bussar du tek, kvar du reiser og om du går, syklar eller reiser med bil. Dataene brukast til å forbetre reisetilbodet ditt i Trøndelag. Samtykket lar oss sende deg undersøkingar som er relevante for deg.',
          ),
        },
      },
    },
  },
  clearCollectedData: {
    label: _('Tøm innsamlet data', 'Clear collected data', 'Tøm innsamla data'),
    a11yHint: _(
      'Aktivér for å tømme innsamlet data',
      'Activate to clear collected data',
      'Aktivér for å tømme innsamla data',
    ),
    confirmTitle: _(
      'Er du sikker på at du vil slette innsamlet data?',
      'Are you sure you want to delete collected data?',
      'Er du sikker på at du vil slette innsamla data?',
    ),
    alert: {
      cancel: _('Avbryt', 'Cancel', 'Avbryt'),
      confirm: _(
        'Tøm innsamlet data',
        'Clear collected data',
        'Tøm innsamla data',
      ),
    },
  },
  permissionsAlert: {
    title: _(
      `“AtB” vil bruke Bluetooth, posisjonen din også når appen ikke er åpen, bevegelses- og treningsaktivitet`,
      `“AtB” wants to use Bluetooth, your location when the app is closed, and motion and fitness activity`,
      `“AtB” vil bruke Bluetooth, posisjonen din også når appen ikkje er open, bevegelses- og treningsaktivitet`,
    ),
    message: _(
      'Dette vil gi oss verdifull læring om hvor og hvordan kunder reiser. Vi kan for eksempel se om kunder velger å sykle, gå eller kjøre bil fremfor å busse. Det vil hjelpe oss til å kunne forbedre ditt reisetilbud.',
      'This will give us valuable insights into where and how customers travel. For example, we can see if customers choose to travel by bike, walk or drive instead of taking the bus. It will help us improve our improve our services to make them better for you.',
      'Dette vil gi oss verdifull læring om kor og korleis kundar reiser. Vi kan for eksempel sjå om kundar vel å sykle, gå eller køyre bil framfor å busse. Det vil hjelpe oss til å kunne forbetre reisetilbodet ditt.',
    ),
    action: _('Gå til innstillinger', 'Open settings', 'Gå til innstillingar'),
  },
};

export default PrivacySettingsTexts;
