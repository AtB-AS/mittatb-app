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
