import { translation as _ } from '../../commons';
const PrivacySettingsTexts = {
    sections: {
        other: {
            items: {
                deleteData: {
                    title: _('Tøm innsamlet data', 'Delete collected data', 'Tøm innsamlet data'),
                },
                controlPanel: {
                    title: _('Kontrollpanel for datainnsamling', 'Control panel for data collection', 'Kontrollpanel for datainnsamling'),
                    subTitle: _('Du kan se og laste ned data som blir samlet  om dine reisevaner. Det gjelder også data om busser og holdeplasser du er i nærheten av.', 'You can view and download data that is collected about your travel habits. This also applies to data about buses and bus stops you are near.', 'Du kan sjå og laste ned data som blir samla om dine reisevanar. Det gjeld også data om bussar og holdeplassar du er i nærleiken av.'),
                }
            }
        },
        consents: {
            title: _('Samtykke', 'Consent', 'Samtykke'),
            items: {
                collectBusAndStopData: {
                    title: _('Samle buss og holdeplassdata', 'Collect bus and stop data', 'Samle buss og holdeplassdata'),
                    subText: _(
                        'Du gir oss samtykke til å samle og analysere hvilke busser og bussholdeplasser du er i nærheten av ved hjelp av Bluetooth. Dataen brukes til å forbedre reisetilbudet i Trøndelag, og lar oss sende deg undersøkelser som er relevante for deg.',
                        'You give us consent to collect and analyze which buses and bus stops you are near using Bluetooth. The data is used to improve the travel offer in Trøndelag, and allows us to send you surveys that are relevant to you.',
                        'Du gir oss samtykke til å samle og analysere hvilke busser og bussholdeplasser du er i nærheten av ved hjelp av Bluetooth. Dataen brukes til å forbedre reisetilbudet i Trøndelag, og lar oss sende deg undersøkelser som er relevante for deg.',
                    ),
                },
            },
        },
    }
};

export default PrivacySettingsTexts;