import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import ProfilePage from '../pageobjects/profile.page.js';
import DebugPage from '../pageobjects/debug.page.js';

describe('Auth Cleanup', () => {
  let authorized = false;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    // Login
    authorized = await OnboardingPage.loginThroughOnboarding();
  });

  it('should cleanup remote tokens', async () => {
    if (authorized) {
      try {
        // Open mobile token section in the debug menu
        await NavigationHelper.tapMenu('profile');
        await AppHelper.scrollDownUntilId(
          'profileHomeScrollView',
          'debugButton',
        );
        await ProfilePage.open('debug');
        await DebugPage.scrollToMobileToken();
        await DebugPage.open('mobileToken');

        // Remove all remote tokens
        await DebugPage.showRemoteTokens();
        await DebugPage.removeAllRemoteTokens();

        await NavigationHelper.tapMenu('profile');
      } catch (errMsg) {
        await AppHelper.screenshot('error_auth_remove_mobToken');
        throw errMsg;
      }
    }
  });

  it('should log out', async () => {
    if (authorized) {
      try {
        await NavigationHelper.tapMenu('profile');
        await ElementHelper.waitForElement('text', 'Profile');
        await ProfilePage.logout();
      } catch (errMsg) {
        await AppHelper.screenshot('error_auth_logout');
        throw errMsg;
      }
    }
  });
});
