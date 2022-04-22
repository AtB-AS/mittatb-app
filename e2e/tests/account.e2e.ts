import {device} from 'detox';
import { getNumberOfIncreasedIds, goBack, goToTab, setInputById } from "../utils/commonHelpers";
import {
  tap,
  tapById,
  tapByText,
  waitToExistById,
} from '../utils/interactionHelpers';
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectToBeVisibleByPartOfText,
  expectToBeEnabled,
  expectNotToBeEnabled,
  expectNotToBeVisibleByText,
  expectIdToHaveChildId, expectNotToExistsById
} from "../utils/expectHelpers";
import {skipOnboarding} from '../utils/onboarding';
import setLocation from '../utils';
import {
  deviceNameIsDefined,
  mobileIsSelected,
  logIn,
  logOut,
} from '../utils/account';
import {ensureTicketingIsAccepted} from '../utils/tickets';
import {userInfo} from "../utils/testData";
import { expectGreaterThan } from "../utils/jestAssertions";

/*
  Necessities for test data in this test suite is described in ../utils/testData.ts
 */

// NOTE! Due to recaptcha during the login process, tests may not run
describe('Account', () => {
  let isLoggedIn: boolean = false;

  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        location: 'inuse',
      },
      languageAndLocale: {
        language: 'en',
        locale: 'US',
      },
    });
    await setLocation(62.4305, 9.3951);
    await skipOnboarding();

    // Log in before all tests
    await goToTab('profile');
    isLoggedIn = await logIn(userInfo.phoneNumber, userInfo.otp, userInfo.customerNumber);
  });

  beforeEach(async () => {
    //TODO Activate when more tests
    //await device.reloadReactNative();
  });

  afterAll(async () => {
    // Log out after all tests
    if (isLoggedIn) {
      await logOut();
    } else {
      console.log(
        'WARNING: Tests not run due to recaptcha during the login process',
      );
    }
  });

  xit('should show that another mobile has the inspectable token', async () => {
    if (isLoggedIn) {
      await goToTab('tickets');

      // Accept ticket limitations
      await ensureTicketingIsAccepted();

      await tapById('validTicketsTab');

      // Verify
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('mobileIcon');
      await deviceNameIsDefined();
      await expectToBeVisibleByText(
        'Remember to bring your phone while travelling.',
      );
    }
  });

  xit('should switch the ticket bearer', async () => {
    // ** Switch > travelcard **
    const switchMobileToTravelcard = async () => {
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('mobileIcon');
      await deviceNameIsDefined();

      // Switch
      await tapById('switchTokenButton');
      await expectToBeVisibleById('selectTravelcard');
      await expectToBeVisibleById('selectMobile');
      await expectIdToHaveChildId('selectTravelcard', 'radioNotChecked');
      await expectIdToHaveChildId('selectMobile', 'radioChecked');
      await expectToBeVisibleByText('Select device');

      // Choose travelcard
      await tapById('selectTravelcard');
      await expectIdToHaveChildId('selectTravelcard', 'radioChecked');
      await expectIdToHaveChildId('selectMobile', 'radioNotChecked');
      await expectNotToBeVisibleByText('Select device');
      await tapById('confirmSelectionButton');

      // Verify
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('travelCardIcon');
      await expectIdToHaveText('travelCardNumber', userInfo.travelCardNumber);

      await goToTab('tickets');
      await tapById('validTicketsTab');
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('travelCardIcon');
      await expectIdToHaveText('travelCardNumber', userInfo.travelCardNumber);
      await expectToBeVisibleByText(
        'Remember to bring your t:card when you travel.',
      );

      await tapById('ticket0Details')
      await expectNotToExistsById('paperQRCode')
      await expectNotToExistsById('mobileTokenQRCode')
      await goBack()
    };

    // ** Switch > mobile **
    const switchTravelcardToMobile = async () => {
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('travelCardIcon');

      // Switch
      await tapById('switchTokenButton');
      await expectIdToHaveChildId('selectTravelcard', 'radioChecked');
      await expectIdToHaveChildId('selectMobile', 'radioNotChecked');

      // Choose mobile
      await tapById('selectMobile');
      await expectIdToHaveChildId('selectTravelcard', 'radioNotChecked');
      await expectIdToHaveChildId('selectMobile', 'radioChecked');
      await tapById('confirmSelectionButton');

      // Verify
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('mobileIcon');
      await deviceNameIsDefined();

      await goToTab('tickets');
      await tapById('validTicketsTab');
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('mobileIcon');
      await deviceNameIsDefined();
      await expectToBeVisibleByText(
        'Remember to bring your phone while travelling.',
      );

      await tapById('ticket0Details')
      await expectNotToExistsById('paperQRCode')
      await expectNotToExistsById('mobileTokenQRCode')
      await goBack()
    };

    // ** The test **
    if (isLoggedIn) {
      // Accept ticket limitations
      await goToTab('tickets');
      await ensureTicketingIsAccepted();

      await goToTab('profile');
      await tapById('travelTokenButton');

      // Switch between both travelcard and mobile
      const mobileSelected: boolean = await mobileIsSelected();

      // Depending on what is the current travel token
      if (mobileSelected) {
        await switchMobileToTravelcard();
        await goToTab('profile');
        await switchTravelcardToMobile();
      } else {
        await switchTravelcardToMobile();
        await goToTab('profile');
        await switchMobileToTravelcard();
      }
    }
  });

  xit('should have expired tickets', async () => {
    if (isLoggedIn) {
      await tapById('expiredTicketsButton')

      // Verify
      await expectToBeVisibleById('ticket0')
      const noExpired = await getNumberOfIncreasedIds('ticket')
      expectGreaterThan(noExpired, 1)

      // Show details of first ticket
      await tapById('ticket0Details')

      // Verify
      await expectToBeVisibleById('detailsProduct')
      await expectToBeVisibleById('detailsUserAndCount')
      await expectToBeVisibleById('receiptButton')

      await goBack()
      await goBack()
    }
  });

  xit('should show correct user id in debug menu', async () => {
    //TODO
    //debug menu > id: userId > debugValue == userInfo.user_id
  });
});
