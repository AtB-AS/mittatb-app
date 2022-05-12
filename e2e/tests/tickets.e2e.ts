import {by, device} from 'detox';
import {goBack, goToTab} from '../utils/commonHelpers';
import {tapById, tapByText} from '../utils/interactionHelpers';
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectToBeVisibleByPartOfText,
  expectToExistsById,
  expectToExistsByLabel,
  expectIdToHaveChildText,
  expectNotToExistsById,
  expectToExistsByIdHierarchy,
} from '../utils/expectHelpers';
import {skipOnboarding} from '../utils/onboarding';
import setLocation from '../utils';
import {
  buySingleTicket,
  ensureTicketingIsAccepted,
  getTravelInfoForRecentTicket,
  newTicketExists,
  setZones,
  verifyTravellersAndZoneInSummary,
} from '../utils/tickets';
import {logIn, logOut} from '../utils/account';
import {userInfo, ticketInfo} from '../utils/testData';
import {expectStringNotEqual} from '../utils/jestAssertions';
import {Traveller} from '../utils/Traveller';

/*
  Two test suites:
    - Tickets anonymous
    - Tickets authorized (only if login works, i.e. no recaptcha)
      - Necessities for test data is described in ../utils/testData.ts
 */

describe('Tickets anonymous', () => {
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
    await tapById('buyTicketsTab');
    await expectToBeVisibleByText('Single ticket');
    await expectToBeVisibleByText('Periodic ticket');

    // Choose single ticket
    await tapById('singleTicket');

    await expectToBeVisibleByText('1 Adult');
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
    await tapById('buyTicketsTab');
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
    await tapById('buyTicketsTab');
    await tapById('singleTicket');

    // Set zone A -> A
    await tapById('selectZonesButton');
    await tapById('searchFromButton');
    await tapById('tariffZoneAButton');
    await tapById('searchToButton');
    await tapById('tariffZoneAButton');
    await tapById('saveZonesButton');

    // Verify
    await expectToBeVisibleByText('Travel in 1 zone');
    await expectToBeVisibleByText('Zone A');
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
    await expectToBeVisibleByText('Travel in 2 zones');
    await expectToBeVisibleByText('Zone A to zone B1');
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
    await tapById('buyTicketsTab');
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

  // No recent tickets since this anonymous user has not bought any tickets
  it('should not be shown any recent tickets', async () => {
    await tapById('buyTicketsTab');

    // Verify
    await expectNotToExistsById('recent0');
    await expectNotToExistsById('recent0BuyButton');
  });
});

