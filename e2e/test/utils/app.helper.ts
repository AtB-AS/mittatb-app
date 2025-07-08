import ElementHelper from './element.helper.ts';
import {driver} from '@wdio/globals';
import {numberToStringWithZeros} from './utils.js';
import Config from '../conf/config.js';

const screenshotsFolder: string = './screenshots';

/**
 * Different helper methods related to the app in general
 */
class AppHelper {
  /**
   * Launch app
   */
  async launchApp() {
    await driver.launchApp();
    await this.pause(5000);
  }

  /**
   * Check if tests are run on CI
   */
  isCI() {
    return `${process.env.IS_CI}` === 'true';
  }

  /***
   * Pause in ms
   * @param ms how long to pause in ms
   * @param isLocalDependent if true, use a lower pause time for local runs - min(2000, ms)
   */
  async pause(ms: number = 500, isLocalDependent: boolean = false) {
    if (isLocalDependent && process.env.IS_LOCAL === 'true') {
      const waitTime = Math.min(2000, ms);
      await driver.pause(waitTime);
    } else {
      await driver.pause(ms);
    }
  }

  /**
   * Take a screenshot
   * @param fileName The filename as <filename>.png
   */
  async screenshot(fileName: string) {
    await driver.saveScreenshot(`${screenshotsFolder}/${fileName}.png`);
  }

  /**
   * Remove dismissible global messages
   */
  async removeGlobalMessages() {
    const closeId = `//*[@resource-id="globalMessageClose"]`;
    // Check for n sec
    const exists = await ElementHelper.isElementExisting(
      'globalMessageClose',
      3,
    );
    if (exists) {
      const noGMs = await $$(closeId).length;
      for (let i = 0; i < noGMs; i++) {
        await $$(closeId)[0].click();
        await this.pause(100);
      }
    }
    await this.pause(200);
  }

  /**
   * Wait until the loading screen is finished
   * @param numberOfRetries used internally to count retries, max = 2
   */
  async waitOnLoadingScreen(numberOfRetries: number = 0) {
    const retryAuthId = `//*[@resource-id="retryAuthButton"]`;

    if (Config.loadingScreenEnabled()) {
      // Wait until loading screen is done
      while (await ElementHelper.isElementExisting('loadingScreen', 2)) {
        await this.pause(500);
      }
    }

    if (Config.loadingErrorScreenEnabled()) {
      // Check if loading failed and retry is available
      const exists = await ElementHelper.isElementExisting(
        'retryAuthButton',
        2,
      );
      // max 2 retries
      if (exists) {
        if (numberOfRetries < 2) {
          await $(retryAuthId).click();
          // new loading screen with increased retry count
          await this.waitOnLoadingScreen(numberOfRetries + 1);
        } else {
          throw new Error(
            '[ERROR] Could not load the app from the loading screen!',
          );
        }
      }
    }
  }

  /**
   * Scroll down with default scroll parameters
   */
  async scrollDown(scrollableId: string) {
    let elem = await ElementHelper.getElement(scrollableId);
    await driver.execute('mobile: scrollGesture', {
      direction: 'down',
      elementId: elem,
      percent: 1.0,
    });
  }

  /**
   * Scroll up with default scroll parameters
   */
  async scrollUp(scrollableId: string) {
    let elem = await ElementHelper.getElement(scrollableId);
    await driver.execute('mobile: scrollGesture', {
      direction: 'up',
      elementId: elem,
      percent: 1.0,
    });
  }

  /**
   * Scroll down until given id is visisble
   * @param scrollableId scrollable element id
   * @param scrollUntilId id to scroll to
   */
  async scrollDownUntilId(scrollableId: string, scrollUntilId: string) {
    let elem = await ElementHelper.getElement(scrollUntilId);
    let j = 0;
    while (elem.elementId === undefined && j < 5) {
      await this.scrollDown(scrollableId);
      elem = await ElementHelper.getElement(scrollUntilId);
      j++;
    }
    await expect(elem).toBeDisplayed({wait: 200, interval: 100});
  }

  /**
   * Scroll up until given id is visisble
   * @param scrollableId scrollable element id
   * @param scrollUntilId id to scroll to
   */
  async scrollUpUntilId(scrollableId: string, scrollUntilId: string) {
    let elem = await ElementHelper.getElement(scrollUntilId);
    let j = 0;
    while (elem.elementId === undefined && j < 5) {
      await this.scrollUp(scrollableId);
      elem = await ElementHelper.getElement(scrollUntilId);
      j++;
    }
    await expect(elem).toBeDisplayed({wait: 200, interval: 100});
  }

  /**
   * Set the date in the time picker once it's opened
   * @param searchDate set the date (YYYY-MM-DD)
   */
  async setTimePickerDate(searchDate: string) {
    // How many months until targeted date
    const targetDate = new Date(searchDate);
    const month = targetDate.getMonth() + 1;
    const dateOfMonth = targetDate.getDate();
    const currentMonth = new Date().getMonth() + 1;
    const noMonthSteps =
      month - currentMonth < 0
        ? month - currentMonth + 12
        : month - currentMonth;

    // Set correct month
    await ElementHelper.waitForElement('id', `android:id/datePicker`);
    const nextMonth = await ElementHelper.getElement('android:id/next');
    // Find month
    for (let i = 0; i < noMonthSteps; i++) {
      await nextMonth.click();
      await this.pause(50);
    }
    // Set day of month
    const dayInCalendar = await ElementHelper.getElementText(
      dateOfMonth.toString(),
    );
    await dayInCalendar.click();
    // Confirm
    const okButton = await ElementHelper.getElement('android:id/button1');
    await okButton.click();
    await this.pause(1000);
  }

  /**
   * Set the time in the time picker once it's opened
   * @param hours set the hours
   * @param minutes set the minutes
   */
  async setTimePickerTime(hours: number, minutes: number) {
    const hoursS = numberToStringWithZeros(hours);
    const minutesS = numberToStringWithZeros(minutes);

    // Open keyboard input
    await ElementHelper.waitForElement('id', 'android:id/timePicker');
    const toggle = await ElementHelper.getElement('android:id/toggle_mode');
    await toggle.click();
    await this.pause(500);
    // Set values
    const inputHour = await ElementHelper.getElement('android:id/input_hour');
    const inputMin = await ElementHelper.getElement('android:id/input_minute');
    await inputHour.click();
    await inputHour.setValue(hoursS);
    await inputMin.click();
    await inputMin.setValue(minutesS);
    // Confirm
    const okButton = await ElementHelper.getElement('android:id/button1');
    await okButton.click();
    await this.pause(500);
  }
}

export default new AppHelper();
