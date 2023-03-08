class ElementHelper {
  async waitForElement(type: 'id' | 'text', id: string) {
    let requestedEl = '';
    switch (type) {
      case 'id':
        requestedEl = `//*[@resource-id="${id}"]`;
        break;
      case 'text':
        requestedEl = `//*[@text="${id}"]`;
        break;
    }
    return $(requestedEl).waitForDisplayed({interval: 1000});
  }
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
  async getElement(id: string) {
    const reqId = `//*[@resource-id="${id}"]`;
    return $(reqId);
  }
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
