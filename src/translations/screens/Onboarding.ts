import {translation as _} from '../utils';

const OnboardingTexts = {
  step1: {
    title: _('Velkommen som testpilot'),
    description: _(
      'Du bruker nå en betaversjon av den nye AtB-appen. Her kan du planlegge reiser og sjekke avgangstider i Trøndelag. Appen vil bli jevnlig oppdatert med nye funksjoner.',
    ),
  },
  step2: {
    title: _('Bidra til å gjøre appen bedre'),
    description: _(
      'Vi trenger dine idéer og tilbakemeldinger for å gjøre appen bedre. Disse deler du enklest ved å velge chatikonet oppe i høyre hjørne av appen. Chatten er anonym.',
    ),
  },
  step3: {
    title: _('Bedre opplevelse med posisjonsdeling'),
    description: _(
      'Ved å tillate deling av posisjon kan du finne nærmeste holdeplass og planlegge reisen fra din lokasjon. Du kan når som helst slutte å dele posisjon.',
    ),
    privacyLink: {
      text: _('Les vår personvernerklæring'),
      a11yHint: _('Lenker til en ekstern side'),
    },
  },
  navigation: {
    next: _('Fortsett'),
    complete: _('Fullfør'),
  },
};
export default OnboardingTexts;
