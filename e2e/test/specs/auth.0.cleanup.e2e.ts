import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketActivePage from '../pageobjects/ticket.active.page.js';
import TicketDetailsPage from '../pageobjects/ticket.details.page.js';
import MyProfilePage from '../pageobjects/profile.page.js';
import AuthenticationPage from '../pageobjects/authentication.page.js';
import {formatPhoneNumber} from '../utils/utils.js';
import ProfilePage from '../pageobjects/profile.page.js';
import TokenPage from '../pageobjects/token.page.js';
import DebugPage from '../pageobjects/debug.page.js';
import Config from '../conf/config.js';
import {performancetotal} from 'wdio-performancetotal-service';
import {$} from "@wdio/globals";
import AlertHelper from "../utils/alert.helper.js";

describe('Auth Cleanup', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
  });

  it('should login', async () => {
    try {
      /*
      // Log in through my profile
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'Profile');
      await MyProfilePage.login.click();
      await AuthenticationPage.loginWithPhone(phoneNumber)
      await ElementHelper.waitForElement('text', 'Travel search');
      await AppHelper.pause(2000);
       */

      // Log in through the onboarding
      await AuthenticationPage.loginWithPhone(phoneNumber);
      await OnboardingPage.denyLocationInOnboarding();
      await OnboardingPage.waitOnTokenOnboarding(false)
      await ElementHelper.waitForElement('text', 'Travel search');
      await AppHelper.pause(2000);

      // Verify
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'Profile');
      expect(await MyProfilePage.loggedInWithInfo).toContain(
        formatPhoneNumber(phoneNumber),
      );
      authorized = true;
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_login');
      throw errMsg;
    }
  });

  it('should cleanup remote tokens', async () => {
    if (authorized) {
      try {
        // Open mobile token section in the debug menu
        await NavigationHelper.tapMenu('profile');
        await AppHelper.scrollDownUntilId('profileHomeScrollView', 'debugButton');
        await ProfilePage.open('debug');
        await DebugPage.scrollToMobileToken()
        await DebugPage.open('mobileToken');

        // Remove all remote tokens
        await DebugPage.showRemoteTokens()
        await DebugPage.removeAllRemoteTokens()

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
        await ProfilePage.logout()

      } catch (errMsg) {
        await AppHelper.screenshot('error_auth_logout');
        throw errMsg;
      }
    }
  })
});
