import {translation as _} from '../commons';

export const ShmoHelpTexts = {
  title: _('Hjelp', 'Help', 'Hjelp'),
  contactAndReport: _(
    'Kontakt og rapporter',
    'Contact and report',
    'Kontakt og rapporter',
  ),
  contactOperator: (operatorName: string) =>
    _(
      `Kontakt ${operatorName}`,
      `Contact ${operatorName}`,
      `Kontakt ${operatorName}`,
    ),
  contactOptions: _(
    'Kontaktalternativer',
    'Contact options',
    'Kontaktalternativ',
  ),
  phone: _('Telefon', 'Phone', 'Telefon'),
  contactForm: _('Kontaktskjema', 'Contact form', 'Kontaktskjema'),
  chatInBrowser: (domain: string) =>
    _(
      `Chat i nettleser (${domain})`,
      `Chat in browser (${domain})`,
      `Chat i nettlesar (${domain})`,
    ),
  readMoreAbout: (operatorName: string) =>
    _(
      `Les mer om ${operatorName}`,
      `Read more about ${operatorName}`,
      `Les meir om ${operatorName}`,
    ),
  reportParking: _(
    'Rapporter feilparkering',
    'Report parking violation',
    'Rapporter feilparkering',
  ),
  faq: _('Vanlige spørsmål', 'Frequently asked questions', 'Vanlege spørsmål'),
};
