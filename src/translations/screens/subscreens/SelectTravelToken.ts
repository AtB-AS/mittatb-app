import {translation as _} from '../../commons';
const SelectTravelTokenTexts = {
  activeToken: {
    title: _('Aktivt reisebevis', 'Active travel token'),
    type: {
      tcard: {
        title: _('T:kort', 'T:card'),
        icon: _('t:kort', 't:card'),
        description: _(
          'Ta med deg t:kortet når du er ute og reiser. Ved en eventuell kontroll viser du frem t:kortet ditt for avlesning.',
          'Bring your t:card when you are traveling. In case of a ticket inspection, show your t:card for inspection.',
        ),
      },
      mobile: {
        title: _('Phone', 'Mobil'),
        description: _('', ''),
      },
    },
    info: _(
      'Du kan ha ett gyldig reisebevis til enhver tid.',
      'You can have one valid travel token at a time.',
    ),
  },
  changeTokenButton: _('Endre reisebevis', 'Change travel token'),
  faq: {
    title: _('Ofte stilte spørsmål', 'Frequently asked questions'),
  },
  faqs: [
    {
      question: _('Hva er et reisebevis?', 'What is a travel token?'),
      answer: _(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ),
    },
    {
      question: _(
        'Hvor mange reisebevis kan jeg ha?',
        'How many travel tokens can I own?',
      ),
      answer: _(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ),
    },
    {
      question: _(
        'Hvor ofte kan jeg bytte?',
        'How frequently can I switch tokens?',
      ),
      answer: _(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ),
    },
    {
      question: _(
        'Kan jeg reise uten mitt reisebevis?',
        'Can I travel without my travel token?',
      ),
      answer: _(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ),
    },
    {
      question: _('Hva om jeg mister mobilen?', 'What if I lose my phone?'),
      answer: _(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ),
    },
  ],
  header: {
    title: _('Standard reisende', 'Default traveller'),
  },
  description: _(
    'Velg ønsket standardkategori for fremtidige billettkjøp.',
    'Select your default category for future ticket purchases.',
  ),
};
export default SelectTravelTokenTexts;
