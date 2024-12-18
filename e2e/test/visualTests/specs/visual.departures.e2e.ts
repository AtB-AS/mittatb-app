import AppHelper from '../../utils/app.helper.ts';
import OnboardingPage from '../../pageobjects/onboarding.page.ts';
import NavigationHelper from '../../utils/navigation.helper.ts';
import VisualHelper from '../../utils/visual.helper.js';
import ElementHelper from '../../utils/element.helper.js';
import SearchPage from '../../pageobjects/search.page.js';
import Config from '../../conf/config.js';
import DepartureSearchPage from '../../pageobjects/departure.search.page.js';
import DepartureOverviewPage from '../../pageobjects/departure.overview.page.js';
import TimePickerPage from '../../pageobjects/time.picker.page.js';
import MyProfilePage from '../../pageobjects/myProfile.page.js';
import AccessibilityPage from '../../pageobjects/accessibility.page.js';
import DepartureDetailsPage from '../../pageobjects/departure.details.page.js';
import JourneyAidPage from '../../pageobjects/journey.aid.page.js';

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

  it('departures should be equal to baseline', async () => {
    const stopPlace = 'Prinsens gate';
    const depTimeHr = 0;
    const depTimeMin = 0;
    const searchDate = Config.departureDate();

    try {
      await NavigationHelper.tapMenu('departures');
      await NavigationHelper.tapMenu('departures');
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await DepartureSearchPage.searchFrom.click();
      await SearchPage.setSearchLocation(stopPlace);

      // Stop place
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.expectText(stopPlace);

      // Set departure time
      await DepartureSearchPage.openDateTimePicker();
      await TimePickerPage.openNativeDatePicker();
      await AppHelper.setTimePickerDate(searchDate);
      await TimePickerPage.openNativeTimePicker();
      await AppHelper.setTimePickerTime(depTimeHr, depTimeMin);
      await TimePickerPage.searchButton.click();
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.waitForElementNotExists('isLoading');

      // Test: departures
      await VisualHelper.visualTestScreen(
        'departures',
        testOptions,
        newBaseline,
      );
      await VisualHelper.visualTestElement(
        'quaySection0',
        'departures_departuresItem0',
        testOptions,
        newBaseline,
      );
      await VisualHelper.visualTestElement(
        'quaySection1',
        'departures_departuresItem1',
        testOptions,
        newBaseline,
      );

      // Departure details
      await DepartureOverviewPage.openDeparture();
      await ElementHelper.waitForElement('id', 'departureDetailsContentView');
      await AppHelper.pause();

      // Test: departure details
      await VisualHelper.visualTestScreen(
        'departures_departureDetails',
        testOptions,
        newBaseline,
      );
      await VisualHelper.visualTestElement(
        'departureDetailsContentView',
        'departures_departureDetailsContent',
        testOptions,
        newBaseline,
      );

      // Enable journey aid
      await NavigationHelper.tapMenu('profile');
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'My profile');
      await MyProfilePage.openSetting('travelAid');
      await ElementHelper.waitForElement('text', 'Journey Aid');
      await AccessibilityPage.toggleJourneyAid();
      await NavigationHelper.tapMenu('departures');
      await ElementHelper.waitForElement('id', 'departureDetailsContentView');
      await DepartureDetailsPage.openJourneyAid();
      await VisualHelper.visualTestScreen(
        'departures_journeyAid',
        testOptions,
        newBaseline,
      );
      await VisualHelper.visualTestElement(
        'journeyAidSection',
        'departures_journeyAidSection',
        testOptions,
        newBaseline,
      );
      await JourneyAidPage.closeJourneyAid();
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_departures');
      throw errMsg;
    }
  });
});
