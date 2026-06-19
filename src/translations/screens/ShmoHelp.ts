import {translation as _} from '../commons';

export const ShmoHelpTexts = {
  title: _('Hjelp', 'Help', 'Hjelp'),
  contactOptions: _(
    'Kontaktalternativer',
    'Contact options',
    'Kontaktalternativ',
  ),
  phone: _('Telefon', 'Phone', 'Telefon'),
  contactForm: _('Kontaktskjema', 'Contact form', 'Kontaktskjema'),
  chatInBrowser: _('Chat i nettleser', 'Chat in browser', 'Chat i nettlesar'),
  telephonePrefix: _('tlf.', 'tel.', 'tlf.'),
  readMoreAtPrefix: _('Les mer på', 'Read more at', 'Les meir på'),
  readMoreAt: (domain: string) =>
    _(
      `Les mer på ${domain}`,
      `Read more at ${domain}`,
      `Les meir på ${domain}`,
    ),
  reportParking: _(
    'Rapporter feilparkering',
    'Report parking violation',
    'Rapporter feilparkering',
  ),
  faq: _('Vanlige spørsmål', 'Frequently asked questions', 'Vanlege spørsmål'),
};
