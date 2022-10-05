import {device, by} from 'detox';
import {getNumberOfIncreasedIds, goBack, goToTab} from '../utils/commonHelpers';
import {scroll, scrollToId, tapById} from '../utils/interactionHelpers';
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectNotToBeVisibleByText,
  expectNotToExistsById,
  expectToExistsByIdHierarchy,
  expectToExistsById,
} from '../utils/expectHelpers';
import {skipOnboarding} from '../utils/onboarding';
import setLocation from '../utils';
import {
  deviceNameIsDefined,
  mobileIsSelected,
  logIn,
  logOut,
} from '../utils/account';
import {ensureTicketingIsAccepted} from '../utils/tickets';
import {userInfo} from '../utils/testData';
import {expectGreaterThan} from '../utils/jestAssertions';

/*
  Necessities for test data in this test suite is described in ../utils/testData.ts
 */

// NOTE! Due to recaptcha during the login process, tests may not run
// NOTE!! Currently not enabled due to no mobile tokens
xdescribe('Account', () => {
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
    isLoggedIn = await logIn(
      userInfo.phoneNumber,
      userInfo.otp,
      userInfo.customerNumber,
    );
  });

  beforeEach(async () => {
    await device.reloadReactNative();
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

  it('should switch the ticket bearer', async () => {
    // ** Switch > travelcard **
    const switchMobileToTravelcard = async () => {
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('mobileIcon');
      await deviceNameIsDefined();

      // Switch
      await tapById('switchTokenButton');
      await expectToBeVisibleById('selectTravelcard');
      await expectToBeVisibleById('selectMobile');
      await expectToExistsById('selectTravelcardRadioNotChecked');
      await expectToExistsById('selectMobileRadioChecked');
      await expectToBeVisibleByText('Select device');

      // Choose travelcard
      await tapById('selectTravelcard');
      await expectToExistsById('selectTravelcardRadioChecked');
      await expectToExistsById('selectMobileRadioNotChecked');
      await expectNotToBeVisibleByText('Select device');
      await scrollToId(
        'selectTokenScrollView',
        'confirmSelectionButton',
        'down',
      );
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

      await tapById('ticket0Details');
      await expectNotToExistsById('staticBarcode');
      await expectNotToExistsById('mobileTokenBarcode');
      await goBack();
    };

    // ** Switch > mobile **
    const switchTravelcardToMobile = async () => {
      await expectToBeVisibleById('travelTokenBox');
      await expectToBeVisibleById('travelCardIcon');

      // Switch
      await tapById('switchTokenButton');
      await expectToExistsById('selectTravelcardRadioChecked');
      await expectToExistsById('selectMobileRadioNotChecked');

      // Choose mobile
      await tapById('selectMobile');
      await expectToExistsById('selectTravelcardRadioNotChecked');
      await expectToExistsById('selectMobileRadioChecked');
      await scrollToId(
        'selectTokenScrollView',
        'confirmSelectionButton',
        'down',
      );
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

      await tapById('ticket0Details');
      await expectNotToExistsById('staticBarcode');
      await expectNotToExistsById('mobileTokenBarcode');
      await goBack();
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

  it('should have elements in ticket history', async () => {
    if (isLoggedIn) {
      await goToTab('profile');
      await scroll('profileHomeScrollView', 'top');
      await tapById('ticketHistoryButton');

      // Verify
      await expectToBeVisibleById('ticket0');
      const noExpired = await getNumberOfIncreasedIds('ticket');
      expectGreaterThan(noExpired, 1);

      // Show details of first ticket
      await tapById('ticket0Details');

      // Verify
      await expectToBeVisibleById('detailsProduct');
      await expectToBeVisibleById('detailsUserAndCount');
      await expectToBeVisibleById('receiptButton');

      await goBack();
      await goBack();
    }
  });

  xit('should show correct user id in debug menu', async () => {
    if (isLoggedIn) {
      await goToTab('profile');
      await scrollToId('profileHomeScrollView', 'debugButton', 'down');
      await tapById('debugButton');

      // Verify
      await scrollToId('debugInfoScrollView', 'userId', 'down');
      await expectToExistsByIdHierarchy(
        by.text(userInfo.user_id).withAncestor(by.id('userId')),
      );
      await goBack();
    }
  });
});
