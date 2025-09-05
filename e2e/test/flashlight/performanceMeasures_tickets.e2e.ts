import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketPage from '../pageobjects/ticket.buy.page.js';
import AuthenticationPage from '../pageobjects/authentication.page.js';
import MyProfilePage from '../pageobjects/profile.page.js';
import {formatPhoneNumber} from '../utils/utils.js';
import Config from '../conf/config.js';
import ProfilePage from '../pageobjects/profile.page.js';

/**
 * Travel search interactions. Used together with '$ flashlight measure/test' to get performance metrics
 */
describe('Travel search performance with flashlight', () => {
  // Waiting time between actions in ms
  const waitingTime = 5000;
  let authorized = false;
  const phoneNumber = Config.phoneNumber();

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
  });

  it('should login', async () => {
    try {
      // Log in through the onboarding
      await AuthenticationPage.loginWithPhone(phoneNumber);
      await OnboardingPage.denyLocationInOnboarding();
      await OnboardingPage.waitOnTokenOnboarding(false);
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

  /**
   * Tickets: open active tickets including expired tickets
   */
  it('should show tickets', async () => {
    if (authorized) {
      try {
        await NavigationHelper.tapMenu('tickets');
        await NavigationHelper.tapTicketTab('activeTickets');
        await AppHelper.pause(waitingTime);

        // Open expired tickets
        await TicketPage.openExpiredTickets();
        for (let i = 0; i < 3; i++) {
          await AppHelper.scrollDown('ticketHistoryScrollView');
        }
        await AppHelper.pause(waitingTime);

        await NavigationHelper.back();
      } catch (errMsg) {
        await AppHelper.screenshot('error_should_show_tickets');
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
