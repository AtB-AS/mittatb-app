import AppHelper from '../../utils/app.helper.ts';
import OnboardingPage from '../../pageobjects/onboarding.page.ts';
import NavigationHelper from '../../utils/navigation.helper.ts';
import FrontPagePage from '../../pageobjects/frontpage.page.js';
import VisualHelper from '../../utils/visual.helper.js';
import ElementHelper from '../../utils/element.helper.js';
import SearchPage from '../../pageobjects/search.page.js';
import TravelsearchOverviewPage from '../../pageobjects/travelsearch.overview.page.js';
import TravelsearchFilterPage from '../../pageobjects/travelsearch.filter.page.js';
import Config from '../../conf/config.js';
import TimePickerPage from '../../pageobjects/time.picker.page.js';

/**
 * Runs through the app and does some visual comparisons of the screen
 */
describe('Visual tests', () => {
  // Generate new baseline images (true) or test (false)
  const newBaseline = Config.recordBaseline();

  // Set test options
  const testOptions = {
    baselineFolder: `${process.env.PWD}/screenshots/visualTests/baseline`,
    actualFolder: `${process.env.PWD}/screenshots/visualTests/actual`,
    diffFolder: `${process.env.PWD}/screenshots/visualTests/diff`,
    returnAllCompareData: true,
  };

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('visual');
    await AppHelper.pause(500);
  });

  // NOTE! Without changing the time, there are few "stable" views
  it('travel search should be equal to baseline', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Solsiden';

    try {
      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');

      // Search
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Check filter
      await TravelsearchFilterPage.openFilter();
      // Test: Filter (top)
      await VisualHelper.visualTestElement(
        'filterView',
        'travelSearch_filter',
        testOptions,
        newBaseline,
      );
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_travelSearch');
      throw errMsg;
    }
  });

  // NOTE!
  // Disabled due to not reachable date picker (https://github.com/henninghall/react-native-date-picker/issues/792)
  // Will enable if updated in later react-native-date-picker
  xit('DISABLED - travel search should be equal to baseline', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Solsiden';
    const depTimeHr = 0;
    const depTimeMin = 0;
    const searchDate = Config.travelSearchDate();

    try {
      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');

      // Search
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Set departure time
      await TravelsearchFilterPage.openTravelSearchTimePicker();
      await TravelsearchFilterPage.chooseSearchBasedOn('Departure');
      await TimePickerPage.openNativeDatePicker();
      await AppHelper.setTimePickerDate(searchDate);
      await TimePickerPage.openNativeTimePicker();
      await AppHelper.setTimePickerTime(depTimeHr, depTimeMin);
      await TimePickerPage.searchButton.click();
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Test: travel search results
      await VisualHelper.visualTestScreen(
        'travelSearch_results',
        testOptions,
        newBaseline,
      );

      // Open details
      await TravelsearchOverviewPage.openSearchResult();

      // Test: travel search details
      await VisualHelper.visualTestScreen(
        'travelSearch_details',
        testOptions,
        newBaseline,
      );
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_travelSearch');
      throw errMsg;
    }
  });
});
