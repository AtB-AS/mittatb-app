import {translation as _} from '../commons';

const CityBoxMessageTexts = {
  message: (city: string) =>
    _(
      `Reis fra adresse til adresse i ${city} med AtB Bestill.`,
      `Travel from address to address in ${city} with AtB Bestill.`,
    ),
  actionButtons: {
    bookByPhone: _('Bestill på telefon', 'Book by phone'),
    bookOnline: _('Bestill på nett', 'Book online'),
    moreInfo: _('Mer info', 'More info'),
  },
  a11yHintForExternalContent: _(
    'Aktivér for å åpne ekstern side',
    'Activate to open external content',
  ),
  a11yHintForPhone: _('Aktiver for å ringe', 'Activate to call'),
};

export default CityBoxMessageTexts;
