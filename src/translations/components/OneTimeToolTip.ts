import {TranslatedString, translation as _} from '../commons';
import {ToolTipKey} from '@atb/components/popover';

type ToolTipText = {
  heading: TranslatedString;
  text: TranslatedString;
};

const OneTimeToolTipTexts: {[key in ToolTipKey]: ToolTipText} = {
  'example-tooltip': {
    heading: _('', 'Example', ''),
    text: _('', 'This is an example of how to add tool tips.', ''),
  },
};

export default OneTimeToolTipTexts;
