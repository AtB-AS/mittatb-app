import {device} from 'detox';
import {goBack, goToTab} from '../utils/commonHelpers';
import { scrollContentToId, tapById, tapByText } from "../utils/interactionHelpers";
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectToBeVisibleByPartOfText,
  expectToExistsById,
  expectToExistsByLabel, expectIdToHaveChildText
} from "../utils/expectHelpers";
import {skipOnboarding} from '../utils/onboarding';
import setLocation from '../utils';
import {ensureTicketingIsAccepted, newTicketExists} from '../utils/tickets';
import {logIn, logOut} from '../utils/account';
import {userInfo, ticketInfo} from '../utils/testData';

/*
  Two test suites:
    - Tickets anonymous
    - Tickets authorized (only if login works, i.e. no recaptcha)
      - Necessities for test data is described in ../utils/testData.ts
 */

xdescribe('Tickets anonymous', () => {
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

    // Accept ticket limitations
    await goToTab('tickets');
    await ensureTicketingIsAccepted();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await goToTab('tickets');
  });

  afterAll(async () => {
    await device.reloadReactNative();
  });

  it('should get an offer for a single ticket', async () => {
    await expectToBeVisibleByText('Buy');
    await expectToBeVisibleByText('Valid');
    await expectToBeVisibleByText('Single ticket');
    await expectToBeVisibleByText('Periodic ticket');

    // Choose single ticket
    await tapById('singleTicket');

    await expectToBeVisibleByText('Single ticket bus/tram');
    await expectToBeVisibleByText('1 Adult');
    await expectToBeVisibleByText('Starting now');
    //Zone is either A or C3 during the tests
    await expectToBeVisibleByPartOfText('Travel in 1 zone');
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total: ${ticketInfo.singleTicketAdultPrice} kr`,
    );

    await tapById('goToPaymentButton');

    await expectToBeVisibleByText('Single ticket');
    await expectToBeVisibleByText('1 Adult');
    await expectToBeVisibleByText(`${ticketInfo.singleTicketAdultPrice} kr`);
    await expectToBeVisibleByText('Single ticket bus/tram');
    //Zone is either A or C3 during the tests
    await expectToBeVisibleByPartOfText('Valid in zone');
    await expectToBeVisibleByText('Starting now');
  });

  it('should be able to change travellers', async () => {
    await tapById('singleTicket');

    await expectToBeVisibleByText('1 Adult');
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total: ${ticketInfo.singleTicketAdultPrice} kr`,
    );

    // Change the number of travellers
    await tapById('selectTravellersButton');
    await expectToExistsByLabel('Current selection: 1 Adult');
    await tapById('counterInput0_add');
    await expectToExistsByLabel('Current selection: 2 Adult');
    await tapById('counterInput2_add');
    await expectToExistsByLabel('Current selection: 2 Adult, 1 Child');
    const totPrice =
      2 * ticketInfo.singleTicketAdultPrice + ticketInfo.singleTicketChildPrice;
    await tapById('saveTravellersButton');

    // Verify
    await expectToBeVisibleByText('2 Adult, 1 Child');
    await expectIdToHaveText('offerTotalPriceText', `Total: ${totPrice} kr`);

    await tapById('goToPaymentButton');
    await expectToBeVisibleByText(`${totPrice} kr`);

    await goBack();
    await goBack();
  });

  it('should be able to change zone', async () => {
    await tapById('singleTicket');

    // Set zone A -> A
    await tapById('selectZonesButton');
    await tapById('searchFromButton');
    await tapById('tariffZoneAButton');
    await tapById('searchToButton');
    await tapById('tariffZoneAButton');
    await tapById('saveZonesButton');

    // Verify
    await expectToBeVisibleByText('Travel in 1 zone (A)');
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total: ${ticketInfo.singleTicketAdultPrice} kr`,
    );
    await tapById('goToPaymentButton');
    await expectToBeVisibleByText('Valid in zone A');
    await goBack();

    // Set zone A -> B1
    await tapById('selectZonesButton');
    await tapById('searchToButton');
    await tapById('tariffZoneB1Button');
    await tapById('saveZonesButton');

    // Verify
    await expectToBeVisibleByText('Travel from zone A to zone B1');
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total: ${ticketInfo.singleTicketZoneAZoneB1Price} kr`,
    );
    await tapById('goToPaymentButton');
    await expectToBeVisibleByText('Valid from zone A to zone B1');
    await goBack();
    await goBack();
  });

  it('should not be able to buy a periodic ticket as anonymous', async () => {
    await expectToBeVisibleByText('Buy');
    await expectToBeVisibleByText('Valid');
    await expectToBeVisibleByText('Single ticket');
    await expectToBeVisibleByText('Periodic ticket');

    // Choose period ticket
    await tapById('periodicTicket');

    await expectToBeVisibleByText('Periodic tickets – available now!');
    await expectToBeVisibleByText(
      'Log in to purchase 7, 30 or 180-day tickets.',
    );
    await expectToBeVisibleById('loginButton');
    await expectToBeVisibleByText('Take me to login');
    await expectToBeVisibleById('loginLaterButton');
    await expectToBeVisibleByText('I want to log in later');
  });

  xit('should not be shown any recent tickets', async () => {
    // no recent tickets since the user is anonymous
  })
});

