import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const GenericWebsiteInformationScreenTextsInternal = {
  title: _('Informasjon', 'Information'),
  message: _(
    'Gjeldende informasjon finner du på www.atb.no',
    'Current information can be found on www.atb.no/en',
  ),
};

export default orgSpecificTranslations(
  GenericWebsiteInformationScreenTextsInternal,
  {
    nfk: {
      message: _(
        'Gjeldende informasjon finner du på www.reisnordland.no',
        'Current information can be found on www.reisnordland.com',
      ),
    },
    fram: {
      message: _(
        'Gjeldende informasjon finner du på www.frammr.no',
        'Current information can be found on en.frammr.no',
      ),
    },
  },
);
