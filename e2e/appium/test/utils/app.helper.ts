import ElementHelper from './element.helper';

const screenshotsFolder: string = './screenshots';

class AppHelper {
  async launchApp() {
    await driver.launchApp();
    await this.pause(5000);
  }
  async pause(ms: number = 500) {
    await driver.pause(ms);
  }
  async back() {
    const backId = `//*[@resource-id="lhb"]`;
    await $(backId).click();
    await this.pause(2000);
  }
  async screenshot(fileName: string) {
    await driver.saveScreenshot(`${screenshotsFolder}/${fileName}.png`);
  }
  async scrollDown() {
    await driver.touchAction([
      {action: 'longPress', x: 0, y: 1000},
      {action: 'moveTo', x: 0, y: 10},
      'release',
    ]);
  }
  async scrollUp() {
    await driver.touchAction([
      {action: 'longPress', x: 0, y: 10},
      {action: 'moveTo', x: 0, y: 1000},
      'release',
    ]);
  }
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