// NOTE! Due to recaptcha during the login process, tests may not run
xdescribe('Tickets authorized', () => {
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

    // Accept ticket limitations
    await goToTab('tickets');
    await ensureTicketingIsAccepted();

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

  it('should buy a single ticket', async () => {
    if (isLoggedIn) {
      await goToTab('tickets');
      await tapById('buyTicketsTab');

      // Choose single ticket
      await expectToBeVisibleByText('Single ticket');
      await tapById('singleTicket');

      await expectToBeVisibleByText('Single ticket bus/tram');
      await expectIdToHaveText(
        'offerTotalPriceText',
        `Total: ${ticketInfo.singleTicketAdultPrice} kr`,
      );

      await tapById('goToPaymentButton');

      await expectToBeVisibleByText('Single ticket');
      await expectToBeVisibleByText(`${ticketInfo.singleTicketAdultPrice} kr`);
      await expectToBeVisibleByText('Single ticket bus/tram');
      await expectToBeVisibleByText('Starting now');

      // Go to payment
      await tapById('choosePaymentOptionButton');

      await expectToBeVisibleByText('Select payment option');
      await expectToBeVisibleByText('Vipps');
      await expectToBeVisibleByText('Visa');
      await expectToBeVisibleByText('MasterCard');
      await expectToExistsById('recurringPayment0');
      await expectIdToHaveText(
        'recurringPaymentNumber',
        userInfo.recurringPaymentCardNumber,
      );

      // Test disabled confirm button (Detox does not have a 'isEnabled' method)
      await expectToBeVisibleById('MasterCardButton');
      await tapById('confirmButton');
      await expectToBeVisibleById('MasterCardButton');

      /*
        Only using stored payment card to buy a ticket. Interaction with Visa and MasterCard is shaky test-wise.
        Testing the Vipps integration is even harder due to no Vipps installed on the simulator. Ideas:
        - Pick up that the app is using a deep link?
        - Integrate a local physical Mac to the GH action and run the tests on an attached mobile device with Vipps
      */

      // Choose stored payment card
      await tapById('recurringPayment0');
      await tapById('confirmButton');

      // Check if ticket exists
      await newTicketExists();
    }
  });

  //Note: Not including the actual buy to reduce the number of long-living tickets
  it('should be able to buy a period ticket', async () => {
    if (isLoggedIn) {
      await goToTab('tickets');
      await tapById('buyTicketsTab');

      // Choose period ticket
      await expectToBeVisibleByText('Periodic ticket');
      await tapById('periodicTicket');

      // Set product
      await scrollContentToId('selectDurationScrollView', 'chip180days', "right")
      await tapById('chip180days');

      await expectIdToHaveText(
        'offerTotalPriceText',
        `Total: ${ticketInfo.periodic180daysPrice} kr`,
      );

      await tapById('goToPaymentButton');

      await expectToBeVisibleByText('180 days pass');
      await expectToBeVisibleByText(`${ticketInfo.periodic180daysPrice} kr`);

      // Go to payment
      await tapById('choosePaymentOptionButton');

      await expectToBeVisibleByText('Select payment option');
      await expectToBeVisibleByText('Vipps');
      await expectToBeVisibleByText('Visa');
      await expectToBeVisibleByText('MasterCard');
      await expectToExistsById('recurringPayment0');
      await expectIdToHaveText(
        'recurringPaymentNumber',
        userInfo.recurringPaymentCardNumber,
      );

      await tapByText('Cancel');
      await goBack();
      await goBack();
    }
  });

  it('should be able to change the periodic product', async () => {
    if (isLoggedIn) {
      const products = [
        {
          text: '1 days',
          id: 'chip1days',
          name: '24 hour pass'
        },
        {
          text: '180 days',
          id: 'chip180days',
          name: '180 days pass'
        },
        {
          text: '180 days',
          id: 'chip180days',
          name: '180 days pass'
        }
      ];

      const product1day = {
        visible: true,
        text: '1 days',
        id: 'chip1days',
        name: '24 hour pass'
      };
      const product30days = {
        visible: true,
        text: '30 days',
        id: 'chip30days',
        name: 'Monthly pass'
      };
      const product180days = {
        visible: false,
        text: '180 days',
        id: 'chip180days',
        name: '180 days pass'
      };

      const text1day = '1 days'
      const text30days = '30 days'
      const text180days = '180 days'
      const id1day = 'chip1days'
      const id30days = 'chip30days'
      const id180days = 'chip180days'
      //const product1day = '24 hour pass'
      //const product30days = 'Monthly pass'
      //const product180days = '180 days pass'

      await goToTab('tickets');
      await tapById('buyTicketsTab');

      // Choose period ticket
      await tapById('periodicTicket');

      /*
      await expectToBeVisibleById(id1day)
      await expectToBeVisibleById(id30days)
      await expectToExistsById(id180days)

      await expectIdToHaveChildText(id1day, text1day)
      await expectIdToHaveChildText(id30days, text30days)
      await expectIdToHaveChildText(id180days, text180days)
       */

      // Set products and verify in summary
      for (let product of [product1day, product30days, product180days]) {
        await expectIdToHaveChildText(product.id, product.text)
        product.visible ? await expectToBeVisibleById(product.id) : await expectToExistsById(product.id)
        await scrollContentToId('selectDurationScrollView', product.id, "right")
        await tapById(product.id);
        await tapById('goToPaymentButton')

        await expectToBeVisibleByText(product.name);
        await goBack()
      }
    }
  })

  xit('should be able to change the start time on a periodic product', async () => {

  })

  xit('should show recent tickets', async () => {
    // - buy a single ticket with 2 traveller categories
    // - check
    // - buy a single ticket with 3 traveller categories
    // - check (remember to check for 'travellersOther')
  })
});
