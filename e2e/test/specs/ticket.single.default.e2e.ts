import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketBuyPage from '../pageobjects/ticket.buy.page.ts';
import PurchaseOverviewPage from '../pageobjects/purchase.overview.page.ts';
import PurchaseSummaryPage from '../pageobjects/purchase.summary.page.ts';

describe('Single ticket – default purchase flow', () => {
  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('tickets');
    await AppHelper.pause(5000, true);
  });

  beforeEach(async () => {
    await NavigationHelper.tapMenu('tickets');
    await NavigationHelper.tapMenu('tickets');
    await ElementHelper.waitForElement('id', 'purchaseTab');
  });

  it('should show correct defaults on the overview screen', async () => {
    try {
      await TicketBuyPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.removeGlobalMessages();

      expect(await PurchaseOverviewPage.getTraveller()).toMatch(/1\s+Adult/);
      expect(await PurchaseOverviewPage.getZone()).toMatch(/Zone\s+A/);
      expect(await PurchaseOverviewPage.getTotalPrice()).toBe(50);

      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot('error_single_ticket_default_overview');
      await NavigationHelper.back();
      throw errMsg;
    }
  });

  it('should reach ticket summary with correct details and stop before payment', async () => {
    try {
      await TicketBuyPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.removeGlobalMessages();

      expect(await PurchaseOverviewPage.hasOffer()).toBe(true);

      await PurchaseOverviewPage.goToPayment.click();
      await ElementHelper.waitForElement('text', 'Ticket summary');

      expect(await PurchaseSummaryPage.summaryText.getText()).toContain(
        'Valid in zone A',
      );
      expect(
        await PurchaseSummaryPage.travellerCountAndName.getText(),
      ).toContain('1 Adult');
      expect(await PurchaseSummaryPage.getTotalPrice()).toBe(50);

      // Stop here — do not tap choosePayment
    } catch (errMsg) {
      await AppHelper.screenshot('error_single_ticket_default_summary');
      throw errMsg;
    }
  });
});
