import {TranslatedString, translation as _} from '../commons';
import {ToolTipKey} from '@atb/components/popover';

type ToolTipText = {
  heading: TranslatedString;
  text: TranslatedString;
};

const OneTimeToolTipTexts: {[key in ToolTipKey]: ToolTipText} = {
  'map-filter': {
    heading: _('Map filter 1', '', ''),
    text: _('Test test', '', ''),
  },
  'map-filter-test': {
    heading: _('Map filter 2', '', ''),
    text: _('Test test', '', ''),
  },
  'recent-fare-contract': {
    heading: _('Recent fare contract', '', ''),
    text: _('Test test', '', ''),
  },
  'on-behalf-of': {
    heading: _('Nyhet!', '', ''),
    text: _('Du kan nå kjøpe en billett og sende den til andre', '', ''),
  },
};

export default OneTimeToolTipTexts;
