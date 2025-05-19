import {TranslatedString, translation as _} from '../commons';
import {PopOverKey} from '@atb/modules/popover';

type PopOverText = {
  heading: TranslatedString;
  text: TranslatedString;
};

const OneTimePopOverTexts: {[key in PopOverKey]: PopOverText} = {
  'trip-search-flexible-transport-dismissed': {
    heading: _(
      'Filter er slått av',
      'Filter is turned off',
      'Filter er slått av',
    ),
    text: _(
      'Tips om bestillingstransport kan skrus på igjen i filter.',
      'Flexible transport travel suggestions can be turned on again in filters.',
      'Tips om bestillingstransport kan skruast på igjen i filter.',
    ),
  },
  'on-behalf-of-new-feature-introduction': {
    heading: _('Nyhet!', 'New!', 'Nyhet!'),
    text: _(
      'Kjøp til noen andre.',
      'Buy for someone else.',
      'Kjøp til nokon andre.',
    ),
  },
  'on-behalf-of-sent-tickets-button': {
    heading: _(
      'Leter du etter sendte billetter?',
      'Looking for sent tickets?',
      'Leitar du etter sende billettar?',
    ),
    text: _(
      'Oversikt over sendte billetter finner du her.',
      'You can see the tickets you have sent here.',
      'Oversikt over sende billettar finn du her.',
    ),
  },
};

export default OneTimePopOverTexts;
