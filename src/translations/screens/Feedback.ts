import {translation as _} from '../commons';
import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';

const FeedbackTextsInternal = {
  alternatives: {
    a11yHints: {
      checked: _(
        'Alternativet er valgt. Aktivér for å fjerne markeringen på dette alternativet.',
        'This alternative is already selected. Activate to uncheck this alternative.',
      ),
      unchecked: _(
        'Alternativet er ikke valgt. Aktivér for å velge dette alternativet.',
        'This alternative is not selected. Activate to check this alternative.',
      ),
    },
  },
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
    intercomButton: _('Snakk med app-teamet', 'Chat with the app team'),
    contactsheetButton: _('Kontakt kundeservice', 'Contact customer support'),
  },
};

export default orgSpecificTranslations(FeedbackTextsInternal, {
  fram: {
    additionalFeedback: {
      contactsheetButton: _(
        'Kontakt FRAM Kundesenter',
        'Contact FRAM Customer Centre',
      ),
    },
  },
});
