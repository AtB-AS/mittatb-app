import {translation as _} from '../../commons';

const FeideConnectionTexts = {
  header: {
    title: _(
      'Feide og skoleskyss',
      'Feide and school transport',
      'Feide og skuleskyss',
    ),
  },
  description: _(
    'Koble til Feide for å hente skoleskyssbilletten din i appen. Du logger inn med Feide, og vi kobler den til kontoen din.',
    'Connect with Feide to get your school transport ticket in the app. You log in with Feide, and we link it to your account.',
    'Koble til Feide for å hente skuleskyssbilletten din i appen. Du loggar inn med Feide, og vi koplar den til kontoen din.',
  ),
  connectButton: _('Koble til Feide', 'Connect with Feide', 'Koble til Feide'),
  connected: {
    title: _('Tilkoblet Feide', 'Connected to Feide', 'Tilkopla Feide'),
    message: _(
      'Kontoen din er koblet til Feide.',
      'Your account is connected to Feide.',
      'Kontoen din er kopla til Feide.',
    ),
  },
  success: {
    title: _('Feide tilkoblet', 'Feide connected', 'Feide tilkopla'),
    message: (name: string) =>
      _(
        `Du er nå koblet til Feide som ${name}.`,
        `You are now connected with Feide as ${name}.`,
        `Du er no kopla til Feide som ${name}.`,
      ),
    messageNoName: _(
      'Du er nå koblet til Feide.',
      'You are now connected with Feide.',
      'Du er no kopla til Feide.',
    ),
  },
  error: _(
    'Vi klarte ikke å koble til Feide. Prøv igjen.',
    'We could not connect with Feide. Please try again.',
    'Vi klarte ikkje å koble til Feide. Prøv igjen.',
  ),
  alreadyConnectedError: {
    title: _(
      'Feide er allerede i bruk',
      'Feide already in use',
      'Feide er allereie i bruk',
    ),
    message: _(
      'En annen konto er allerede koblet til denne Feide-brukeren. Ta kontakt med kundeservice for hjelp med Feide-tilkobling og skoleskyssbilletter.',
      'Another account is already connected to this Feide user. Contact customer support for help with Feide connection and school transport tickets.',
      'Ein annan konto er allereie kopla til denne Feide-brukaren. Ta kontakt med kundeservice for hjelp med Feide-tilkopling og skuleskyssbillettar.',
    ),
    contactLink: _(
      'Kontakt kundeservice',
      'Contact customer support',
      'Kontakt kundeservice',
    ),
  },
};

export default FeideConnectionTexts;
