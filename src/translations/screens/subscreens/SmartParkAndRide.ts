import {translation as _} from '../../commons';

const SmartParkAndRideTexts = {
  header: {
    title: _(
      'Parkering på Ranheim',
      'Parking at Ranheim',
      'Parkering på Ranheim',
    ),
  },
  content: {
    heading: _('Dine kjøretøy', 'Your vehicles', 'Dine køyretøy'),
    addVehicle: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
  },
  add: {
    header: {
      title: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
    },
    content: {
      title: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
      text: _(
        'Du kan legge til to kjøretøy.',
        'You can add two vehicles.',
        'Du kan leggje til to køyretøy.',
      ),
    },
    input: {
      label: _('Skiltnummer', 'License plate', 'Skiltnummer'),
      placeholder: _(
        'Skriv inn skiltnummer',
        'Enter license plate',
        'Skriv inn skiltnummer',
      ),
    },
    button: _('Legg til kjøretøy', 'Add vehicle', 'Legg til køyretøy'),
  },
  edit: {
    header: {
      title: _('Endre kjøretøy', 'Edit vehicle', 'Endre køyretøy'),
    },
    inputs: {
      licensePlate: {
        label: _('Skiltnummer', 'License plate', 'Skiltnummer'),
        placeholder: _(
          'Skriv inn skiltnummer',
          'Enter license plate',
          'Skriv inn skiltnummer',
        ),
      },
    },
    button: _('Lagre', 'Save', 'Lagre'),
    delete: {
      button: _('Fjern kjøretøy', 'Remove vehicle', 'Fjern køyretøy'),
      confirmation: {
        title: _('Fjern kjøretøy', 'Remove vehicle', 'Fjern køyretøy'),
        message: _(
          'Ønsker du å fjerne dette kjøretøyet?',
          'Do you wish to remove this vehicle?',
          'Ønsker du å fjerne dette køyretøyet?',
        ),
        cancel: _('Avbryt', 'Cancel', 'Avbryt'),
        confirm: _('Fjern', 'Remove', 'Fjern'),
      },
    },
  },
  a11y: {
    carIcon: _('Bilikon', 'Car icon', 'Bilikon'),
    button: _(
      'Trykk for å redigere eller fjerne kjøretøy',
      'Press to edit or remove vehicle',
      'Trykk for å redigere eller fjerne køyretøy',
    ),
  },
};

export default SmartParkAndRideTexts;
