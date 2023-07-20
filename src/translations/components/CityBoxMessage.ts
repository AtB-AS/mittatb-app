import {translation as _} from '../commons';

const CityBoxMessageTexts = {
  message: (city: string) =>
    _(
      `Reis fra adresse til adresse i ${city} med AtB Bestill.`,
      `Travel from address to address in ${city} with AtB Bestill.`,
      `Reis frå adresse til adresse i ${city} med AtB Bestill.`,
    ),
  actionButtons: {
    bookByPhone: _(
      'Bestill på telefon',
      'Book by phone',
      'Bestill på telefonen',
    ),
    bookOnline: _('Bestill på nett', 'Book online', 'Bestill på nettet'),
    moreInfo: _('Mer info', 'More info', 'Meir info'),
  },
  a11yHintForExternalContent: _(
    'Aktivér for å åpne ekstern side',
    'Activate to open external content',
    'Aktiver for å opne ekstern side',
  ),
  a11yHintForPhone: _(
    'Aktiver for å ringe',
    'Activate to call',
    'Aktiver for å ringee',
  ),
};

export default CityBoxMessageTexts;
