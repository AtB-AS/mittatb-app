import AppHelper from './app.helper';

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
   * Go to the chosen tab
   * @param page: tab to open
   */
  async tapMenu(page: 'assistant' | 'map' | 'departures' | 'tickets' | 'profile') {
    const menuId = `//*[@resource-id="${page}Tab"]`;
    await $(menuId).click();
    await AppHelper.pause(1000);
  }
}

export default new NavigationHelper();
