import {translation as _} from '../../commons';
const MobileTokenOnboardingTexts = {
  info1: {
    heading: _('En mer fleksibel reisehverdag', ''),
    description: _(
      'Du velger selv hvordan du vil bruke og vise frem billetten din.',
      '',
    ),
  },
  info2: {
    heading: _('Velg mellom t:kort eller mobil', ''),
    description: _(
      'Du kan bruke billetten din på et t:kort eller en mobil med appen AtB installert – men kun på én dings om gangen.',
      '',
    ),
    or: _('eller', 'or'),
  },
  info3: {
    heading: _('Vi tar vare på billetten din', ''),
    description: _(
      'Billetten din er trygt lagret på Min profil. Dermed vil du aldri miste den – selv om du mister t:kortet eller bytter mobil.',
      '',
    ),
  },
  tCard: {
    heading: _('Du bruker nå **t:kort**', ''),
    description: _(
      'Husk å ta det med deg når du reiser.\n\nDu kan alltid bytte til en mobil ved å logge inn og gå til Min profil.',
      '',
    ),
    button: _('Bytt til mobil', ''),
  },
  phone: {
    heading: _('Du bruker nå **mobil**', ''),
    description: _(
      'Husk å ta den med deg når du reiser.\n\nDu kan alltid bytte til t:kort eller en annen mobil ved logge inn og gå til Min profil.',
      '',
    ),
    button: _('Bytt til t:kort eller annen mobil', ''),
  },
  error: {
    heading: _('Det ser ut som det tar litt tid..', ''),
    description: _(
      'Vi får ikke knyttet et t:kort eller en mobil til profilen din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nOm problemet vedvarer kan du ta kontakt med AtB kundesenter.',
      '',
    ),
  },
  next: _('Neste', 'Next'),
  ok: _('OK', 'OK'),
};
export default MobileTokenOnboardingTexts;
