class TicketDetailsPage {
  /**
   * Checks the details include a barcode (mobileToken or static)
   */
  async hasBarcode() {
    const staticId = `//*[@resource-id="staticBarcode"]`;
    const mobileTokenId = `//*[@resource-id="mobileTokenBarcode"]`;
    const hasStatic = await $(staticId).isExisting();
    const hasMT = await $(mobileTokenId).isExisting();
    return hasStatic || hasMT;
  }

  /**
   * Get the type of barcode if it exists (mobileToken or static)
   */
  async getBarcodeType() {
    const staticId = `//*[@resource-id="staticBarcode"]`;
    const mobileTokenId = `//*[@resource-id="mobileTokenBarcode"]`;
    const hasStatic = await $(staticId).isExisting();
    const hasMT = await $(mobileTokenId).isExisting();
    if (hasStatic) {
      return 'static';
    } else if (hasMT) {
      return 'mobileToken';
    }
    return 'nonExisting';
  }
}

export default new TicketDetailsPage();
