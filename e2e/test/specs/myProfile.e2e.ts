import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import MyProfilePage from '../pageobjects/myProfile.page.ts';
import AlertHelper from '../utils/alert.helper.ts';
import PrivacyPage from '../pageobjects/privacy.page.ts';

describe('My profile', () => {
  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('myProfile');
    await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('profile');
    await NavigationHelper.tapMenu('profile');
    await ElementHelper.waitForElement('text', 'My profile');
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
      await MyProfilePage.openSetting('notifications');
      await ElementHelper.waitForElement('text', 'Notifications');
      await ElementHelper.waitForElement('id', 'emailToggle');

      expect(await MyProfilePage.notificationIsEnabled('email')).toBe(
        defaultSettings.email,
      );
      expect(await MyProfilePage.notificationIsEnabled('push')).toBe(
        defaultSettings.push,
      );
      expect(await MyProfilePage.notificationIsEnabled('single')).toBe(
        defaultSettings.single,
      );
      expect(await MyProfilePage.notificationIsEnabled('period')).toBe(
        defaultSettings.period,
      );
      // Scroll
      await AppHelper.scrollDownUntilId(
        'notificationsView',
        'on-behalf-ofToggle',
      );
      expect(await MyProfilePage.notificationIsEnabled('night')).toBe(
        defaultSettings.night,
      );
      expect(await MyProfilePage.notificationIsEnabled('carnet')).toBe(
        defaultSettings.carnet,
      );
      expect(await MyProfilePage.notificationIsEnabled('on-behalf-of')).toBe(
        defaultSettings['on-behalf-of'],
      );

      await NavigationHelper.back();
      await AppHelper.pause();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_myProfile_default_notification_options',
      );
      throw errMsg;
    }
  });

  // Check that data collection is not enabled as default
  it('should collect data only when enabled', async () => {
    try {
      await MyProfilePage.openSetting('privacy');
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
