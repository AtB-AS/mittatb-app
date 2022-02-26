import {translation as _} from '../commons';

export const DecisionPrompt = {
  assistantv2: {
    title: _('Nytt reisesøk!', 'New travel assistant!'),
    body: _(
      'Har du lyst til å prøve en ny versjon av reisesøket?',
      'Do you want to try a new version of our travel assistant?',
    ),
    buttons: {
      yes: _('Skru på!', 'Yes please!'),
      no: _('Nei takk', 'No thanks'),
    },
  },
};

export default DecisionPrompt;
