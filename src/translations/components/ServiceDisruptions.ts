import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const ServiceDisruptionsTexts = {
  header: {
    title: _('Statusmeldinger', 'Status messages'),
  },
  body: _(
    'Fullstendig oversikt over endringer, forsinkelser og avvik finner du på våre nettsider:',
    'You will find a complete overview of changes, delays, and deviations on our website.:',
  ),
  button: {
    text: _('atb.no/driftsavvik', 'atb.no/driftsavvik'),
    a11yHint: _(
      'Naviger til oversikt over driftsavvik i et nettleservindu',
      'Navigate to an overview of service disruptions in a browser window',
    ),
  },
};

export default orgSpecificTranslations(ServiceDisruptionsTexts, {
  nfk: {
    body: _(
      'Oversikt over endringer, forsinkelser og avvik finner du på reisnordland.no:',
      'Get an overview of changes, delays and service disruptions at reisnordland.no (Norwegian only):',
    ),
    button: {
      text: _('Åpne i nettleser', 'Open in browser'),
    },
  },
  fram: {
    body: _(
      'Oversikt over endringer, forsinkelser og avvik finner du på frammr.no:',
      'Get an overview of changes, delays and service disruptions at en.frammr.no:',
    ),
    button: {
      text: _('Åpne i nettleser', 'Open in browser'),
    },
  },
});
