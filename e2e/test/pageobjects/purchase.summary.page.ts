import {$} from '@wdio/globals';

class PurchaseSummaryPage {
  /**
   * Get the summary text - including zone information
   */
  get summaryText() {
    const reqId = `//*[@resource-id="summaryText"]`;
    return $(reqId);
  }

  /**
   * Get the on-behalf-of info in the summary text
   */
  get summaryOnBehalfOfText() {
    const reqId = `//*[@resource-id="onBehalfOfText"]`;
    return $(reqId);
  }

  /**
   * Get user categories and their counts
   */
  get userProfileCountAndName() {
    const reqId = `//*[@resource-id="userProfileCountAndName"]`;
    return $(reqId);
  }

  /**
   * Get the button for going to payment
   */
  get choosePayment() {
    const reqId = `//*[@resource-id="choosePaymentMethodButton"]`;
    return $(reqId);
  }

  /**
   * Get the recurring payment card
   */
  get recurringPaymentCard() {
    const reqId = `//*[@resource-id="paymentSelectionItem"]`;
    return $(reqId);
  }

  /**
   * Get the confirm payment button
   */
  get confirmPayment() {
    const confirm = `//*[@resource-id="confirmPaymentButton"]`;
    return $(confirm);
  }

  /**
   * Get the total price for the offer
   */
  async getTotalPrice() {
    const priceId = `//*[@resource-id="totalPrice"]`;
    const price = await $(priceId).getText();

    // Price text is "${priceString} kr"
    return parseFloat(price.split(' ')[0]);
  }
}

export default new PurchaseSummaryPage();
