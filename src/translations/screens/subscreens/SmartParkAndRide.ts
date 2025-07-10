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
      vehicleNotFound: {
        title: _(
          'Vi finner ikke skiltnummeret',
          'We cannot find the license plate',
          'Vi finn ikkje skiltnummeret',
        ),
        message: _(
          'Hvis du har utenlandske skilter kan du legge det til likevel.',
          'If you have foreign license plates, you can add it anyway.',
          'Om du har utanlandske skilt kan du leggje det til likevel.',
        ),
      },
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
    error: _(
      'Vi klarte ikke lagre endringer. Prøv igjen.',
      'We could not save changes. Please try again.',
      'Vi klarte ikkje lagre endringar. Prøv igjen.',
    ),
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
      error: _(
        'Vi klarte ikke fjerne kjøretøyet. Prøv igjen.',
        'We could not remove the vehicle. Please try again.',
        'Vi klarte ikkje fjerne køyretøyet. Prøv igjen.',
      ),
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
