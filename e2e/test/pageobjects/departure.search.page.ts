import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.js';
import TimeHelper from '../utils/time.helper.js';

class DepartureSearchPage {
  /**
   * Search from
   */
  get searchFrom() {
    const reqId = `//*[@resource-id="searchFromButton"]`;
    return $(reqId);
  }

  /**
   * Set departure date
   */
  async openDateTimePicker() {
    const reqId = `//*[@resource-id="setDateButton"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', 'datePicker');
    //id: no.mittatb.debug:id/pickerWrapper
  }

  /**
   * Set departure date based on nextDay option
   * @param weekday Weekdays numbered from 0 (Monday) to 6 (Sunday)
   */
  async setFutureDepartureTime(weekday: number) {
    const dateStringArray = TimeHelper.getNextWeekDayDate(weekday);
    const dateString = `${dateStringArray[2]}. ${dateStringArray[1]}`;

    const reqId = `//*[@resource-id="setDateButton"]`;
    const reqIdText = `//*[@resource-id="buttonText"]`;
    const reqIdNext = `//*[@resource-id="nextDayButton"]`;

    let buttonText = await $(reqId).$(reqIdText).getText();
    // To avoid an error causing an endless loop
    let counter = 0;

    while (!buttonText.includes(dateString) && counter < 15) {
      counter++;
      await $(reqIdNext).click();
      await AppHelper.pause();
      await ElementHelper.waitForElement('id', 'setDateButton');
      buttonText = await $(reqId).$(reqIdText).getText();
    }
  }

  /**
   * Click the given stop place
   * @param stopPlace name of the stop place
   */
  async chooseStopPlace(stopPlace: string) {
    await ElementHelper.waitForElement('id', 'nearbyStopsContainerView');
    await ElementHelper.waitForElement('id', 'stopPlaceItem0');
    // Choose requested stop place
    for (let i = 0; i < 10; i++) {
      const stopId = `//*[@resource-id="stopPlaceItem${i}Name"]`;
      if ((await $(stopId).getText()) === stopPlace) {
        await $(stopId).click();
        break;
      }
    }
    await ElementHelper.waitForElement('id', 'departuresContentView');
  }
}

export default new DepartureSearchPage();
