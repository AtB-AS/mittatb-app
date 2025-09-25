import AppHelper from '../utils/app.helper.ts';

class TicketBuyPage {
  /**
   * Choose a ticket aka fare product
   * @param fareProduct fare product to choose, e.g. 'single'
   */
  async chooseFareProduct(fareProduct: string) {
    const reqId = `//*[@resource-id="${fareProduct}FareProduct"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Open expired tickets
   */
  async openExpiredTickets() {
    const reqId = `//*[@resource-id="historicTicketsButton"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Return the warning info for anonymous purchases
   */
  get anonymousWarning() {
    const reqId = `//*[@resource-id="anonymousWarning"]`;
    return $(reqId);
  }

  /**
   * Return the title of the warning info for anonymous purchases
   */
  get getAnonymousWarningTitle() {
    const reqId = `//*[@resource-id="anonymousWarningTitle"]`;
    return $(reqId).getText();
  }
}

export default new TicketBuyPage();
