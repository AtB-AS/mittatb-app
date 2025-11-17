import {translation as _} from '../commons';

const CameraTexts = {
  loading: _('Starter kamera...', 'Starting camera...', 'Startar kamera'),
  permissionRequired: {
    title: _(
      'Gi tilgang til kamera',
      'Grant access to camera',
      'Gje tilgang til kamera',
    ),
    message: _(
      'For å bruke denne funksjonen må du gi appen tilgang til å bruke kamera. Det gjør du under Personvern og sikkerhet i Innstillinger.',
      'To use this feature, you must grant the app permission to access the camera. You can do this in the Privacy and Security section of the Settings.',
      'For å bruke denne funksjonen må du gi appen tilgang til å bruke kamera. Dette gjer du under Personvern og sikkerhet i Innstillinger.',
    ),
    action: _('Gå til Innstilinger', 'Open Settings', 'Gå til Innstillinger'),
  },
  permissionsDialog: {
    title: _('Tilgang til kamera', 'Camera Permission', 'Tilgang til kamera'),
    message: _(
      'Denne funksjonen trenger tilgang til kamera',
      'This feature needs camera permission',
      'Denne funksjonen treng tilgang til kamera',
    ),
    action: _('Godta', 'Accept', 'Godta'),
  },
  flashlight: {
    default: _('Lys', 'Flashlight', 'Lys'),
    on: _('Lys på', 'Flashlight on', 'Lys på'),
    off: _('Lys av', 'Flashlight off', 'Lys av'),
  },
};

export default CameraTexts;
