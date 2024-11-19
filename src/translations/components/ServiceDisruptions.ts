import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const ServiceDisruptionsTexts = {
  header: {
    title: _('Statusmeldinger', 'Status messages', 'Statusmeldingar'),
  },
  body: _(
    'Fullstendig oversikt over endringer, forsinkelser og avvik finner du på våre nettsider:',
    'You will find a complete overview of changes, delays, and deviations on our website.:',
    'Fullstendig oversikt over endringar, forseinkingar og avvik finn du på våre nettsider:',
  ),
  button: {
    text: _('atb.no/driftsavvik', 'atb.no/driftsavvik', 'atb.no/driftsavvik'),
    a11yHint: _(
      'Naviger til oversikt over driftsavvik i et nettleservindu',
      'Navigate to an overview of service disruptions in a browser window',
      'Naviger til ei oversikt over driftsavvik i eit nettlesarvindauge',
    ),
  },
};

export default orgSpecificTranslations(ServiceDisruptionsTexts, {
  nfk: {
    body: _(
      'Oversikt over endringer, forsinkelser og avvik finner du på reisnordland.no:',
      'Get an overview of changes, delays and service disruptions at reisnordland.no (Norwegian only):',
      'Oversikt over endringar, forseinkingar og avvik finn du på reisnordland.no:',
    ),
    button: {
      text: _('Åpne i nettleser', 'Open in browser', 'Opne i nettlesar'),
    },
  },
  fram: {
    body: _(
      'Oversikt over endringer, forsinkelser og avvik finner du på frammr.no:',
      'Get an overview of changes, delays and service disruptions at en.frammr.no:',
      'Oversikt over endringar, forseinkingar og avvik finn du på frammr.no:',
    ),
    button: {
      text: _('Åpne i nettleser', 'Open in browser', 'Opne i nettlesar'),
    },
  },
  troms: {
    body: _(
      'Oversikt over endringer, forsinkelser og avvik finner du på svipper.no:',
      'Get an overview of changes, delays and service disruptions at svipper.no (Norwegian only):',
      'Oversikt over endringar, forseinkingar og avvik finn du på svipper.no:',
    ),
    button: {
      text: _('Trafikkmeldinger', 'Customer information', 'Trafikkmeldingar'),
    },
  },
});
