import {translation as _} from '../../commons';
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
