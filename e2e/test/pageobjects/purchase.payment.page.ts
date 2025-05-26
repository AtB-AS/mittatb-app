class PurchasePaymentPage {
  /**
   * Get the Vipps button
   */
  get vipps() {
    const reqId = `//*[@resource-id="VippsButton"]`;
    return $(reqId);
  }

  /**
   * Get the new payment card button
   */
  get newPaymentCard() {
    const reqId = `//*[@resource-id="newPaymentCardButton"]`;
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
