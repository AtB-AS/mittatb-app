import {translation as _} from '../commons';

const TicketAssistantTexts = {
  welcome: {
    title: _(
      'Velkommen til billettveilederen',
      'Welcome to the ticket assistant',
    ),
    titleA11yLabel: _(
      'Velkommen til billettveilederen',
      'Welcome to the ticket assistant',
    ),
    description: {
      part1: _(
        'Få hjelp til å velge billetten som passer deg.',
        'Get help choosing the ticket that suits you.',
      ),
    },
    mainButton: _('Start', 'Start'),
  },
  closeButton: _('Lukk', 'Close'),
  categoryPicker: {
    title: _('Hvem er du?', 'Who are you?'),
    categories: [
      {
        title: _('🧑 Voksen', '🧑 Adult'),
        description: _(
          'Voksne fra 20 år til og med 66 år.',
          'Adults from 20 to 66 years old.',
        ),
      },
      {
        title: _('🧒 Barn/ungdom', '🧒 Child/Youth'),
        description: _(
          'Barn/ungdom fra 6 år til og med 19 år. Barn under 6 år reiser gratis. ',
          'Children/youth from 6 to 19 years old. Children under 6 years old travel for free.',
        ),
      },
      {
        title: _('🧑‍🎓 Student', '🧑‍🎓 Student'),
        description: _(
          'Elever ved videregående skole og studenter til og med 34 år med gyldig studentbevis. Er du under 20 år, lønner det seg å velge barn/ungdom.',
          'Students in high school and up to 34 years old with a valid student ID. If you are under 20 years old, it is better to choose child/youth.',
        ),
      },
      {
        title: _('🧓 Honnør', '🧓 Senior'),
        description: _(
          'Reisende over 67 år eller med gyldig honnørbevis.',
          'Travelers over 67 years old or with a valid senior discount card.',
        ),
      },
      {
        title: _('🪖 Militær', '🪖 Military'),
        description: _(
          'Vernepliktig i førstegangstjeneste, med gyldig tjenestebevis. ',
          'Conscript in first-time service with a valid service ID.',
        ),
      },
    ],
    chooseButton: _('Velg', 'Choose'),
  },
  frequency: {
    title: _(
      'Hvor ofte reiser du i uka? ',
      'How often do you travel per week?',
    ),
    description: _(
      'Tur-retur teller som 2 ganger. \n' +
        'Eksempel: Til og fra jobb 3 ganger i uka, er 6 reiser.',
      'Round trip counts as 2 times. \n' +
        'Example: To and from work 3 times a week, is 6 trips.',
    ),
    result: (amount: {value: number}) =>
      _(
        `Du reiser ${amount.value} ganger i uka`,
        `You travel ${amount.value} times a week`,
      ),
    mainButton: _('Neste', 'Next'),
  },
  intercom: {
    title: _('Bidra til å gjøre appen bedre', 'Help us make the app better'),
    description: _(
      'Vi ønsker dine tilbakemeldinger for å gjøre appen bedre. Dette gjør du enklest i chatten i høyre hjørne. Chatten er anonym.',
      'We appreciate your feedback to make the app better. Use the chat in the upper right corner. The chat is anonymous.',
    ),
    mainButton: _('Neste', 'Next'),
  },
};
export default TicketAssistantTexts;
