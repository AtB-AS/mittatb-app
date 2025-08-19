import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import ProfilePage from '../pageobjects/profile.page.ts';
import AlertHelper from '../utils/alert.helper.ts';
import PrivacyPage from '../pageobjects/privacy.page.ts';
import NotificationsPage from '../pageobjects/notifications.page.ts';

describe('Profile', () => {
  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('myProfile');
    await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('profile');
    await NavigationHelper.tapMenu('profile');
    await ElementHelper.waitForElement('text', 'Profile');
  });

  // Check the default options for notifications
  it('should have correct default notification options', async () => {
    const defaultSettings = {
      email: false,
      push: true,
      single: false,
      period: true,
      night: false,
      carnet: false,
      'on-behalf-of': true,
    };
    try {
      await ProfilePage.open('settings');
      await ProfilePage.open('notifications');
      await ElementHelper.waitForElement('text', 'Notifications');
      await ElementHelper.waitForElement('id', 'emailToggle');

      expect(await NotificationsPage.notificationIsEnabled('email')).toBe(
        defaultSettings.email,
      );
      expect(await NotificationsPage.notificationIsEnabled('push')).toBe(
        defaultSettings.push,
      );
      expect(await NotificationsPage.notificationIsEnabled('single')).toBe(
        defaultSettings.single,
      );
      expect(await NotificationsPage.notificationIsEnabled('period')).toBe(
        defaultSettings.period,
      );
      // Scroll
      await AppHelper.scrollDownUntilId(
        'notificationsView',
        'on-behalf-ofToggle',
      );
      expect(await NotificationsPage.notificationIsEnabled('night')).toBe(
        defaultSettings.night,
      );
      expect(await NotificationsPage.notificationIsEnabled('carnet')).toBe(
        defaultSettings.carnet,
      );
      expect(
        await NotificationsPage.notificationIsEnabled('on-behalf-of'),
      ).toBe(defaultSettings['on-behalf-of']);

      await NavigationHelper.back();
      await AppHelper.pause();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_myProfile_default_notification_options',
      );
      throw errMsg;
    }
  });

  // Verify that login is required and email is missing for email notifications
  it('should show login and missing email info for email notifications', async () => {
    try {
      await ProfilePage.open('settings');
      await ProfilePage.open('notifications');
      await ElementHelper.waitForElement('text', 'Notifications');
      await ElementHelper.waitForElement('id', 'emailToggle');

      // Pre
      expect(await NotificationsPage.notificationIsEnabled('email')).toBe(
        false,
      );
      await NotificationsPage.missingLoginAndEmailInfoExists(false);

      // On
      await NotificationsPage.toggleEmailNotifications();
      expect(await NotificationsPage.notificationIsEnabled('email')).toBe(true);
      await NotificationsPage.missingLoginAndEmailInfoExists(true);

      // Off
      await NotificationsPage.toggleEmailNotifications();
      expect(await NotificationsPage.notificationIsEnabled('email')).toBe(
        false,
      );
      await NotificationsPage.missingLoginAndEmailInfoExists(false);

      await NavigationHelper.back();
      await AppHelper.pause();
    } catch (errMsg) {
      await AppHelper.screenshot('error_myProfile_email_notification_info');
      throw errMsg;
    }
  });

  // Check that data collection is not enabled as default
  it('should collect data only when enabled', async () => {
    try {
      await ProfilePage.open('settings');
      await ProfilePage.open('privacy');
      await ElementHelper.waitForElement('text', 'Privacy');

      // Default
      await expect(await PrivacyPage.dataCollectionIsEnabled()).toBe(false);
      await expect(await ElementHelper.getElement('privacyButton')).toExist();
      await expect(
        await ElementHelper.getElement('controlPanelButton'),
      ).toExist();
      await expect(
        await ElementHelper.getElement('deleteLocalSearchDataButton'),
      ).toExist();
      await expect(
        await ElementHelper.getElement('deleteCollectedDataButton'),
      ).toExist();
      await expect(
        await ElementHelper.getElement('dataSharingInfoButton'),
      ).not.toExist();
      await PrivacyPage.permissionRequiredInfoExists(false);

      // Enable data collection
      await PrivacyPage.toggleDataCollection();

      // Permission prompts
      await expect(await AlertHelper.alertTitle).toContain('Bluetooth');
      await AlertHelper.alertConfirm.click();
      await OnboardingPage.denyLocationAndDontAskAgain();
      await AppHelper.pause();

      // Verify
      await expect(await PrivacyPage.dataCollectionIsEnabled()).toBe(true);
      await expect(
        await ElementHelper.getElement('dataSharingInfoButton'),
      ).toExist();
      await PrivacyPage.permissionRequiredInfoExists();

      // Disable data collection
      await PrivacyPage.toggleDataCollection();

      // Verify
      await expect(await PrivacyPage.dataCollectionIsEnabled()).toBe(false);
      await expect(
        await ElementHelper.getElement('dataSharingInfoButton'),
      ).not.toExist();
      await PrivacyPage.permissionRequiredInfoExists(false);

      await NavigationHelper.back();
      await AppHelper.pause();
    } catch (errMsg) {
      await AppHelper.screenshot('error_myProfile_privacy_data_collection');
      throw errMsg;
    }
  });
});