// NOTE! Due to recaptcha during the login process, tests may not run
describe('Tickets authorized', () => {
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

      await expectIdToHaveText(
        'offerTotalPriceText',
        `Total: ${ticketInfo.singleTicketAdultPrice} kr`,
      );

      // Set zone E1 -> E1
      await setZones('E1', 'E1');

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
        'recurringPayment0Number',
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
      await newTicketExists('Travel in 1 zone (E1)');
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
      await tapById('chip30days');

      await expectIdToHaveText(
        'offerTotalPriceText',
        `Total: ${ticketInfo.periodic30daysPrice} kr`,
      );

      await tapById('goToPaymentButton');

      await expectToBeVisibleByText('Monthly pass');
      await expectToBeVisibleByText(`${ticketInfo.periodic30daysPrice} kr`);

      // Go to payment
      await tapById('choosePaymentOptionButton');

      await expectToBeVisibleByText('Select payment option');
      await expectToBeVisibleByText('Vipps');
      await expectToBeVisibleByText('Visa');
      await expectToBeVisibleByText('MasterCard');
      await expectToExistsById('recurringPayment0');
      await expectIdToHaveText(
        'recurringPayment0Number',
        userInfo.recurringPaymentCardNumber,
      );

      await tapByText('Cancel');
      await goBack();
      await goBack();
    }
  });

  it('should be able to change the periodic product', async () => {
    if (isLoggedIn) {
      const product1day = {
        text: '1 days',
        id: 'chip1days',
        name: '24 hour pass',
      };
      const product7days = {
        text: '7 days',
        id: 'chip7days',
        name: 'Weekly pass',
      };
      const product30days = {
        text: '30 days',
        id: 'chip30days',
        name: 'Monthly pass',
      };

      await goToTab('tickets');
      await tapById('buyTicketsTab');

      // Choose period ticket
      await tapById('periodicTicket');

      // Set products and verify in summary
      for (let product of [product1day, product7days, product30days]) {
        await expectToBeVisibleById(product.id);
        await expectIdToHaveChildText(product.id, product.text);
        await tapById(product.id);
        await tapById('goToPaymentButton');

        await expectToBeVisibleByText(product.name);
        await goBack();
      }
      await goBack();
    }
  });

  xit('should be able to change the start time on a periodic product', async () => {
    // No tests yet
  });

  it('should show correct recent tickets with two category travellers', async () => {
    if (isLoggedIn) {
      const travellers: Traveller = {
        adult: true,
        senior: true,
        child: false,
      };
      const zone = 'E1';

      await goToTab('tickets');
      await tapById('buyTicketsTab');

      // Buy ticket
      await buySingleTicket(travellers, zone);
      await tapById('buyTicketsTab');

      // Verify recent tickets
      await expectToExistsById('recent0');
      await expectToExistsByIdHierarchy(
        by.id('recent0Zone').and(by.text(zone)),
      );

      // Travellers (showing max 2 categories before truncating)
      await expectToExistsByIdHierarchy(
        by.id('recent0Travellers0').and(by.text('1 Adult')),
      );
      await expectToExistsByIdHierarchy(
        by.id('recent0Travellers1').and(by.text('1 Senior')),
      );

      // Verify summary page
      await tapById('recent0BuyButton');
      await verifyTravellersAndZoneInSummary(travellers, zone);
      await goBack();
    }
  });

  it('should show correct recent tickets with three category travellers', async () => {
    if (isLoggedIn) {
      const travellers: Traveller = {
        adult: true,
        senior: true,
        child: true,
      };
      const zone = 'E2';

      await goToTab('tickets');
      await tapById('buyTicketsTab');

      // Buy ticket
      await buySingleTicket(travellers, zone);
      await tapById('buyTicketsTab');

      // Verify recent tickets
      await expectToExistsById('recent0');
      await expectToExistsByIdHierarchy(
        by.id('recent0Zone').and(by.text(zone)),
      );

      // Travellers (showing max 2 categories before truncating)
      await expectToExistsByIdHierarchy(
        by.id('recent0Travellers0').and(by.text('1 Adult')),
      );
      await expectToExistsByIdHierarchy(
        by.id('recent0TravellersOthers').and(by.text('+ 2 other categories')),
      );

      // Verify summary page
      await tapById('recent0BuyButton');
      await verifyTravellersAndZoneInSummary(travellers, zone);
      await goBack();
    }
  });

  // Compare traveller and zone information for the different recent tickets
  it('should not show duplicate recent tickets', async () => {
    if (isLoggedIn) {
      await goToTab('tickets');
      await tapById('buyTicketsTab');

      await expectToExistsById('recent0');
      await expectToExistsById('recent1');
      await expectToExistsById('recent2');
      await expectNotToExistsById('recent3');

      // Get travel info for the recent tickets
      let travelInfoRecent0 = await getTravelInfoForRecentTicket('recent0');
      let travelInfoRecent1 = await getTravelInfoForRecentTicket('recent1');
      let travelInfoRecent2 = await getTravelInfoForRecentTicket('recent2');

      // Compare
      expectStringNotEqual(travelInfoRecent0, travelInfoRecent1);
      expectStringNotEqual(travelInfoRecent0, travelInfoRecent2);
      expectStringNotEqual(travelInfoRecent1, travelInfoRecent2);
    }
  });
});
