import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '@atb/translations';

const GenericWebsiteInformationScreenTextsInternal = {
  message: _(
    'Gjeldende informasjon finner du på www.atb.no',
    'Current information can be found on atb.no',
  ),
};

export default orgSpecificTranslations(
  GenericWebsiteInformationScreenTextsInternal,
  {
    nfk: {
      message: _(
        'Gjeldende informasjon finner du på www.reisnordland.no',
        'Current information can be found on reisnordland.com',
      ),
    },
  },
);
