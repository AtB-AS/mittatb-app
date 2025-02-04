import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import FrontPagePage from '../pageobjects/frontpage.page.ts';
import SearchPage from '../pageobjects/search.page.ts';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page.ts';

/**
 * Travel search interactions. Used together with '$ flashlight measure/test' to get performance metrics
 */
describe('Travel search performance with flashlight', () => {
  // Waiting time between actions in ms
  const waitingTime = 5000;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('flashlight_travelsearch');
    await AppHelper.pause(2000);
  });

  /**
   * Travel search: do a simple travel search and show a travel
   */
  it('should do a travel search', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    try {
      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');

      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await AppHelper.pause(waitingTime);
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // ** Details **
      await TravelsearchOverviewPage.openFirstSearchResult();
      await AppHelper.pause(waitingTime);
    } catch (errMsg) {
      await AppHelper.screenshot('error_should_do_a_travel_search');
      throw errMsg;
    }
  });
});
