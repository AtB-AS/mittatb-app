import {translation as _} from '../../utils';
const DepartureDetailsTexts = {
  header: {
    title: (departureName: string) => _(departureName),
    leftIcon: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  collapse: {
    label: (numberStops: number) => _(`${numberStops} mellomstopp`),
  },
};
export default DepartureDetailsTexts;
