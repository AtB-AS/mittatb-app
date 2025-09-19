import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.js';
import MapPage from '../pageobjects/map.page.js';

/**
 * Map interactions. Used together with '$ flashlight measure/test' to get performance metrics
 */
describe('Map performance with flashlight', () => {
  // Waiting time between actions in ms
  const waitingTime = 1000;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('flashlight_map');
    await AppHelper.pause(2000);
  });

  /**
    Interactions to stress the map for map performance
   */
  it('should interact with the map', async () => {
    try {
      const mapId: string = 'mapView';
      await NavigationHelper.tapMenu('map');
      await NavigationHelper.tapMenu('map');
      await AppHelper.pause(waitingTime);
      await ElementHelper.waitForElement('id', mapId);

      // Zoom
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('large');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('large');
      await MapPage.drag('right', 'short');

      // Move around
      await MapPage.drag('up', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('right', 'short');
      await MapPage.drag('left', 'short');
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'short');

      // Filter and move around
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.toggle('car');
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.toggle('bicycle');
      await MapPage.drag('right', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomIn('small');
      await MapPage.drag('right', 'long');
      await MapPage.drag('left', 'long');
      await MapPage.toggle('scooter');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('large');
    } catch (errMsg) {
      await AppHelper.screenshot('error_map_interact');
      throw errMsg;
    }
  });
});
