import {$} from '@wdio/globals';

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
   * Check that the given type of barcode exists
   * @param type type of barcode (mobileToken or static or notInspectable)
   */
  async checkBarcodeType(type: 'mobileToken' | 'static' | 'notInspectable') {
    let reqId = '';
    switch (type) {
      case 'mobileToken':
        reqId = `//*[@resource-id="mobileTokenBarcode"]`;
        break;
      case 'static':
        reqId = `//*[@resource-id="staticBarcode"]`;
        break;
      case 'notInspectable':
        reqId = `//*[@resource-id="notInspectableIcon"]`;
        break;
    }
    return await $(reqId).isExisting();
  }

  /**
   * Get the product name for the ticket
   */
  async productName() {
    const nameId = `//*[@resource-id="productName"]`;
    return await $(nameId).getText();
  }
}

export default new TicketDetailsPage();
