import AppHelper from './app.helper.ts';

/**
 * Different helper methods related to elements in the app
 */
class ElementHelper {
  /**
   * Waits for an element to be displayed given default timeout
   * @param type test-id or text
   * @param id name of the test-id or text to wait for
   * @param timeout optionally wait longer than default (ms)
   */
  async waitForElement(
    type: 'id' | 'ids' | 'text',
    id: string,
    timeout: number = 10000,
  ) {
    const timeoutValue = AppHelper.isCI() ? timeout * 2 : timeout;
    let requestedEl = '';
    switch (type) {
      case 'id':
        requestedEl = `//*[@resource-id="${id}"]`;
        break;
      case 'text':
        requestedEl = `//*[@text="${id}"]`;
        break;
    }
    return $(requestedEl).waitForDisplayed({
      timeout: timeoutValue,
      interval: 1000,
    });
  }

  /**
   * Waits for an element in an array to be displayed given default timeout
   * @param type test-id or text
   * @param id name of the test-id or text to wait for
   * @param index if type = ids
   * @param timeout optionally wait longer than default (ms)
   */
  async waitForIndexedElement(
    type: 'id' | 'text',
    id: string,
    index: number = 0,
    timeout: number = 10000,
  ) {
    const timeoutValue = AppHelper.isCI() ? timeout * 2 : timeout;
    let requestedEl = '';
    switch (type) {
      case 'id':
        requestedEl = `//*[@resource-id="${id}"]`;
        break;
      case 'text':
        requestedEl = `//*[@text="${id}"]`;
        break;
    }
    await this.waitForElement('id', id);
    return $$(requestedEl)[index].waitForDisplayed({
      timeout: timeoutValue,
      interval: 1000,
    });
  }

  /**
   * Waits for an element to exist given default timeout
   * @param type test-id or text
   * @param id name of the test-id or text to wait for
   */
  async waitForElementExists(type: 'id' | 'text', id: string) {
    let requestedEl = '';
    switch (type) {
      case 'id':
        requestedEl = `//*[@resource-id="${id}"]`;
        break;
      case 'text':
        requestedEl = `//*[@text="${id}"]`;
        break;
    }
    return $(requestedEl).waitForExist({interval: 1000});
  }

  /**
   * Wait for pop-up alert
   */
  async waitForAlert() {
    await this.waitForElement('id', 'android:id/button1');
  }

  /**
   * Checks if an element exists given timeout sec
   * @param id the test-id
   * @param timeout sec
   * @return boolean
   */
  async isElementExisting(id: string, timeout: number) {
    const fullId = `//*[@resource-id="${id}"]`;
    // Checks every 1 sec
    for (let i = 0; i < timeout; i++) {
      await AppHelper.pause(1000);
      const exists = await $(fullId).isExisting();
      if (exists) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns an element based on a test-id
   * @param id the test-id
   */
  async getElement(id: string) {
    const reqId = `//*[@resource-id="${id}"]`;
    return $(reqId);
  }

  /**
   * Returns an element based on a text string
   * @param text the text string
   */
  async getElementText(text: string) {
    const reqText = `//*[@text="${text}"]`;
    return $(reqText);
  }

  /**
   * Checks if the provided text exists - either a string or one of the strings
   * in an array
   * @param text String or array of strings
   */
  async expectText(text: string | string[]) {
    if (Array.isArray(text)) {
      await expect(this.getElementFromTextArray(text)).toHaveTextContaining(
        text,
      );
    } else {
      await expect(this.getElementText(text)).toHaveTextContaining(text);
    }
  }

  /**
   * Returns element that contains one of the texts in the array
   * @param texts Array of text strings
   */
  async getElementFromTextArray(
    texts: string[],
  ): Promise<WebdriverIO.Element | undefined> {
    for (let i = 0; i < texts.length; i++) {
      const textEl = await this.getElementText(texts[i]);
      const exists = await textEl.isExisting();
      if (exists) {
        return textEl;
      }
    }
    return undefined;
  }
}

export default new ElementHelper();
