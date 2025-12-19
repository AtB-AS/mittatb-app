import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.ts';
import AlertHelper from '../utils/alert.helper.ts';

class FavoritePage {
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

    // Confirm alert
    await ElementHelper.waitForAlert();
    await AlertHelper.alertConfirm.click();
    await AppHelper.pause();
  }

  /**
   * Choose variation of departure favorite
   * @param type type of favorite [single, all]
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
    await ElementHelper.waitForElement('id', 'estimatedCallItem');
  }
}

export default new FavoritePage();
