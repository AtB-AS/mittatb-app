import {TranslatedString, translation as _} from '../commons';
import {PopOverKey} from '@atb/popover';

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
};

export default OneTimePopOverTexts;
