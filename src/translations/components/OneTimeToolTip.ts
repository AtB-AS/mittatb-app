import {TranslatedString, translation as _} from '../commons';
import {ToolTipKey} from '@atb/components/popover';

type ToolTipText = {
  heading: TranslatedString;
  text: TranslatedString;
};

const OneTimeToolTipTexts: {[key in ToolTipKey]: ToolTipText} = {
  'map-filter': {
    heading: _('Hei hei', '', ''),
    text: _('Test test', '', ''),
  },
  'travel-search-filter': {
    heading: _('Travel search', '', ''),
    text: _('Foo bar', '', ''),
  },
};

export default OneTimeToolTipTexts;
