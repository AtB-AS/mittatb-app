import AppHelper from '../../utils/app.helper.ts';
import OnboardingPage from '../../pageobjects/onboarding.page.ts';
import NavigationHelper from '../../utils/navigation.helper.ts';
import FrontPagePage from '../../pageobjects/frontpage.page.js';
import VisualHelper from '../../utils/visual.helper.js';
import ElementHelper from '../../utils/element.helper.js';
import MyProfilePage from '../../pageobjects/myProfile.page.js';
import Config from '../../conf/config.js';

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

  it('frontpage should be equal to baseline', async () => {
    try {
      await AppHelper.removeGlobalMessages();
      await AppHelper.pause(500);
      await FrontPagePage.removeAnnouncements();
      await AppHelper.pause(1000);

      await VisualHelper.visualTestScreen(
        'frontpage',
        testOptions,
        newBaseline,
      );
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_frontpage');
      throw errMsg;
    }
  });

  it('profile should be equal to baseline', async () => {
    try {
      await NavigationHelper.tapMenu('profile');
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'Profile');

      // Notifications
      await MyProfilePage.openSetting('settings');
      await MyProfilePage.openSetting('notifications');
      await ElementHelper.waitForElement('text', 'Notifications');
      await ElementHelper.waitForElement('id', 'emailToggle');
      await VisualHelper.visualTestScreen(
        'profile_notifications',
        testOptions,
        newBaseline,
      );

      // Standard travellers
      await NavigationHelper.back();
      await MyProfilePage.openSetting('defaultTraveller');
      await ElementHelper.waitForElement('text', 'Default traveller');
      await VisualHelper.visualTestScreen(
        'profile_defaultTraveller',
        testOptions,
        newBaseline,
      );
    } catch (errMsg) {
      await AppHelper.screenshot('error_visual_test_my_profile');
      throw errMsg;
    }
  });
});
