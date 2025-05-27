import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const MapTexts = {
  qr: {
    scan: _('Skann', 'Scan', 'Skann'),
    notFound: {
      title: _(
        'Kunne ikke lese QR-kode',
        "Couldn't read the QR code.",
        'Kunne ikkje lese QR-kode.',
      ),
      description: _(
        'Det kan hende at vi ikke kan vise dette innholdet i appen eller at lenken er ugyldig.',
        'It could be that we are unable to show this content in the app or that the link is broken.',
        'Det kan hende at vi ikkje kan vise dette innhaldet i appen eller at lenken er ugyldig.',
      ),
      ok: _('OK', 'OK', 'OK'),
    },
  },
  exitButton: {
    a11yLabel: _('Gå tilbake', 'Go back', 'Gå tilbake'),
  },
  startPoint: {
    label: _('Start', 'Start', 'Start'),
  },
  endPoint: {
    label: _('Slutt', 'End', 'Slutt'),
  },
  disabledForScreenReader: {
    title: _(
      'Kart kan ikke vises',
      'Map cannot be viewed',
      'Kart kan ikkje visast',
    ),
    description: _(
      'Kart er ikke synlig når du bruker skjermleser.',
      'The map is not visible while using screen reader.',
      'Kart er ikkje synleg ved bruk av skjermlesar.',
    ),
  },
  filters: {
    bottomSheet: {
      heading: _('Kartfilter', 'Map Filter', 'Kartfilter'),
    },
  },
  externalRealtimeMap: {
    bottomSheet: {
      heading: _('Sanntidskart', 'Real-time map', 'Sanntidskart'),
      description: _(
        'Oversikt over alle bussene i sanntid og antall passasjerer i bussen finner du på lenken nedenfor.',
        'An overview of all buses in real-time and the number of passengers on the bus can be found at the link below.',
        'Ei oversikt over alle bussane i sanntid og talet på passasjerar i bussen finn du på lenka nedenfor.',
      ),
      button: _('Sanntidskart', 'Real-time map', 'Sanntidskart'),
    },
  },
};

export default orgSpecificTranslations(MapTexts, {
  troms: {
    externalRealtimeMap: {
      bottomSheet: {
        description: _(
          'Oversikt over alle bussene i sanntid og antall passasjerer i bussen finner du på kart.svipper.no',
          'An overview of all buses in real-time and the number of passengers on the bus can be found at kart.svipper.no',
          'Ei oversikt over alle bussane i sanntid og talet på passasjerar i bussen finn du på kart.svipper.no',
        ),
      },
    },
  },
});
