import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';
import FrontPagePage from '../pageobjects/frontpage.page';
import SearchPage from '../pageobjects/search.page';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page';
import TravelsearchDetailsPage from '../pageobjects/travelsearch.details.page';
import NavigationHelper from '../utils/navigation.helper';

describe('Travel search', () => {
  before(async () => {
    await AppHelper.launchApp();
    await AppHelper.pause(10000, true);
    await OnboardingPage.skipOnboarding('travelsearch');
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

      // Onboarding (Check just in case)
      await TravelsearchOverviewPage.confirmOnboarding();

      const startTime: string = await TravelsearchOverviewPage.getStartTime(0);
      const endTime: string = await TravelsearchOverviewPage.getEndTime(0);
      const travelTime: number = await TravelsearchOverviewPage.getTravelTime(
        0,
      );
      const noLegs = await TravelsearchOverviewPage.getNumberOfLegs(0);
      //NB! Note the rounding gives wrong numbers here
      //TODO Sometimes +1, sometimes not
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
      expect(travelTimeInDep).toContain(travelTime.toString());

      await NavigationHelper.back();
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

      // Onboarding
      await TravelsearchOverviewPage.confirmOnboarding(5);

      // Number of legs
      await ElementHelper.waitForElement('id', `tripSearchSearchResult0`);
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
