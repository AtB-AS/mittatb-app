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
}

export default new ElementHelper();
