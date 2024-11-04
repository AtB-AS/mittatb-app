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
  const waitingTime = 5000;

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

      // Zoom and filter
      await MapPage.toggleAll('scooter');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.toggleAll('bicycle');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('large');
      await MapPage.toggleAll('car');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('large');
      await MapPage.drag('right', 'short');
      await MapPage.pinchZoomOut('small');

      // Move around
      await MapPage.drag('up', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('right', 'short');
      await MapPage.drag('left', 'short');
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'short');

      // Zoom and filter
      await MapPage.toggleOperator('ryde');
      await MapPage.toggleOperator('tier');
      await MapPage.toggleOperator('voi');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('small');

      // Filter and move around
      await MapPage.toggleAll('scooter');
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.mapFilter.click();
      await MapPage.closeFilter.click();
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.mapFilter.click();
      await MapPage.closeFilter.click();
      await MapPage.drag('right', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomIn('small');
      await MapPage.drag('right', 'long');
      await MapPage.drag('left', 'long');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomOut('large');
    } catch (errMsg) {
      await AppHelper.screenshot('error_map_interact');
      throw errMsg;
    }
  });
});
