import {translation as _} from '../commons';

const DisappearingHeaderTexts = {
  serviceDisruptions: {
    header: {
      title: _('Driftsavvik', 'Service disruptions'),
    },
    body: _(
      'Oversikt over endringer, forsinkelser og avvik finner du på atb.no:',
      'Get an overview of changes, delays and service disruptions at atb.no (Norwegian only):      ',
    ),
    button: {
      text: _(
        'atb.no/driftsavvik (åpnes i nettleser)      ',
        'atb.no/driftsavvik (opens in browser)',
      ),
      a11yLabel: _('Bakgrunn', 'Background'),
      a11yHint: _('Aktivér for å lukke dialog', 'Activate to close dialog'),
    },
  },
};
export default DisappearingHeaderTexts;
