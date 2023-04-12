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

  /**
   * Buy tickets
   */
  get buyTickets() {
    const reqId = `//*[@resource-id="buyTicketsButton"]`;
    return $(reqId);
  }

  /**
   * Add a favorite departure
   */
  get addFavoriteDeparture() {
    const reqId = `//*[@resource-id="addFavoriteDeparture"]`;
    return $(reqId);
  }

  /**
   * Service disruptions link in bottom sheet
   */
  get serviceDisruptionsButton() {
    const reqId = `//*[@resource-id="navigateToServiceDisruptions"]`;
    return $(reqId);
  }

  /**
   * Open service disruptions
   */
  get serviceDisruptionsInfo() {
    const reqId = `//*[@resource-id="lhb"]`;
    return $(reqId);
  }

  /**
   * Favorite departures
   */
  get favoriteDepartures() {
    const reqId = `//*[@resource-id="favoriteDepartures"]`;
    return $(reqId);
  }

  /**
   * Add a favorite departure
   */
  get selectFavoriteDeparture() {
    const reqId = `//*[@resource-id="selectFavoriteDepartures"]`;
    return $(reqId);
  }

  /**
   * Get stop place in favorite departures
   */
  get getFavoriteStopPlace() {
    const favId = `//*[@resource-id="favoriteDepartures"]`;
    const titleId = `//*[@resource-id="stopPlaceTitle"]`;
    return $(favId).$(titleId).getText();
  }

  /**
   * Get favorite departure's name
   * Note! Returns the first line (at index 0)
   */
  get favoriteDepartureLine() {
    const favId = `//*[@resource-id="favoriteDepartures"]`;
    const titleId = `//*[@resource-id="lineItem0Title"]`;
    return $(favId).$(titleId).getText();
  }

  /**
   * Get first favorite departure
   * Note! Returns the first departure (at index 0)
   */
  get favoriteDeparture() {
    const favId = `//*[@resource-id="favoriteDepartures"]`;
    const depId = `//*[@resource-id="depTime0"]`;
    return $(favId).$(depId);
  }

  /**
   * Return the info where no favorite exists
   */
  get noFavoriteInfo() {
    const noMsgId = `//*[@resource-id="noFavoriteWidget"]`;
    return $(noMsgId);
  }
}

export default new FrontPagePage();
