import {Platform} from 'react-native';
import {translation as _} from '../commons';

const getStoreName = () =>
  Platform.select({
    default: 'App Store',
    android: 'Play Store',
  });

const UpdateSplashTexts = {
  title: _(
    'Du må oppdatere appen!',
    'You have to update the app!',
    'Du må oppdatere appen!',
  ),
  paragraph1: _(
    `Kjøp av billetter er noe vi jobber hyppig med. Siden vi har gjort endringer på hvordan kjøp fungerer, må du oppdatere til nyeste versjon av appen i ${getStoreName()}.`,
    `Ticket purchasing is a feature which is rapidly evolving. Since we've done some changes to how ticketing works, you will have to update to the latest version of the app at the ${getStoreName()}.`,
    `Kjøp av billetter er noko vi jobber hyppig med. Då vi har gjort endringer på korleis kjøp fungerer, må du oppdatere til nyeste versjon av appen i ${getStoreName()}.`,
  ),
};
export default UpdateSplashTexts;
