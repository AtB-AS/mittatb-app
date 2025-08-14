import AppHelper from '../utils/app.helper.ts';
import {driver} from '@wdio/globals';
import ElementHelper from '../utils/element.helper.js';

class TicketActivePage {
  /**
   * Get the product name
   */
  get productName() {
    const reqId = `//*[@resource-id="productName"]`;
    //TODO
    const s = $(reqId).getText();
    console.log(`=====\nproductName: ${s}\n=====`);
    return $(reqId).getText();
  }

  /**
   * Checks if an available ticket is valid
   * @param ticketIndex which ticket to check (default: 0, i.e. first ticket)
   */
  async isTicketValid(ticketIndex: number = 0) {
    const ticketId = `//*[@resource-id="ticket${ticketIndex}"]`;
    // Possible statuses: valid | reserving | approved | rejected
    const validId = `//*[@resource-id="validTicket"]`;
    return $(ticketId).$(validId).isExisting();
  }

  /**
   * Get the ticket details
   * @param ticketIndex which ticket (default: 0, i.e. first ticket)
   */
  async openTicketDetails(ticketIndex: number = 0) {
    const detailsId = `//*[@resource-id="ticket${ticketIndex}Details"]`;
    await $(detailsId).click();
  }

  /**
   * Pull to refresh the available tickets
   */
  async pullToRefresh() {
    const scrollId = await ElementHelper.getElement('availableFCScrollView');
    await driver.execute('mobile: dragGesture', {
      elementId: scrollId,
      startX: 550,
      startY: 1000,
      endX: 550,
      endY: 2000,
    });
    await AppHelper.pause(200);
    await ElementHelper.waitForElement('id', 'ticket0');
  }
}

export default new TicketActivePage();
