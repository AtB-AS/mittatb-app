import AppHelper from '../../utils/app.helper.ts';
import OnboardingPage from '../../pageobjects/onboarding.page.ts';
import NavigationHelper from '../../utils/navigation.helper.ts';
import VisualHelper from '../../utils/visual.helper.js';
import ElementHelper from '../../utils/element.helper.js';
import TicketPage from '../../pageobjects/ticket.page.js';
import PurchaseOverviewPage from '../../pageobjects/purchase.overview.page.js';
import PurchaseSummaryPage from '../../pageobjects/purchase.summary.page.js';
import PurchasePaymentPage from '../../pageobjects/purchase.payment.page.js';

/**
 * Runs through the app and does some visual comparisons of the screen
 */
describe('Visual tests', () => {
  // Generate new baseline images locally by setting this to 'true'
  const newBaseline = false;

  // Set test options
  const testOptions = {
    baselineFolder: `${process.env.PWD}/screenshots/visualTests/baseline`,
    actualFolder: `${process.env.PWD}/screenshots/visualTests/actual`,
    diffFolder: `${process.env.PWD}/screenshots/visualTests/diff`,
    returnAllCompareData: true,
  };

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('visual');
    await AppHelper.pause(500);
  });

  it('ticket screen should be equal to baseline', async () => {
    try {
      await NavigationHelper.tapMenu('tickets');
      await NavigationHelper.tapMenu('tickets');
      await ElementHelper.waitForElement('id', 'purchaseTab');
      await AppHelper.removeGlobalMessages();

      await VisualHelper.visualTestScreen('tickets', testOptions, newBaseline);
      await VisualHelper.visualTestElement(
        'singleFareProduct',
        'tickets_singleTicketElem',
        testOptions,
        newBaseline,
      );
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_tickets');
      throw errMsg;
    }
  });

  it('single ticket should be equal to baseline', async () => {
    try {
      await NavigationHelper.tapMenu('tickets');
      await NavigationHelper.tapMenu('tickets');
      await ElementHelper.waitForElement('id', 'purchaseTab');
      await AppHelper.removeGlobalMessages();

      await TicketPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.removeGlobalMessages();

      // Overview
      await VisualHelper.visualTestScreen(
        'tickets_singleTicket',
        testOptions,
        newBaseline,
      );

      // Details
      await PurchaseOverviewPage.selectTraveller();
      await VisualHelper.visualTestScreen(
        'tickets_selectTraveller',
        testOptions,
        newBaseline,
      );
      await NavigationHelper.close();
      await PurchaseOverviewPage.showTicketInformation();
      await VisualHelper.visualTestScreen(
        'tickets_ticketInformationSingle',
        testOptions,
        newBaseline,
      );
      await NavigationHelper.back();
      await PurchaseOverviewPage.flexDiscountExpandable.click();
      await AppHelper.pause();
      await VisualHelper.visualTestScreen(
        'tickets_flexDiscountExpanded',
        testOptions,
        newBaseline,
      );
      await PurchaseOverviewPage.flexDiscountExpandable.click();
      await AppHelper.pause();

      // Purchase flow (ensure an offer)
      const totalPrice: number = await PurchaseOverviewPage.getTotalPrice();
      if (totalPrice > 0) {
        await PurchaseOverviewPage.goToPayment.click();
        await ElementHelper.waitForElement('text', 'Ticket summary');
        await VisualHelper.visualTestScreen(
          'tickets_purchaseSummary',
          testOptions,
          newBaseline,
        );
        await PurchaseSummaryPage.choosePayment.click();
        await PurchasePaymentPage.mastercard.click();
        await PurchasePaymentPage.confirmPayment.click();
        await ElementHelper.waitForElement('text', 'Ticket summary');
        await VisualHelper.visualTestScreen(
          'tickets_purchaseSummaryMC',
          testOptions,
          newBaseline,
        );
        await NavigationHelper.back();
        await AppHelper.pause();
        await NavigationHelper.back();
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_singleTicket');
      throw errMsg;
    }
  });

  it('night ticket should be equal to baseline', async () => {
    try {
      await NavigationHelper.tapMenu('tickets');
      await NavigationHelper.tapMenu('tickets');
      await ElementHelper.waitForElement('id', 'purchaseTab');
      await AppHelper.removeGlobalMessages();

      await TicketPage.chooseFareProduct('night_v2');
      await ElementHelper.waitForElement('text', 'Night ticket, bus and tram');
      await AppHelper.removeGlobalMessages();

      // Overview
      await VisualHelper.visualTestScreen(
        'tickets_nightTicket',
        testOptions,
        newBaseline,
      );

      // Without traveller descriptions
      await PurchaseOverviewPage.toggleDescription.click();
      await AppHelper.pause();
      await VisualHelper.visualTestScreen(
        'tickets_nightTicket2',
        testOptions,
        newBaseline,
      );
      await PurchaseOverviewPage.showTicketInformation();
      await VisualHelper.visualTestScreen(
        'tickets_ticketInformationNight',
        testOptions,
        newBaseline,
      );
      await NavigationHelper.back();
      await AppHelper.pause();
      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_nightTicket');
      throw errMsg;
    }
  });
});
