import {translation as _} from '../../utils';
const AddEditFavoriteTexts = {
  header: {
    title: _('Legg til favorittsted'),
    titleEdit: _('Endre favorittsted'),
    logo: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  fields: {
    location: {
      label: _('Sted', 'Place'),
      placeholder: _('Søk etter adresse eller stoppested'),
    },
    name: {
      label: _('Navn'),
      placeholder: _('Legg til navn'),
      a11yHint: _('Navn for favoritten'),
    },
    icon: {
      label: _('Ikon'),
    },
  },
  save: {
    label: _('Lagre favorittsted'),
    notSelectedFromError: _('Du må velge et sted du vil ha som favoritt'),
  },
  delete: {
    label: _('Slett favorittsted'),
    confirmWarning: _('Er du sikker på at du vil slette favorittstedet ditt?'),
  },
  cancel: {
    label: _('Avbryt'),
  },
};
export default AddEditFavoriteTexts;
