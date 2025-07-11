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

  /**
   * Get a recurring payment card (only for logged-in users)
   * @param cardIndex which card (default: 0, i.e. first card)
   */
  async chooseRecurringPaymentCard(cardIndex: number = 0) {
    const reqId = `//*[@resource-id="recurringPayment${cardIndex}"]`;
    await $(reqId).click();
  }
}

export default new PurchasePaymentPage();
