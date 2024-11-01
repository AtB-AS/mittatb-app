import AppHelper from '../../utils/app.helper.ts';
import OnboardingPage from '../../pageobjects/onboarding.page.ts';
import NavigationHelper from '../../utils/navigation.helper.ts';
import FrontPagePage from '../../pageobjects/frontpage.page.js';
import VisualHelper from '../../utils/visual.helper.js';

/**
 * Runs through the app and does some visual comparisons of the screen
 */
describe('Visual tests', () => {
  // Waiting time between actions in ms
  const waitingTime = 2000

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

  // NOTE! Run this as 'it.only' to save new baseline images. For test runs, this is 'xit'
  xit('should save baseline images', async () => {
    try {
      // frontpage
      await AppHelper.removeGlobalMessages();
      await AppHelper.pause(500);
      await FrontPagePage.removeAnnouncements();
      await AppHelper.pause(waitingTime);
      await VisualHelper.saveVisualTestScreen('frontpage', testOptions);
      // tickets
      await NavigationHelper.tapMenu('tickets');
      await NavigationHelper.tapMenu('tickets');
      await AppHelper.pause(waitingTime);
      await VisualHelper.saveVisualTestScreen('tickets', testOptions);
      await VisualHelper.saveVisualTestElement(
        'singleFareProduct',
        'singleTicketElem',
        testOptions,
      );
    } catch (errMsg) {
      await AppHelper.screenshot('error_save_baseline');
      throw errMsg;
    }
  });

  it('frontpage should be equal to baseline', async () => {
    try {
      await AppHelper.removeGlobalMessages();
      await AppHelper.pause(500);
      await FrontPagePage.removeAnnouncements();
      await AppHelper.pause(waitingTime);

      await VisualHelper.visualTestScreen('frontpage', testOptions);
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_frontpage');
      throw errMsg;
    }
  });

  it('ticket screen should be equal to baseline', async () => {
    try {
      await NavigationHelper.tapMenu('tickets');
      await NavigationHelper.tapMenu('tickets');
      await AppHelper.removeGlobalMessages();
      await AppHelper.pause(waitingTime);

      await VisualHelper.visualTestScreen('tickets', testOptions);
      await VisualHelper.visualTestElement(
        'singleFareProduct',
        'singleTicketElem',
        testOptions,
      );
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_tickets');
      throw errMsg;
    }
  });
});
