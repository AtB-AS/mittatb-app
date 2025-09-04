import ElementHelper from '../utils/element.helper.js';
import {$} from '@wdio/globals';
import AppHelper from "../utils/app.helper.js";

class TokenPage {
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
   * Check if a device name exists
   * @param typeOfDevice either this or other device name
   */
  async deviceNameExists(typeOfDevice: 'this' | 'other') {
    const reqId = `//*[@resource-id="${typeOfDevice}DeviceName"]`;
    return $(reqId).isExisting();
  }

  /**
   * Get device text
   * @param index index of button text to return
   */
  async deviceText(index: number) {
    const reqId = `//*[@resource-id="radioButton${index}Text"]`;
    return $(reqId).getText();
  }

  /**
   * Select this device (always at index 0)
   */
  async selectThisDevice() {
    for (let i = 0; i < 10; i++){
      const text = await this.deviceText(i);
      if (text.includes('this device')) {
        const reqId = `//*[@resource-id="radioButton${i}"]`;
        await $(reqId).click();
        break
      }
    }
  }

  /**
   * Confirm selected token
   */
  async confirmSelection() {
    const reqId = `//*[@resource-id="confirmSelectionButton"]`;
    await $(reqId).click();
  }

  /**
   * Set this device as bearer. Used from other tabs (e.g. tickets, onboarding)
   * @param toggleToDevice whether to toggle to this device or not
   */
  async toggleToThisDevice(toggleToDevice: boolean = true) {
    const isNotMyDevice = await ElementHelper.isElementExisting('travelTokenBox', 1)
    if (isNotMyDevice) {
      // Toggle or not
      if (toggleToDevice){
        await this.openTokenToggle()
        await this.selectThisDevice()
        await this.confirmSelection();
      }
      else {
        const reqId = `//*[@resource-id="nextButton"]`;
        await $(reqId).click();
      }
      await AppHelper.pause(200);
    }
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
