import {translation as _} from '../commons';
import orgSpecificTranslations from '../utils';

const TicketSplashTexts = {
  header: {
    title: _('Billetter', 'Tickets'),
    logo: {
      a11yLabel: _('Gå til startskjerm', 'Go to home screen'),
    },
  },
  splash: {
    title: _('Billettkjøp i app kommer snart!', 'App ticketing on its way!'),
    paragraph1: _(
      'Her kan du snart kjøpe og administrere billetter til reisen din! Da vil du ha alt du trenger i en og samme app.',
      'Soon you can purchase and organise tickets for your trips – right here in the app!',
    ),
    betaButtonLabel: _(
      'Jeg har kode til beta for billettkjøp',
      'I have a code to join the app ticketing beta program',
    ),
  },
};
export default orgSpecificTranslations(TicketSplashTexts, {
  nfk: {
    splash: {
      title: _(
        'Her kommer billettkjøp i app!',
        'App ticketing will be available here!',
      ),
      paragraph1: _(
        'Når dette er på plass, kan du kjøpe og administrere bussbilletter til reisen i Reis appen din. Du vil da ha alt du trenger for å reise med kollektivtransport i Nordland i en og samme app! \nI mellomtiden må appen «Billett Nordland» brukes til kjøp av bussbilletter.',
        'Once this is in place, you can buy and manage bus tickets for your trip in the “Reis app”. You will then have everything you need to travel with public transport in Nordland in one app! \nIn the meantime, the app "Billett Nordland" must be used to buy bus tickets.',
      ),
    },
  },
});
