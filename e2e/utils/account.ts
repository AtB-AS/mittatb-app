import {by} from 'detox';
import {scroll, tapById} from './interactionHelpers';
import {expectIdToNotHaveText, expectToBeVisibleByText} from './expectHelpers';
import {goBack, goToTab, idExists, setInputById} from './commonHelpers';

// Log in to the app
export const logIn = async (
  phoneNumber: string,
  otp: string,
  customerNumber: string,
) => {
  await tapById('loginButton');
  await setInputById('loginPhoneInput', phoneNumber);
  await tapById('sendCodeButton');

  //await waitToExistById('loginConfirmCodeInput', 10000)
  const otpReady = await idExists(by.id('loginConfirmCodeInput'), 10000);
  if (otpReady) {
    await setInputById('loginConfirmCodeInput', otp);
    await tapById('submitButton');

    await expectToBeVisibleByText(customerNumber);
  }

  return otpReady;
};

// Log out of the app
export const logOut = async () => {
  await goToTab('profile');
  // Go back if not on main profile tab
  if (await idExists(by.id('lhb'))) {
    await goBack();
  }
  await scroll('profileHomeScrollView', 'top');
  await tapById('logoutButton');
};

// Check the name of the devce
export const deviceNameIsDefined = async () => {
  await expectIdToNotHaveText('mobileTokenName', 'Undefined');
  await expectIdToNotHaveText('mobileTokenName', 'TempDeviceName');
  await expectIdToNotHaveText('mobileTokenName', 'Unnamed device');
};

// Check if mobile is the current travel token
export const mobileIsSelected = async () => {
  return await idExists(by.id('mobileIcon'));
};
