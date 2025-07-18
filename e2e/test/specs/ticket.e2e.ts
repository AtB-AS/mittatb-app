import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketBuyPage from '../pageobjects/ticket.buy.page.ts';
import PurchaseOverviewPage from '../pageobjects/purchase.overview.page.ts';
import PurchaseSummaryPage from '../pageobjects/purchase.summary.page.ts';
import PurchasePaymentPage from '../pageobjects/purchase.payment.page.ts';

describe('Ticket', () => {
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

  // Show warnings for anonymous users
  it('should have restrictions for anonymous users', async () => {
    try {
      // Anonymous warning
      expect(await TicketBuyPage.anonymousWarning).toBeDisplayed();
      expect(await TicketBuyPage.getAnonymousWarningTitle).toContain(
        'Anonymous ticket purchases',
      );

      await TicketBuyPage.anonymousWarning.click();
      await ElementHelper.waitForElement(
        'text',
        'Restrictions on anonymous ticket purchases',
      );

      // Restrictions page
      expect(await OnboardingPage.logIn).toBeEnabled();
      expect(await OnboardingPage.acceptLimitations).toBeEnabled();
      await OnboardingPage.acceptLimitations.click();

      await ElementHelper.waitForElement('text', 'Travel search');
      await NavigationHelper.tapMenu('tickets');
      expect(await TicketBuyPage.anonymousWarning).toBeDisplayed();

      // Period
      await TicketBuyPage.chooseFareProduct('period');
      await ElementHelper.waitForElement('text', 'Log in to purchase');
      expect(await OnboardingPage.logInPurchaseDescription).toContain(
        'requires that you are logged in',
      );
      expect(await OnboardingPage.logIn).toBeEnabled();
      expect(await OnboardingPage.logInLater).toBeEnabled();
      await OnboardingPage.logInLater.click();
      await ElementHelper.waitForElement('text', 'Tickets');
    } catch (errMsg) {
      await AppHelper.screenshot('error_ticket_restrictions_anonymous_users');
      throw errMsg;
    }
  });

  // Walk through the purchase flow for a single ticket - without the actual purchase
  it('should have a correct purchase flow', async () => {
    try {
      await TicketBuyPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.removeGlobalMessages();

      // Pre
      expect(await PurchaseOverviewPage.getZone()).toContain('Zone A');
      expect(await PurchaseOverviewPage.getTraveller()).toContain('1 Adult');

      // Set traveller and zone
      await PurchaseOverviewPage.selectTraveller();
      await PurchaseOverviewPage.decreaseTravellerCount('adult');
      await PurchaseOverviewPage.increaseTravellerCount('child');
      await PurchaseOverviewPage.confirmTravellers();
      await PurchaseOverviewPage.setZones('B2', 'B2');
      expect(await PurchaseOverviewPage.getZone()).toContain('Zone B2');

      expect(await PurchaseOverviewPage.getTraveller()).toContain('1 Child');

      const totalPrice: number = await PurchaseOverviewPage.getTotalPrice();
      // Ensure an offer
      if (totalPrice > 0) {
        expect(await PurchaseOverviewPage.goToPayment).toBeEnabled();
        await PurchaseOverviewPage.goToPayment.click();

        // Ticket summary
        await ElementHelper.waitForElement('text', 'Ticket summary');
        expect(await PurchaseSummaryPage.summaryText.getText()).toContain(
          'Valid in zone B2',
        );
        expect(
          await PurchaseSummaryPage.userProfileCountAndName.getText(),
        ).toContain('1 Child');
        expect(await PurchaseSummaryPage.getTotalPrice()).toBeGreaterThan(0);
        await PurchaseSummaryPage.choosePayment.click();

        // Payment
        expect(await PurchasePaymentPage.vipps).toExist();
        expect(await PurchasePaymentPage.newPaymentCard).toExist();
        expect(await PurchasePaymentPage.confirmPayment).toBeDisabled();

        await PurchasePaymentPage.vipps.click();
        expect(await PurchasePaymentPage.confirmPayment).toBeEnabled();
        await PurchasePaymentPage.newPaymentCard.click();
        expect(await PurchasePaymentPage.confirmPayment).toBeEnabled();
        // NOTE! Only for logged-in users
        /*
            expect(await PurchasePaymentPage.saveCard).toExist()
            expect(await PurchasePaymentPage.saveCard).not.toBeChecked()
            await PurchasePaymentPage.saveCard.click()
            expect(await PurchasePaymentPage.saveCard).toBeChecked()
         */

        await NavigationHelper.close();
        await AppHelper.pause();
        await NavigationHelper.back();
        await AppHelper.pause();
        await NavigationHelper.back();
      }
      // No offer
      else {
        expect(await PurchaseOverviewPage.goToPayment).toBeDisabled();
        await NavigationHelper.back();
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_ticket_correct_purchase_flow');
      throw errMsg;
    }
  });

  // Cannot buy a ticket on behalf of others when anonymous
  it('should not be able to buy on behalf of others when anonymous', async () => {
    try {
      // Single ticket
      await TicketBuyPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.removeGlobalMessages();

      // Check on-behalf-of
      await PurchaseOverviewPage.selectTraveller();
      expect(await PurchaseOverviewPage.onBehalfOfToggle).not.toExist();
      await PurchaseOverviewPage.confirmTravellers();
      await NavigationHelper.back();

      // Night ticket
      await TicketBuyPage.chooseFareProduct('night_v2');
      await ElementHelper.waitForElement('text', 'Night ticket, bus and tram');
      expect(await PurchaseOverviewPage.onBehalfOfToggle).not.toExist();
      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot('error_ticket_on_behalf_of_anonymous');
      throw errMsg;
    }
  });

  // Choose to buy a ticket on behalf of others, and check the information along the purchase flow
  // NB! Disabled since on-behalf-of is only for logged-in users
  xit('should be able to buy on behalf of others', async () => {
    const onBehalfOfPhoneNumber: number = 91111111;

    try {
      await TicketBuyPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.removeGlobalMessages();

      expect(await PurchaseOverviewPage.getTraveller()).toContain('1 Adult');

      // Set on-behalf-of
      await PurchaseOverviewPage.selectTraveller();
      await PurchaseOverviewPage.decreaseTravellerCount('adult');
      await PurchaseOverviewPage.increaseTravellerCount('child');
      expect(await PurchaseOverviewPage.onBehalfOfToggle).not.toBeChecked();
      await PurchaseOverviewPage.onBehalfOfToggle.click();
      await PurchaseOverviewPage.confirmTravellers();

      const totalPrice: number = await PurchaseOverviewPage.getTotalPrice();
      // Ensure an offer
      if (totalPrice > 0) {
        expect(await PurchaseOverviewPage.goToPayment).toBeEnabled();
        await PurchaseOverviewPage.goToPayment.click();

        // On-behalf-of
        await ElementHelper.waitForElement('text', 'Buy for others');
        expect(await PurchaseOverviewPage.goToPaymentOnBehalfOf).toBeDisabled();
        await PurchaseOverviewPage.setPhoneNumber(onBehalfOfPhoneNumber);
        expect(await PurchaseOverviewPage.goToPaymentOnBehalfOf).toBeEnabled();
        await PurchaseOverviewPage.goToPaymentOnBehalfOf.click();

        // Ticket summary
        await ElementHelper.waitForElement('text', 'Ticket summary', 15000);
        expect(
          await PurchaseSummaryPage.summaryOnBehalfOfText.getText(),
        ).toContain(`Sending to +47${onBehalfOfPhoneNumber}`);
        expect(
          await PurchaseSummaryPage.userProfileCountAndName.getText(),
        ).toContain('1 Child');
        expect(await PurchaseSummaryPage.getTotalPrice()).toBeGreaterThan(0);
        expect(await PurchaseSummaryPage.choosePayment).toBeEnabled();

        await NavigationHelper.back();
        await AppHelper.pause();
        await NavigationHelper.back();
        await AppHelper.pause();
        await NavigationHelper.back();
      }
      // No offer
      else {
        expect(await PurchaseOverviewPage.goToPayment).toBeDisabled();
        await NavigationHelper.back();
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_ticket_buy_on_behalf_of');
      throw errMsg;
    }
  });
});
