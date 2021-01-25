import {Platform} from 'react-native';
import {translation as _} from '../commons';

const getStoreName = () =>
  Platform.select({
    default: 'App Store',
    android: 'Play Store',
  });

const UpdateSplashTexts = {
  title: _('Du må oppdatere appen!', 'You have to update the app!'),
  paragraph1: _(
    `Kjøp av billetter er noe vi jobber hyppig med. Siden vi har gjort endringer på hvordan kjøp fungerer, må du oppdatere til nyeste versjon av appen i ${getStoreName()}.`,
    `Ticket purchasing is a feature which is rapidly evolving. Since we've done some changes to how ticketing works, you will have to update to the latest version of the app at the ${getStoreName()}.`,
  ),
};
export default UpdateSplashTexts;
