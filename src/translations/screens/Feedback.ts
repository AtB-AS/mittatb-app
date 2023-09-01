import {translation as _} from '../commons';
import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';

const FeedbackTextsInternal = {
  alternatives: {
    a11yHints: {
      checked: _(
        'Alternativet er valgt. Aktivér for å fjerne markeringen på dette alternativet.',
        'This alternative is already selected. Activate to uncheck this alternative.',
        'Alternativet er valt. Aktivér for å fjerne markeringa på alternativet.',
      ),
      unchecked: _(
        'Alternativet er ikke valgt. Aktivér for å velge dette alternativet.',
        'This alternative is not selected. Activate to check this alternative.',
        'Dette alternativet er ikkje valt. Aktivér for å velje dette alternativet.',
      ),
    },
  },
  goodOrBadTexts: {
    good: _('Bra', 'Good', 'Bra'),
    bad: _('Dårlig', 'Bad', 'Dårleg'),
    doNotShowAgain: _(
      'Ikke vis dette spørsmålet igjen',
      'Do not show this question again',
      'Ikkje vis dette spørsmålet igjen',
    ),
  },
  submitText: {
    submitFeedback: _(
      'Send tilbakemelding',
      'Submit feedback',
      'Send tilbakemelding',
    ),
  },
  submittedText: {
    thanks: _(
      'Takk for tilbakemeldingen! 🎉',
      'Thanks for the feedback! 🎉',
      'Takk for tilbakemeldinga! 🎉',
    ),
  },
  additionalFeedback: {
    text: _(
      'Mer på hjertet? Vi hører gjerne fra deg!',
      'Additional thoughts? Please tell us!',
      'Meir på hjartet? Vi ønsker å høyre frå deg!',
    ),
    intercomButton: _(
      'Snakk med app-teamet',
      'Chat with the app team',
      'Snakk med app-teamet',
    ),
    contactsheetButton: _(
      'Kontakt kundeservice',
      'Contact customer support',
      'Kontakt kundeservice',
    ),
  },
};

export default orgSpecificTranslations(FeedbackTextsInternal, {
  fram: {
    additionalFeedback: {
      contactsheetButton: _(
        'Kontakt FRAM Kundesenter',
        'Contact FRAM Customer Centre',
        'Kontakt FRAM Kundesenter',
      ),
    },
  },
});
