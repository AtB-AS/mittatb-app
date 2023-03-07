import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';
import FrontPagePage from '../pageobjects/frontpage.page';
import SearchPage from '../pageobjects/search.page';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page';

describe('Travel search', () => {
  beforeEach(async () => {
    await AppHelper.launchApp();
    await OnboardingPage.skipOnboarding();
  });

  it('should do a travel search', async () => {
    const departure = 'Udduvoll bru vest';
    const arrival = 'Anders Buens gate';

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);

      // Onboarding
      await TravelsearchOverviewPage.confirmOnboarding();
      await AppHelper.screenshot('travelsearch_overview');

      // Test results
      await TravelsearchOverviewPage.openFirstSearchResult();
      await AppHelper.screenshot('travelsearch_details');

      // Scroll down
      await ElementHelper.waitForElementExists('id', 'tripDetailsContentView');
      await AppHelper.scrollDownUntilId('walkDistance');
      await AppHelper.screenshot('travelsearch_scrolled');

      // Back
      await AppHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_travelsearch_should_do_a_travel_search',
      );
      throw errMsg;
    }
  });
});
