import ElementHelper from '../utils/element.helper.js';
import {$} from '@wdio/globals';

class TokenPage {
  /**
   * Get the mobile token name
   */
  get mobileTokenName() {
    const reqId = `//*[@resource-id="mobileTokenName"]`;
    return $(reqId);
  }

  /**
   * Get the token toggle info
   */
  get tokenToggleInfo() {
    const reqId = `//*[@resource-id="tokenToggleInfoText"]`;
    return $(reqId).getText();
  }

  /**
   * Get the token error message
   */
  get tokenErrorMessage() {
    const reqId = `//*[@resource-id="tokenErrorMessage"]`;
    return $(reqId).getText();
  }

  /**
   * Get the error message for missing travel card
   */
  get noTravelcardWarning() {
    const reqId = `//*[@resource-id="noTravelcardWarningText"]`;
    return $(reqId).getText();
  }

  /**
   * Device text (NB! assume only 1 device)
   */
  get selectedDeviceText() {
    const reqId = `//*[@resource-id="radioButton0Text"]`;
    return $(reqId).getText();
  }

  /**
   * Confirm selected token
   */
  async confirmSelection() {
    const reqId = `//*[@resource-id="confirmSelectionButton"]`;
    await $(reqId).click();
  }

  /**
   * Get the token selection box
   * @param tokenType type of token
   */
  async tokenSelection(tokenType: 'Travelcard' | 'Mobile') {
    const reqId = `//*[@resource-id="select${tokenType}"]`;
    return $(reqId);
  }

  /**
   * Check if chosen token type is selected
   * @param tokenType type of token
   */
  async tokenSelectionRadio(tokenType: 'Travelcard' | 'Mobile') {
    const reqId = `//*[@resource-id="select${tokenType}Radio"]`;
    return $(reqId);
  }

  /**
   * Select the chosen token type
   * @param tokenType type of token
   */
  async selectToken(tokenType: 'Travelcard' | 'Mobile') {
    const reqId = `//*[@resource-id="select${tokenType}"]`;
    await $(reqId).click();
  }

  /**
   * Go to the token switch screen
   */
  async openTokenToggle() {
    const reqId = `//*[@resource-id="changeTravelTokenButton"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', 'selectTokenScrollView');
  }
}

export default new TokenPage();
