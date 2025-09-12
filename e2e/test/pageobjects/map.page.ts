import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.js';
import {driver} from '@wdio/globals';

// The map view element
const mapId: string = 'mapView';

class MapPage {
  /**
   * Close / confirm filter choices
   */
  get confirmFilter() {
    const reqId = `//*[@resource-id="confirmFilters"]`;
    return $(reqId);
  }
  /**
   * Open filters
   */
  get mapFilter() {
    const reqId = `//*[@resource-id="mapFilter"]`;
    return $(reqId);
  }
  /**
   * Close filters
   */
  get closeFilter() {
    const reqId = `//*[@resource-id="closeButton"]`;
    return $(reqId);
  }

  /**
   * Open filter and toggle on/off a mode
   * @param mode type of mode to toggle all [scooter|bicycle|car]
   */
  async toggle(mode: 'scooter' | 'bicycle' | 'car') {
    await this.mapFilter.click();
    const reqId = `//*[@resource-id="${mode}Toggle"]`;
    await $(reqId).click();
    await AppHelper.pause(50);
    await this.confirmFilter.click();
  }

  /**
   * Pinch "open", i.e. zoom in on a map
   * @param pinchSize size of pinch/zoom [large|small]
   */
  async pinchZoomIn(pinchSize: 'small' | 'large') {
    let elem = await ElementHelper.getElement(mapId);
    const pinchPct: number = pinchSize === 'small' ? 0.5 : 0.75;
    await driver.execute('mobile: pinchOpenGesture', {
      elementId: elem,
      left: 550,
      top: 1200,
      width: 1000,
      height: 1000,
      percent: pinchPct,
    });
    await AppHelper.pause(300);
  }

  /**
   * Pinch "close", i.e. zoom out on a map
   * @param pinchSize size of pinch/zoom [small|large]
   */
  async pinchZoomOut(pinchSize: 'small' | 'large') {
    let elem = await ElementHelper.getElement(mapId);
    const pinchPct: number = pinchSize === 'small' ? 0.5 : 0.75;
    await driver.execute('mobile: pinchCloseGesture', {
      elementId: elem,
      left: 550,
      top: 1200,
      width: 1000,
      height: 1000,
      percent: pinchPct,
    });
    await AppHelper.pause(300);
  }

  /**
   * Drag in a direction, i.e. move a map
   * @param direction direction to drag [up|down|right|left]
   * @param dragLength how long to drag [short|long]
   */
  async drag(
    direction: 'up' | 'down' | 'right' | 'left',
    dragLength: 'short' | 'long',
  ) {
    let elem = await ElementHelper.getElement(mapId);
    let startX = 550;
    let endX = 550;
    let startY = 1000;
    let endY = 1000;
    switch (direction) {
      case 'down':
        endY = dragLength === 'short' ? 1500 : 2000;
        break;
      case 'up':
        startY = dragLength === 'short' ? 1500 : 2000;
        break;
      case 'right':
        startX = dragLength === 'short' ? 550 : 100;
        endX = 1000;
        break;
      case 'left':
        endX = dragLength === 'short' ? 550 : 100;
        startX = 1000;
        break;
    }
    await driver.execute('mobile: dragGesture', {
      elementId: elem,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
    });
    await AppHelper.pause(300);
  }
}

export default new MapPage();
