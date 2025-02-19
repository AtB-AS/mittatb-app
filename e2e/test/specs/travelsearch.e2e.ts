import OnboardingPage from '../pageobjects/onboarding.page.ts';
import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import FrontPagePage from '../pageobjects/frontpage.page.ts';
import SearchPage from '../pageobjects/search.page.ts';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page.ts';
import TravelsearchDetailsPage from '../pageobjects/travelsearch.details.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import TravelsearchFilterPage from '../pageobjects/travelsearch.filter.page.js';
import TimeHelper from '../utils/time.helper.js';
import {stringToNumArray} from '../utils/utils.js';
import TimePickerPage from '../pageobjects/time.picker.page.js';

describe('Travel search', () => {
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
   * Compare departure and arrival times from overview to details
   */
  it('should do a travel search and have correct travel times in the details', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';
    /*
    Candidates for a special route
    const departure = 'Udduvoll bru vest';
    const arrival = 'Anders Buens gate';
     */

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);

      await TravelsearchOverviewPage.waitForTravelSearchResults();

      const startTime: string = await TravelsearchOverviewPage.getStartTime(0);
      const endTime: string = await TravelsearchOverviewPage.getEndTime(0);
      const travelTime: string = await TravelsearchOverviewPage.getTravelTime(
        0,
      );
      const noLegs = await TravelsearchOverviewPage.getNumberOfLegs(0);
      //NB! Note the rounding gives wrong numbers here (https://github.com/AtB-AS/kundevendt/issues/74)
      //expect(TimeHelper.getTimeDurationInMin(startTime, endTime)).toEqual(travelTime + 1)

      // ** Details **
      await TravelsearchOverviewPage.openFirstSearchResult();

      // Check start time and departure
      const startTimeInDetails = await TravelsearchDetailsPage.getTime(
        'start',
        0,
      );
      expect(
        TimeHelper.timeIsEqualWithMargin(startTime, startTimeInDetails),
      ).toBe(true);
      const departureInDetails = await TravelsearchDetailsPage.getLocation(
        'start',
        0,
      );
      expect(departureInDetails).toContain(departure);

      // Check end time and arrival
      await AppHelper.scrollDownUntilId('tripDetailsContentView', 'travelTime');
      const endTimeInDetails = await TravelsearchDetailsPage.getTime(
        'end',
        noLegs - 1,
      );
      expect(TimeHelper.timeIsEqualWithMargin(endTime, endTimeInDetails)).toBe(
        true,
      );
      const arrivalInDetails = await TravelsearchDetailsPage.getLocation(
        'end',
        noLegs - 1,
      );
      expect(arrivalInDetails).toContain(arrival);

      // Check travel time
      const travelTimeInDep =
        await TravelsearchDetailsPage.travelTime.getText();
      expect(timeIsCorrect(travelTimeInDep, travelTime)).toEqual(true);

      await NavigationHelper.back();

      /**
       * Check if two times are equal within an allowed margin
       * Note! Simple check for this search where travel time is in minutes
       * @param time1 String that contains some digits to compare
       * @param time2 String that contains some digits to compare
       * @param allowedDiff Allow a time difference
       */
      function timeIsCorrect(
        time1: string,
        time2: string,
        allowedDiff: number = 1,
      ) {
        const sec1: number = parseInt(/(\d+)/i.exec(time1)[0]);
        const sec2: number = parseInt(/(\d+)/i.exec(time2)[0]);

        return Math.abs(sec1 - sec2) <= allowedDiff;
      }
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_travelsearch_should_be_correct_travel_times_in_the_details',
      );
      throw errMsg;
    }
  });

  /**
   * Compare number of legs from overview to details
   */
  it('should have correct legs in the details', async () => {
    const departure = 'Snåsa skole';
    const arrival = 'Fillan kai';

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);

      // Only check if there are travel search results (the given src/dst has few departures)
      if (await TravelsearchOverviewPage.hasTravelSearchResults()) {
        // Number of legs
        const noLegs = await TravelsearchOverviewPage.getNumberOfLegs(0);
        await TravelsearchOverviewPage.openFirstSearchResult();
        await AppHelper.scrollDownUntilId(
          'tripDetailsContentView',
          `legContainer${noLegs - 1}`,
        );
        await AppHelper.scrollDownUntilId(
          'tripDetailsContentView',
          'travelTime',
        );
        const endLocation = await TravelsearchDetailsPage.getLocation(
          'end',
          noLegs - 1,
        );
        expect(endLocation).toContain(arrival);

        await NavigationHelper.back();
      }
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_travelsearch_should_have_correct_legs_in_the_details',
      );
      throw errMsg;
    }
  });

  /**
   * Changing departure time should give correct travel search results
   * NOTE!
   * Disabled due to not reachable time picker (https://github.com/henninghall/react-native-date-picker/issues/792)
   * Will enable if updated in later react-native-date-picker
   */
  xit('should search based on time', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';
    const depTimeHr = 21;
    const depTimeMin = 0;

    try {
      // Search and get start times of 3 first trip results
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);

      await TravelsearchOverviewPage.waitForTravelSearchResults();
      const initStartTime_1: string =
        await TravelsearchOverviewPage.getStartTime(0);
      const initStartTime_2: string =
        await TravelsearchOverviewPage.getStartTime(1);
      const initStartTime_3: string =
        await TravelsearchOverviewPage.getStartTime(2);

      // Set new departure time
      await TravelsearchFilterPage.openTravelSearchTimePicker();
      await TravelsearchFilterPage.chooseSearchBasedOn('Departure');
      await TimePickerPage.openNativeTimePicker();
      await AppHelper.setTimePickerTime(depTimeHr, depTimeMin);
      await TimePickerPage.searchButton.click();

      await TravelsearchOverviewPage.waitForTravelSearchResults();

      const endStartTime_1: string =
        await TravelsearchOverviewPage.getStartTime(0);
      const endStartTime_2: string =
        await TravelsearchOverviewPage.getStartTime(1);
      const endStartTime_3: string =
        await TravelsearchOverviewPage.getStartTime(2);

      // Departure times are changed
      await expect(initStartTime_1).not.toEqual(endStartTime_1);
      await expect(initStartTime_2).not.toEqual(endStartTime_2);
      await expect(initStartTime_3).not.toEqual(endStartTime_3);

      // Departure times are after search time
      expect(
        TimeHelper.gtTime(
          depTimeHr,
          depTimeMin,
          stringToNumArray(endStartTime_1)[0],
          stringToNumArray(endStartTime_1)[1],
        ),
      ).toBe(true);
      expect(
        TimeHelper.gtTime(
          depTimeHr,
          depTimeMin,
          stringToNumArray(endStartTime_2)[0],
          stringToNumArray(endStartTime_2)[1],
        ),
      ).toBe(true);
      expect(
        TimeHelper.gtTime(
          depTimeHr,
          depTimeMin,
          stringToNumArray(endStartTime_3)[0],
          stringToNumArray(endStartTime_3)[1],
        ),
      ).toBe(true);
    } catch (errMsg) {
      await AppHelper.screenshot('error_travelsearch_departure_time');
      throw errMsg;
    }
  });

  /**
   * Walking and bike travels are shown separately depending on the travel search
   */
  it('should show walk and bike options', async () => {
    const longDeparture = 'Prinsens gate';
    const longArrival = 'Melhus skysstasjon';
    const shortDeparture = 'Prinsens gate';
    const shortArrival = 'Solsiden';

    try {
      // Search "long": only bike
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(longDeparture);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(longArrival);

      await TravelsearchOverviewPage.waitForTravelSearchResults();

      await expect(TravelsearchOverviewPage.bikeResult).toExist();
      // "Bike 1 h 30 min"
      await expect(
        TimeHelper.isAcceptableMinVariation(
          await TravelsearchOverviewPage.bikeResultText,
          30,
          2,
        ),
      ).toBe(true);
      await expect(TravelsearchOverviewPage.walkResult).not.toExist();

      // Details
      await TravelsearchOverviewPage.bikeResult.click();
      await expect(await TravelsearchDetailsPage.hasSingleLeg('bike')).toBe(
        true,
      );

      // Reset
      await NavigationHelper.back();
      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');

      // Search "short": walk + bike
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(shortDeparture);
      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(shortArrival);

      await TravelsearchOverviewPage.waitForTravelSearchResults();

      await expect(TravelsearchOverviewPage.bikeResult).toExist();
      await expect(TravelsearchOverviewPage.walkResult).toExist();
      // "Walk 19 min"
      await expect(
        TimeHelper.isAcceptableMinVariation(
          await TravelsearchOverviewPage.walkResultText,
          19,
          2,
        ),
      ).toBe(true);

      // Details
      await TravelsearchOverviewPage.walkResult.click();
      await expect(await TravelsearchDetailsPage.hasSingleLeg('foot')).toBe(
        true,
      );

      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot('error_travelsearch_walk_bike_travels');
      throw errMsg;
    }
  });
});
