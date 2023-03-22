import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const TicketingSplashTexts = {
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
      'Soon you can purchase and organize tickets for your trips – right here in the app!',
    ),
    betaButtonLabel: _(
      'Jeg har kode til beta for billettkjøp',
      'I have a code to join the app ticketing beta program',
    ),
  },
};
export default orgSpecificTranslations(TicketingSplashTexts, {
  nfk: {
    splash: {
      title: _(
        'Billettkjøp i app kommer snart!',
        'App ticketing is coming soon!',
      ),
      paragraph1: _(
        'Her kan du snart kjøpe og administrere billetter til reisen din. Du vil da ha alt du trenger for å reise med kollektivtransport i Nordland i en og samme app! \n\nI mellomtiden ber vi deg bruke appen «Billett Nordland» til kjøp av billetter.',
        'You will soon be able to purchase and manage tickets for your trip here. You will then have everything you need to travel with public transport in Nordland in one app! \n\nIn the meantime, we ask you to use the "Billett Nordland" app to purchase tickets.',
      ),
    },
  },
});
