import {TranslatedString, translation as _} from '../commons';
import {PopOverKey} from '@atb/components/popover';

type PopOverText = {
  heading: TranslatedString;
  text: TranslatedString;
};

const OneTimePopOverTexts: {[key in PopOverKey]: PopOverText} = {
  'example-popover': {
    heading: _('', 'Example', ''),
    text: _('', 'This is an example of how to add popovers.', ''),
  },
};

export default OneTimePopOverTexts;
