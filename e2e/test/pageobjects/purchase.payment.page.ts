class PurchasePaymentPage {
  /**
   * Get the Vipps button
   */
  get vipps() {
    const reqId = `//*[@resource-id="VippsButton"]`;
    return $(reqId);
  }

  /**
   * Get the Visa button
   */
  get visa() {
    const reqId = `//*[@resource-id="VisaButton"]`;
    return $(reqId);
  }

  /**
   * Get the MasterCard button
   */
  get mastercard() {
    const reqId = `//*[@resource-id="MasterCardButton"]`;
    return $(reqId);
  }

  /**
   * Get the checkbox for saving card (only for logged-in users)
   */
  get saveCard() {
    const reqId = `//*[@resource-id="saveCardCheckbox"]`;
    return $(reqId);
  }

  /**
   * Get the button for purchase
   */
  get confirmPayment() {
    const reqId = `//*[@resource-id="confirmButton"]`;
    return $(reqId);
  }
}

export default new PurchasePaymentPage();
