import ElementHelper from '../utils/element.helper';

class MapPage {
  /**
   * Confirm the map onboarding - if it exists
   * @param timeoutValue: How long to search for the onboarding confirmation button
   */
  async confirmOnboarding(timeoutValue: number = 10) {
    const id = `//*[@resource-id="mapScootersOnboardingConfirmButton"]`;
    // Check for n sec
    const exists = await ElementHelper.isElementExisting(
      'mapScootersOnboardingConfirmButton',
      timeoutValue,
    );
    if (exists) {
      await $(id).click();
    }
  }
}
export default new MapPage();
