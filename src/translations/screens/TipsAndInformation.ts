import {translation as _} from '../commons';

const TipsAndInformationTexts = {
  title: _('Tips og informasjon', 'Tips and information'),

  tips: [
    {
      title: _('🐶 Reise med hund', '🐶 Traveling with dog'),
      tip: _('Hund reiser gratis', 'Dogs travel for free'),
    },
    {
      title: _('‍🚲 Reise med sykkel', '‍🚲 Traveling with bike'),
      tip: _(
        'For å reise med sykkel på bussen må du kjøpe en barnebillett. På hurtigbåt er sykkel gratis.',
        'To bring your bike on the bus, you must buy a Child ticket. Bikes are free to bring on speedboats',
      ),
    },
    {
      title: _('👩‍👧‍👦 Reise med barn', '👩‍👧‍👦 Traveling with kids'),
      tip: _(
        'Barn over 6 år må ha barnebillett, men i helger kan barn reise gratis med en voksen. En voksen kan ha med seg opp til 4 barn gratis.',
        'Children older thatn 6 years must have a Child ticket. In the weekends a parent can bring up to 4 kids for free.',
      ),
    },
    {
      title: _('🌖 Nattbuss', '🌖 Night bus'),
      tip: _(
        'For å reise på nattbuss må du enten ha nattbussbillett eller en periodebillett for student. Vanlig enkeltbillett er ikke gyldig på nattbussen',
        'To travel on the night bus, either a night ticket or a periodic ticket for students are required. Regular single ticket is not valid.  ',
      ),
    },
    {
      title: _(
        '🎟️ Hvor lenge varer en enkeltbilett?',
        '🎟️ How long is a single ticket valid?',
      ),
      tip: _(
        'Enkeltbiletter er vanligvis gyldige i 1 time og 30 minutter. I helger, på helligdager og etter kl 18 på hverdager er den gyldig i 3 timer.',
        'Single tickets are usually valid for 1 hour and 30 minutes. However, in the weekends and after 6 pm on weekdays they are valid for 3 hours',
      ),
    },
  ],
  goToAssistantButton: {
    title: _('Gå til veileder', 'Go to assistant'),
  },
  ticketAssistantTip: {
    title: _(
      '💰 Hvilken billett lønner seg?',
      '💰 How long is a single ticket valid?',
    ),
    tip: _(
      'For å finne ut hvilken billett som lønner seg kan du ta veilederen!',
      'To find your best ticket, you can use the ticket assistant.',
    ),
  },
};

export default TipsAndInformationTexts;
