import {translation as _} from '../commons';

const OnboardingTexts = {
  step1: {
    title: _('Velkommen som testpilot', 'Welcome test pilot!'),
    description: _(
      'Du bruker nå en betaversjon av den nye AtB-appen. Her kan du planlegge reiser og sjekke avgangstider i Trøndelag. Appen vil bli jevnlig oppdatert med nye funksjoner.', 'This is the all new AtB travel app in beta stage. It allows you to plan journeys and check departure times from locations within Trøndelag county. We are frequently adding new features and improvements.'),
  },
  step2: {
    title: _('Bidra til å gjøre appen bedre', 'Help us improve the app'),
    description: _(
      'Vi trenger dine idéer og tilbakemeldinger for å gjøre appen bedre. Disse deler du enklest ved å tappe på chatikonet oppe i høyre hjørne av appen. Chatten er anonym.', 'Your feedback is critical for improving the app experience. Share your ideas or report bugs/errors by initiating a chat with the development team. Simply tap the chat icon in the upper right corner. The chat is anonymous.'),
  },
  step3: {
    title: _('Bedre opplevelse med posisjonsdeling', 'Share your position for the best app experience'),
    description: _(
      'Ved å tillate deling av posisjon, kan du finne nærmeste holdeplass og planlegge reisen fra din lokasjon. Du kan når som helst slutte å dele posisjon.', 'Position sharing lets to find nearby stops and plan journeys based on your current location. You can disable position sharing any time.'),
    privacyLink: {
      text: _('Les vår personvernerklæring', 'Read our privacy statement'),
      a11yHint: _('Lenker til en ekstern side', 'Link to external content'),
    },
  },
  navigation: {
    next: _('Fortsett', 'Next'),
    complete: _('Fullfør', 'Complete'),
  },
};
export default OnboardingTexts;
