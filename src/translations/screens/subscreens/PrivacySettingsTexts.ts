import { translation as _ } from '../../commons';
const PrivacySettingsTexts = {
    sections: {
        items: {
            clarCollectedData: {
                title: _('Tøm innsamlet data', 'Clear collected data', 'Tøm innsamla data'),
            },
            controlPanel: {
                title: _('Kontrollpanel for datainnsamling', 'Control panel for data collection', 'Kontrollpanel for datainnsamling'),
                subTitle: _(
                    'Du kan se og laste ned data som blir samlet  om dine reisevaner. Det gjelder også data om busser og holdeplasser du er i nærheten av.',
                    'You can view and download data that is collected about your travel habits. This also applies to data about buses and stops you are close to.',
                    'Du kan se og laste ned data som blir samlet  om dine reisevaner. Det gjelder også data om busser og holdeplasser du er i nærheten av.'
                ),
                a11yHint: _(
                    'Aktivér for å gå til kontrollpanel for datainnsamling (ekstern side)',
                    'Activate to control panel for data collection (external content)',
                    'Aktiver for å gå til kontrollpanel for datainnsamling (ekstern side)',
                ),
            }
        },
        consents: {
            title: _('Samtykke', 'Consent', 'Samtykke'),
            items: {
                CollectTravelHabits: {
                    title: _('Samle reisevaner', 'Collect travel habits', 'Samle reisevanar'),
                    subText: _(
                        'Du gir oss samtykke til å samle og analysere dine reisevaner ved hjelp av Bluetooth, din posisjon, bevegelses- og treningsaktivitet. Vi kan for eksempel samle data om holdeplasser i nærheten, busser du tar, hvor du reiser og om du går, sykler eller reiser med bil. Dataene brukes til å forbedre reisetilbudet ditt i Trøndelag. Samtykket lar oss sende deg undersøkelser som er relevante for deg.',
                        'You give us consent to collect and analyze your travel habits using Bluetooth, your location, movement and exercise activity. For example, we may collect data about nearby stops, buses you take, where you travel and whether you walk, cycle or travel by car. The data is used to improve your travel offer in Trøndelag. The consent allows us to send you surveys that are relevant to you.',
                        'Du gir oss samtykke til å samle og analysere reisevanane dine ved hjelp av Bluetooth, din posisjon, bevegings- og treningsaktivitet. Vi kan for eksempel samle data om haldeplassar i nærleiken, bussar du tek, kvar du reiser og om du går, syklar eller reiser med bil. Dataene brukast til å forbetre reisetilbodet ditt i Trøndelag. Samtykket lar oss sende deg undersøkingar som er relevante for deg.',
                    ),
                },
            },
        },
    },
    clearCollectedData: {
        label: _(
            'Tøm innsamlet data',
            'Clear collected data',
            'Tøm innsamla data',
        ),
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
            confirm: _('Tøm innsamlet data', 'Clear collected data', 'Tøm innsamla data'),
        },
    },
};

export default PrivacySettingsTexts;