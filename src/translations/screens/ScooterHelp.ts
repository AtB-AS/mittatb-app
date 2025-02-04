import {translation as _} from '../commons';

export const ScooterHelpTexts = {
  title: _('Hjelp', 'Help', 'Hjelp'),
  contactAndReport: _(
    'Kontakt og rapporter',
    'Contact and report',
    'Kontakt og rapporter',
  ),
  contactOperator: (operatorName: string) => {
    return _(
      `Kontakt ${operatorName}`,
      `Contact ${operatorName}`,
      `Kontakt ${operatorName}`,
    );
  },
  reportParking: _(
    'Rapporter feilparkering',
    'Report parking violation',
    'Rapporter feilparkering',
  ),

  faq: _(
    'Ofte stilte spørsmål',
    'Frequently asked questions',
    'Ofte stilte spørsmål',
  ),
};
