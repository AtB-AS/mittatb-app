import {driver} from '@wdio/globals';
// @ts-ignore
import {Result} from '@wdio/visual-service/dist/types.js';

/**
 * Different helper methods related to the app in general
 */
class VisualHelper {
  async saveVisualTestScreen(tag: string, testOptions: any) {
    await driver.saveScreen(tag, testOptions);
  }

  async saveVisualTestElement(elemId: string, tag: string, testOptions: any) {
    const el = `//*[@resource-id="${elemId}"]`;
    await driver.saveElement(await $(el), tag, testOptions);
  }

  async visualTestScreen(tag: string, testOptions: any) {
    const res: Result = await driver.checkScreen(tag, testOptions);
    // console.log(s.misMatchPercentage);
    await expect(res.misMatchPercentage).toEqual(0);
  }

  async visualTestElement(elemId: string, tag: string, testOptions: any) {
    const el = `//*[@resource-id="${elemId}"]`;
    const res: Result = await driver.checkElement(
      await $(el),
      tag,
      testOptions,
    );
    // console.log(s.misMatchPercentage);
    await expect(res.misMatchPercentage).toEqual(0);
  }
}

export default new VisualHelper();
