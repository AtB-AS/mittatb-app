import Page from './page';
import AppHelper from '../utils/app.helper';

class TicketPage extends Page {
  /**
   * Choose a ticket a.k.a fare product
   * @param fareProduct: fare product to choose, e.g. 'single'
   */
  async chooseFareProduct(fareProduct: string) {
    const reqId = `//*[@resource-id="${fareProduct}FareProduct"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }
}

export default new TicketPage();
