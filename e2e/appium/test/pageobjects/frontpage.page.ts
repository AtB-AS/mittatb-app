import Page from './page';

class FrontPagePage extends Page {
  /**
   * Search from
   */
  get searchFrom() {
    const reqId = `//*[@resource-id="searchFromButton"]`;
    return $(reqId);
  }

  /**
   * Search to
   */
  get searchTo() {
    const reqId = `//*[@resource-id="searchToButton"]`;
    return $(reqId);
  }
}

export default new FrontPagePage();
