import {translation as _} from '../commons';

const ServiceDisruptionsTexts = {
  header: {
    title: _('Driftsavvik', 'Service disruptions'),
  },
  body: _(
    'Oversikt over endringer, forsinkelser og avvik finner du på atb.no:',
    'Get an overview of changes, delays and service disruptions at atb.no (Norwegian only):',
  ),
  button: {
    text: _(
      'atb.no/driftsavvik (åpnes i nettleser)',
      'atb.no/driftsavvik (opens in browser)',
    ),
    a11yHint: _(
      'Naviger til oversikt over driftsavvik i et nettleservindu',
      'Navigate to an overview of service disruptions in a browser window',
    ),
  },
};
export default ServiceDisruptionsTexts;
