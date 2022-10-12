import {by, device} from 'detox';
import {goBack, goToTab} from '../utils/commonHelpers';
import {scroll, tapById, tapByText} from '../utils/interactionHelpers';
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectToBeVisibleByPartOfText,
  expectToExistsById,
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
  setZone,
  setZones,
  verifyTravellerCounts,
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
    await tapById('purchaseTab');
    await expectToBeVisibleByText('Single ticket');
    //await expectToBeVisibleByText('Periodic ticket');
    await expectToBeVisibleByText('24 hour pass');

    // Choose single ticket
    await tapById('singleFareProduct');

    await verifyTravellerCounts(1);
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total ${ticketInfo.singleFareProductAdultPrice}.00 kr`,
    );

    await scroll('purchaseOverviewScrollView', 'bottom');
    await tapById('goToPaymentButton');

    await expectToBeVisibleByText('Single ticket');
    await expectToBeVisibleByText('1 Adult');
    await expectToBeVisibleByText(`${ticketInfo.singleFareProductAdultPrice}.00 kr`);
    await expectToBeVisibleByText('Single ticket bus/tram');
    //Zone is either A or C3 during the tests
    await expectToBeVisibleByPartOfText('Valid in zone');
    await expectToBeVisibleByText('Starting now');
  });

  it('should be able to change travellers on a single ticket', async () => {
    await tapById('purchaseTab');
    await tapById('singleFareProduct');

    await verifyTravellerCounts(1);
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total ${ticketInfo.singleFareProductAdultPrice}.00 kr`,
    );

    // Change the number of travellers
    await tapById('counterInput_adult_add');
    await tapById('counterInput_child_add');
    await verifyTravellerCounts(2, 0, 1);
    const totPrice =
      2 * ticketInfo.singleFareProductAdultPrice + ticketInfo.singleFareProductChildPrice;

    // Verify
    await expectIdToHaveText('offerTotalPriceText', `Total ${totPrice}.00 kr`);

    await scroll('purchaseOverviewScrollView', 'bottom');
    await tapById('goToPaymentButton');
    await expectToBeVisibleByText('2 Adult');
    await expectToBeVisibleByText('1 Child');
    await expectToBeVisibleByText(`${totPrice}.00 kr`);

    await goBack();
    await goBack();
  });

  // TODO The app is crashing (https://github.com/AtB-AS/kundevendt/issues/1560#issuecomment-1252041408)
  xit('should be able to change zone on a single ticket', async () => {
    await tapById('purchaseTab');
    await tapById('singleFareProduct');

    // Set zone A -> A
    await setZones('A', 'A');

    // Verify
    //await expectToBeVisibleByText('Travel in 1 zone');
    await expectToBeVisibleByText('Zone A');
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total ${ticketInfo.singleFareProductAdultPrice}.00 kr`,
    );
    await scroll('purchaseOverviewScrollView', 'bottom');
    await tapById('goToPaymentButton');
    await expectToBeVisibleByText('Valid in zone A');
    await goBack();

    // Set zone A -> B1
    await setZone('To', 'B1');

    // Verify
    //await expectToBeVisibleByText('Travel in 2 zones');
    await expectToBeVisibleByText('Zone A to zone B1');
    await expectIdToHaveText(
      'offerTotalPriceText',
      `Total ${ticketInfo.singleFareProductZoneAZoneB1Price}.00 kr`,
    );
    await scroll('purchaseOverviewScrollView', 'bottom');
    await tapById('goToPaymentButton');
    await expectToBeVisibleByText('Valid from zone A to zone B1');
    await goBack();
    await goBack();
  });

  xit('should be able to toggle traveller information', async () => {});

  xit('should show warning when buying anonymously', async () => {});

  xit('should get an offer for a 24h ticket', async () => {});

  xit('should be able to change travellers on a 24h ticket', async () => {});

  xit('should be able to change zone on a 24h ticket', async () => {});

  xit('should be able to change the start time on a 24h ticket', async () => {});

  // NOTE!! Currently not enabled due to no mobile tokens
  xit('should not be able to buy a periodic ticket as anonymous', async () => {
    await tapById('purchaseTab');
    await tapById('periodicFareProduct');

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
    await tapById('purchaseTab');

    // Verify
    await expectNotToExistsById('recent0');
    await expectNotToExistsById('recent0BuyButton');
  });
});

// NOTE! Due to recaptcha during the login process, tests may not run
// NOTE!! Currently not enabled due to no mobile tokens
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
      await tapById('purchaseTab');

      // Choose single ticket
      await expectToBeVisibleByText('Single ticket');
      await tapById('singleFareProduct');

      await expectIdToHaveText(
        'offerTotalPriceText',
        `Total ${ticketInfo.singleFareProductAdultPrice}.00 kr`,
      );

      // Set zone E1 -> E1
      await setZones('E1', 'E1');

      await scroll('purchaseOverviewScrollView', 'bottom');
      await tapById('goToPaymentButton');

      await expectToBeVisibleByText('Single ticket');
      await expectToBeVisibleByText(`${ticketInfo.singleFareProductAdultPrice} kr`);
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
      await tapById('purchaseTab');

      // Choose period ticket
      await expectToBeVisibleByText('Periodic ticket');
      await tapById('periodicFareProduct');

      // Set product
      await tapById('chip30days');

      await expectIdToHaveText(
        'offerTotalPriceText',
        `Total ${ticketInfo.periodic30daysPrice}.00 kr`,
      );

      await scroll('purchaseOverviewScrollView', 'bottom');
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
      await tapById('purchaseTab');

      // Choose period ticket
      await tapById('periodicFareProduct');

      // Set products and verify in summary
      for (let product of [product7days, product30days]) {
        await expectToBeVisibleById(product.id);
        await expectIdToHaveChildText(product.id, product.text);
        await tapById(product.id);
        await scroll('purchaseOverviewScrollView', 'bottom');
        await tapById('goToPaymentButton');

        await expectToBeVisibleByText(product.name);
        await goBack();
        await scroll('purchaseOverviewScrollView', 'top');
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
      await tapById('purchaseTab');

      // Buy ticket
      await buySingleTicket(travellers, zone);
      await tapById('purchaseTab');

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
      await tapById('purchaseTab');

      // Buy ticket
      await buySingleTicket(travellers, zone);
      await tapById('purchaseTab');

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
      await tapById('purchaseTab');

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
