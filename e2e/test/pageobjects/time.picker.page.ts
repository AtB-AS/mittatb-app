import ElementHelper from '../utils/element.helper.js';

class TimePickerPage {
  /**
   * Return the search button within time chooser
   */
  get searchButton() {
    const reqId = `//*[@resource-id="searchButton"]`;
    return $(reqId);
  }

  /**
   * Open the native time picker
   */
  async openNativeDatePicker() {
    const reqId = `//*[@resource-id="datePicker"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', `android:id/datePicker`);
  }

  /**
   * Open the native time picker
   */
  async openNativeTimePicker() {
    const reqId = `//*[@resource-id="timePicker"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', `android:id/toggle_mode`);
  }
}

export default new TimePickerPage();
