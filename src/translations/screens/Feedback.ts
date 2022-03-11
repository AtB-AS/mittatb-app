import {translation as _} from '../commons';

const FeedbackTexts = {
  goodOrBadTexts: {
    good: _('Bra', 'Good'),
    bad: _('Dårlig', 'Bad'),
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
    prefill: _(
      'Hei! Jeg ble sendt til chatten her etter å ha gitt tilbakemelding på',
      'Hi! I was transferred to the chat after giving feedback on',
    ),
  },
};

export default FeedbackTexts;
