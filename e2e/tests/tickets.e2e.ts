import {device, by, element} from 'detox';
import {findTextViewElementDisplayText, goBack, goToTab} from '../utils/commonHelpers';
import {
  expectToBeVisibleById,
  expectNotToBeVisibleById,
  expectToBeVisibleByText,
  tapById,
  tapByText,
  expectTextById,
} from '../utils/interactionHelpers';
import {skipOnboarding} from '../utils/onboarding';
import setLocation from '../utils';

describe('Tickets', () => {
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
    //await setLocation(62.4305, 9.3951);
    await skipOnboarding();

    // Accept ticket limitations
    await goToTab('tickets');
    await expectToBeVisibleByText('Try buying tickets');
    await tapById('confirmButton');
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should be able to buy a single ticket', async () => {
    const ticketPrice = '42 kr';

    await goToTab('tickets');

    await expectToBeVisibleByText('Buy');
    await expectToBeVisibleByText('Valid');
    await expectToBeVisibleByText('New single ticket');
    await expectToBeVisibleByText('New periodic ticket');

    // Choose single ticket
    await tapById('singleTicketBuyButton');

    await expectToBeVisibleByText('Single ticket bus/tram');
    await expectToBeVisibleByText('1 Adult');
    await expectToBeVisibleByText('Starting now');
    //Sometimes C3 comes up in the tests
    //await expectToBeVisibleByText('Travel in 1 zone (A)');
    await expectTextById('offerTotalPriceText', `Total: ${ticketPrice}`);

    await tapById('goToPaymentButton');

    await expectToBeVisibleByText('Single ticket');
    await expectToBeVisibleByText('1 Adult');
    await expectToBeVisibleByText(ticketPrice);
    await expectToBeVisibleByText('Single ticket bus/tram');
    await expectToBeVisibleByText('Valid in zone A');
    await expectToBeVisibleByText('Starting now');

    // Check the payment cards
    for (let paymentMethod of ['Vipps', 'Visa', 'MasterCard']) {
      await tapById('choosePaymentOptionButton');

      await expectToBeVisibleByText('Select payment option');
      await expectToBeVisibleByText('Vipps');
      await expectToBeVisibleByText('Visa');
      await expectToBeVisibleByText('MasterCard');

      // Test disabled confirm button (Detox does not have a 'isEnabled' method)
      await expectToBeVisibleById('MasterCardButton');
      await tapById('confirmButton');
      await expectToBeVisibleById('MasterCardButton');

      // Choose payment and enable confirm button
      await tapById(paymentMethod + 'Button');

      /*
        // DISABLED - success before
        // After confirming, the app waits on something that makes next command hang
        // With 'await device.disableSynchronization()' the 'Cancel' button is found, but is then not visible for
        // interactions.

        await tapById('confirmButton');

        // Validate loading of external payment component
        //await waitFor(element(by.text('Loading payment terminal…'))).toBeVisible();
        //await waitFor(element(by.type('AXRemoteElement'))).toExist();

        // Cancel
        await tapByText('Cancel');
        await expectToBeVisibleByText('Single ticket');
       */
      /*
        Testing the Vipps integration is even harder due to no Vipps installed on the simulator. Ideas:
        - Pick up that the app is using a deep link?
        - Integrate a local physical Mac to the GH action and run the tests on an attached mobile device with Vipps
        */

      await tapByText('Cancel');
    }
  });

  it('should be able to buy a period ticket', async () => {
    await goToTab('tickets');

    await expectToBeVisibleByText('Buy');
    await expectToBeVisibleByText('Valid');
    await expectToBeVisibleByText('New single ticket');
    await expectToBeVisibleByText('New periodic ticket');

    // Choose period ticket
    await tapById('periodTicketBuyButton');

    await expectToBeVisibleByText('Periodic tickets – available now!');
    await expectToBeVisibleByText(
      'Log in to purchase 7, 30 or 180-day tickets.',
    );
    await expectToBeVisibleById('loginButton');
    await expectToBeVisibleByText('Take me to login');
    await expectToBeVisibleById('loginLaterButton');
    await expectToBeVisibleByText('I want to log in later');

    // *** TODO Handle log in - must have a cron, or equal, to remove created mobile tokens
  });
});
