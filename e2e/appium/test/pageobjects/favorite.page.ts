import Page from './page';
import ElementHelper from '../utils/element.helper';
import AppHelper from '../utils/app.helper';

class FavoritePage extends Page {
  /**
   * Close / confirm favorite choices
   */
  get confirm() {
    const reqId = `//*[@resource-id="confirmButton"]`;
    return $(reqId);
  }

  /**
   * Toggle visibility of favorites
   * Note! Toggles index 0
   */
  get toggleVisibility() {
    const reqId = `//*[@resource-id="selectFavoriteToggle0"]`;
    return $(reqId);
  }

  /**
   * Edit favorites
   */
  get editFavorites() {
    const reqId = `//*[@resource-id="editButton"]`;
    return $(reqId);
  }

  /**
   * Delete favorite
   * Note! Deletes index 0
   */
  async deleteFavorite() {
    const reqId = `//*[@resource-id="deleteFavorite0"]`;
    await $(reqId).click();
    await AppHelper.pause();
    const isAlert = await driver.isAlertOpen();
    if (!isAlert) {
      await AppHelper.pause(2000);
    }
    await driver.acceptAlert();
    await AppHelper.pause();
  }

  /**
   * Choose variation of departure favorite
   * @param type: type of favorite [single, all]
   */
  async chooseFavoriteType(type: 'single' | 'all') {
    let typeId = '';
    switch (type) {
      case 'single':
        typeId = 'onlySelectedDeparture';
        break;
      case 'all':
        typeId = 'allVariationsOfDeparture';
        break;
    }
    const reqId = `//*[@resource-id="${typeId}"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', 'departureItem0');
  }

  /**
   * Get favorite toggle icon
   * @param favorite: favorite or not [no, semi, all]
   * @param quayIndex: index of the quay
   * @param depIndex: index of the departure
   */
  async getFavoriteIcon(
    favorite: 'no' | 'semi' | 'all',
    quayIndex: number = 0,
    depIndex: number = 0,
  ) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const depId = `//*[@resource-id="departureItem${depIndex}"]`;
    const favId = `//*[@resource-id="${favorite}Favorite"]`;
    return $(quayId).$(depId).$(favId);
  }
}

export default new FavoritePage();
