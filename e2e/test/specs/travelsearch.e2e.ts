import OnboardingPage from '../pageobjects/onboarding.page.ts';
import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import FrontPagePage from '../pageobjects/frontpage.page.ts';
import SearchPage from '../pageobjects/search.page.ts';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page.ts';
import TravelsearchDetailsPage from '../pageobjects/travelsearch.details.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';

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
      timeIsCorrect('28 min', 'Times is: 29 minutes');

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
      expect(startTime).toEqual(startTimeInDetails);
      const departureInDetails = await TravelsearchDetailsPage.getLocation(
        'start',
        0,
      );
      expect(departureInDetails).toContain(departure);

      // Check end time and arrival
      await AppHelper.scrollDownUntilId(`travelTime`);
      const endTimeInDetails = await TravelsearchDetailsPage.getTime(
        'end',
        noLegs - 1,
      );
      expect(endTime).toEqual(endTimeInDetails);
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

      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // Number of legs
      const noLegs = await TravelsearchOverviewPage.getNumberOfLegs(0);
      await TravelsearchOverviewPage.openFirstSearchResult();
      await AppHelper.scrollDownUntilId(`legContainer${noLegs - 1}`);
      await AppHelper.scrollDownUntilId(`travelTime`);
      const endLocation = await TravelsearchDetailsPage.getLocation(
        'end',
        noLegs - 1,
      );
      expect(endLocation).toContain(arrival);
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_travelsearch_should_have_correct_legs_in_the_details',
      );
      throw errMsg;
    }
  });
});
