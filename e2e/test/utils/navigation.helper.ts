import AppHelper from './app.helper.ts';

/**
 * Different helper methods related to navigation in the app
 */
class NavigationHelper {
  /**
   * Go back
   */
  async back() {
    const backId = `//*[@resource-id="lhb"]`;
    await $(backId).click();
    await AppHelper.pause(2000);
  }

  /**
   * Cancel
   */
  async cancel() {
    const cancelId = `//*[@resource-id="rhb"]`;
    await $(cancelId).click();
    await AppHelper.pause(2000);
  }

  /**
   * Close
   */
  async close() {
    const closeId = `//*[@resource-id="closeButton"]`;
    await $(closeId).click();
    await AppHelper.pause(2000);
  }

  /**
   * Close bottom sheet
   */
  async closeBottomSheet() {
    const closeId = `//*[@resource-id="closeBottomSheet"]`;
    await $(closeId).click();
    await AppHelper.pause(1000);
  }

  /**
   * Go to the chosen tab
   * @param page tab to open
   */
  async tapMenu(
    page: 'assistant' | 'map' | 'departures' | 'tickets' | 'profile',
  ) {
    const menuId = `//*[@resource-id="${page}Tab"]`;
    await $(menuId).click();
    await AppHelper.pause(1000);
  }

  /**
   * Go to the chosen ticket tab
   * @param tab tab to open
   */
  async tapTicketTab(tab: 'purchase' | 'activeTickets') {
    const menuId = `//*[@resource-id="${tab}Tab"]`;
    await $(menuId).click();
    await AppHelper.pause(1000);
  }
}

export default new NavigationHelper();
