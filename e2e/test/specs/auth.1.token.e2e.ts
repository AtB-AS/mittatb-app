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

describe('Auth Mobile Token', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;
  let hasMobileTokenOnThisDevice = false;
  let hasMobileTokenOnOtherDevice = false;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
  });

  it('should login', async () => {
    try {
      // Log in through the onboarding
      await AuthenticationPage.loginWithPhone(phoneNumber);
      await OnboardingPage.denyLocationInOnboarding();
      await OnboardingPage.waitOnTokenOnboarding(false)
      await ElementHelper.waitForElement('text', 'Travel search');
      await AppHelper.pause(2000);

      // Verify
      await NavigationHelper.tapMenu('profile');
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

  /*
    Check the mobile token toggle in Profile
   */
  it('should have mobile token', async () => {
    try {
      await NavigationHelper.tapMenu('profile');
      await ProfilePage.open('settings');
      if (authorized) {
        await ProfilePage.open('travelToken');
        await ElementHelper.waitForElement('id', 'travelTokenBox');

        // Check if mobile token is OK
        hasMobileTokenOnThisDevice = await TokenPage.deviceNameExists('this')
        hasMobileTokenOnOtherDevice = await TokenPage.deviceNameExists('other')

        if (hasMobileTokenOnThisDevice || hasMobileTokenOnOtherDevice) {
          expect(await TokenPage.tokenToggleInfo).toContain('switches left');
          await TokenPage.openTokenToggle();

          // Verify
          expect(await TokenPage.tokenSelection('Travelcard')).toExist();
          expect(await TokenPage.tokenSelection('Mobile')).toExist();
          expect(await TokenPage.tokenSelectionRadio('Mobile')).toBeChecked();
          // Select travel card
          await TokenPage.selectToken('Travelcard');
          expect(await TokenPage.tokenSelectionRadio('Mobile')).not.toBeChecked();
          expect(await TokenPage.noTravelcardWarning).toContain(
              'no t:card registered',
          );
          // Select mobile
          await TokenPage.selectToken('Mobile');
          // Due to a current error, the change from travecard to mobile also changes the marked token
          //await TokenPage.confirmSelection();
          await NavigationHelper.back()
          await ElementHelper.waitForElement('id', 'travelTokenBox');
        } else {
          const errorMessage: string = await TokenPage.tokenErrorMessage;
          expect(errorMessage.toLowerCase()).toContain('unable');
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_mobToken');
      throw errMsg;
    }
  });

  /*
    Check mobile token details in debug
   */
  it('should have mobile token debug info', async () => {
    try {
      // Open mobile token section in the debug menu
      await NavigationHelper.tapMenu('profile');
      await AppHelper.scrollDownUntilId('profileHomeScrollView', 'debugButton');
      await ProfilePage.open('debug');
      await AppHelper.scrollDownUntilId(
        'debugInfoScrollView',
        'mobileTokenDebug',
      );
      await DebugPage.open('mobileToken');
      await AppHelper.scrollDown('debugInfoScrollView');

      if (hasMobileTokenOnThisDevice) {
        expect(await DebugPage.hasMobileTokenId).toBe(true);
        expect(await DebugPage.getMobileTokenStatus()).toBe(
          'success-and-inspectable',
        );
      }
      else if (hasMobileTokenOnOtherDevice) {
        expect(await DebugPage.hasMobileTokenId).toBe(true);
        expect(await DebugPage.getMobileTokenStatus()).toBe(
            'success-not-inspectable',
        );
      } else {
        expect(await DebugPage.hasMobileTokenId).toBe(false);
        expect(await DebugPage.getMobileTokenStatus()).toBe('fallback');
      }
      await NavigationHelper.tapMenu('profile');
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_mobToken_debug');
      throw errMsg;
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
