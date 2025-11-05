import OnboardingPage from '../pageobjects/onboarding.page.ts';
import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import FrontPagePage from '../pageobjects/frontpage.page.ts';
import SearchPage from '../pageobjects/search.page.ts';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import TravelsearchFilterPage from '../pageobjects/travelsearch.filter.page.js';
import {performancetotal} from 'wdio-performancetotal-service';

describe('Travel search filter', () => {
  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('travelsearch');
    await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('assistant');
    await NavigationHelper.tapMenu('assistant');
  });

  /**
   * Filter which travel mode to use
   * Note! One danger is if the search is unlucky and only get bus options in the initial search
   */
  it('should filter transport modes correctly', async () => {
    const departure = 'Cecilienborg';
    const arrival = 'Melhus skysstasjon';
    const numResultsToCheck = 8;

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      performancetotal.sampleStart('travelSearch');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);

      await TravelsearchOverviewPage.waitForTravelSearchResults();
      performancetotal.sampleEnd('travelSearch');

      // Check number of transport modes
      const numberOfModesInitial =
        await TravelsearchOverviewPage.getNumberOfTransportModesInSearch(
          numResultsToCheck,
        );

      // Filter out buses
      await AppHelper.scrollUpUntilId('tripSearchContentView', 'filterButton');
      await TravelsearchFilterPage.openFilter();
      // Not considering the 'all' option
      const filtersAvailable =
        (await TravelsearchFilterPage.numberOfFilters) - 1;
      await TravelsearchFilterPage.toggleTransportModeFilter('bus');
      const filtersInUse = filtersAvailable - 1;
      await TravelsearchFilterPage.confirmFilter();
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Verify
      const numberOfModesWithFilter =
        await TravelsearchOverviewPage.getNumberOfTransportModesInSearch(
          numResultsToCheck,
        );
      expect(numberOfModesWithFilter).toBeLessThan(numberOfModesInitial);
      await AppHelper.scrollUpUntilId(
        'tripSearchContentView',
        'selectedFilterButton',
      );
      await TravelsearchFilterPage.shouldShowSelectedFilter(
        `${filtersInUse} of ${filtersAvailable}`,
      );

      // Remove the selected filters
      await TravelsearchFilterPage.removeSelectedFilter();
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Verify
      const numberOfModes =
        await TravelsearchOverviewPage.getNumberOfTransportModesInSearch(
          numResultsToCheck,
        );
      expect(numberOfModes).toEqual(numberOfModesInitial);
      await AppHelper.scrollUpUntilId('tripSearchContentView', 'filterButton');
      await expect(TravelsearchFilterPage.selectedFilterButton).not.toExist();
    } catch (errMsg) {
      await AppHelper.screenshot('error_travelsearch_filter_transport_modes');
      throw errMsg;
    }
  });

  /**
   * Changing the filter choice 'walkSpeed' should be saved for new searches
   */
  it('should save filter choices', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      performancetotal.sampleStart('travelSearch');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await TravelsearchOverviewPage.waitForTravelSearchResults();
      performancetotal.sampleEnd('travelSearch');

      // Filter out buses
      await TravelsearchFilterPage.openFilter();
      await TravelsearchFilterPage.setWalkSpeed('slow');
      await TravelsearchFilterPage.confirmFilter();
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');
      await ElementHelper.expectText('Find journey');

      // New search
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Walk speed is still changed
      await TravelsearchFilterPage.openFilter();
      await TravelsearchFilterPage.walkSpeedIsEnabled('slow');
      await TravelsearchFilterPage.confirmFilter();
    } catch (errMsg) {
      await AppHelper.screenshot('error_travelsearch_save_filter');
      throw errMsg;
    }
  });

  /**
   * Changing the filter choice 'transport mode' should NOT be saved for new searches
   */
  it('should not save filter choices', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      performancetotal.sampleStart('travelSearch');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await TravelsearchOverviewPage.waitForTravelSearchResults();
      performancetotal.sampleEnd('travelSearch');

      // Fallback if filters are enabled from last test
      await TravelsearchFilterPage.removeSelectedFilterIfExists();

      // Filter out buses
      await TravelsearchFilterPage.openFilter();
      await TravelsearchFilterPage.toggleTransportModeFilter('bus');
      await TravelsearchFilterPage.confirmFilter();
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Filters are enabled
      expect(
        await TravelsearchFilterPage.selectedFilterButton.isExisting(),
      ).toBe(true);

      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');
      await ElementHelper.expectText('Find journey');

      // New search
      await ElementHelper.waitForElement('id', 'searchFromButton');
      performancetotal.sampleStart('travelSearch');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await TravelsearchOverviewPage.waitForTravelSearchResults();
      performancetotal.sampleEnd('travelSearch');

      // Filters are NOT enabled
      expect(
        await TravelsearchFilterPage.selectedFilterButton.isExisting(),
      ).toBe(false);
    } catch (errMsg) {
      await AppHelper.screenshot('error_travelsearch_not_save_filter');
      throw errMsg;
    }
  });
});
