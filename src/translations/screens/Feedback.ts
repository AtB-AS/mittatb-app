import {translation as _} from '../commons';

const FeedbackTexts = {
  goodOrBadTexts: {
    good: _('Bra', 'Good'),
    bad: _('Dårlig', 'Bad'),
    doNotShowAgain: _(
      'Ikke vis dette spørsmålet igjen',
      'Do not show this question again',
    ),
  },
  submitText: {
    submitFeedback: _('Send tilbakemelding', 'Submit feedback'),
  },
  submittedText: {
    thanks: _('Takk for tilbakemeldingen! 🎉', 'Thanks for the feedback! 🎉'),
  },
  additionalFeedback: {
    text: _(
      'Mer på hjertet? Vi hører gjerne fra deg!',
      'Additional thoughts? Please tell us!',
    ),
    button: _('Snakk med app-teamet', 'Chat with the app team'),
  },
};

export default FeedbackTexts;
