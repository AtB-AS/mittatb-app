import AppHelper from '../utils/app.helper.ts';

class TicketPage {
  /**
   * Choose a ticket aka fare product
   * @param fareProduct fare product to choose, e.g. 'single'
   */
  async chooseFareProduct(fareProduct: string) {
    const reqId = `//*[@resource-id="${fareProduct}FareProduct"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }
}

export default new TicketPage();
