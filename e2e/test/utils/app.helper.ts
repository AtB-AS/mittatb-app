import ElementHelper from './element.helper';

const screenshotsFolder: string = './e2e/screenshots';

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

  /***
   * Pause in ms
   * @param ms: how long to pause in ms
   * @param isLocalDependent: if true, use a lower pause time for local runs - min(2000, ms)
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
   * @param fileName: The filename as <filename>.png
   */
  async screenshot(fileName: string) {
    await driver.saveScreenshot(`${screenshotsFolder}/${fileName}.png`);
  }

  /**
   * Scroll down with default scroll parameters
   */
  async scrollDown() {
    await driver.touchAction([
      {action: 'longPress', x: 0, y: 1000},
      {action: 'moveTo', x: 0, y: 10},
      'release',
    ]);
  }

  /**
   * Scroll up with default scroll parameters
   */
  async scrollUp() {
    await driver.touchAction([
      {action: 'longPress', x: 0, y: 10},
      {action: 'moveTo', x: 0, y: 1000},
      'release',
    ]);
  }

  /**
   * Scroll down until given id is visisble
   * @param id: id to scroll to
   */
  async scrollDownUntilId(id: string) {
    let elem = await ElementHelper.getElement(id);
    let j = 0;
    while (elem.elementId === undefined && j < 5) {
      await this.scrollDown();
      elem = await ElementHelper.getElement(id);
      j++;
    }
    await expect(elem).toBeDisplayed({wait: 200, interval: 100});
  }

  /**
   * Scroll up until given id is visisble
   * @param id: id to scroll to
   */
  async scrollUpUntilId(id: string) {
    let elem = await ElementHelper.getElement(id);
    let j = 0;
    while (elem.elementId === undefined && j < 5) {
      await this.scrollUp();
      elem = await ElementHelper.getElement(id);
      j++;
    }
    await expect(elem).toBeDisplayed({wait: 200, interval: 100});
  }
}

export default new AppHelper();
