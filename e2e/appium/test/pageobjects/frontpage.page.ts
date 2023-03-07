import Page from './page';

class FrontPagePage extends Page {
  /**
   * define elements
   */
  get searchFrom() {
    const reqId = `//*[@resource-id="searchFromButton"]`;
    return $(reqId);
  }
  get searchTo() {
    const reqId = `//*[@resource-id="searchToButton"]`;
    return $(reqId);
  }

  /**
   * define or overwrite page methods
   */
  async open() {
    return super.open();
  }
}

export default new FrontPagePage();
