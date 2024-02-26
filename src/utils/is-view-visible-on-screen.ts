/**
 * Function for checking whether a layout is visible on-screen or not, by comparing
 * it's position and size on screen and the available window size.
 *
 * If it's border is within the available window size, then the view is visible
 * otherwise the view is deemed as not visible. So, only a fully visible view is
 * considered as "visible".
 *
 * example of how to use this function:
 *
 * const viewRef = useRef<View>(null);
 *
 * function doSomethingWhenLayoutIsVisible() {
 *   if (viewRef.current) {
 *     viewRef.current.measure((x, y, width, height, pageX, pageY) => {
 *       const window = Dimensions.get('window');
 *       const isViewVisible = isViewVisibleOnScreen(
 *         width,height,pageX,pageY,window.width, window.height
 *       );
 *
 *       if (isViewVisible){
 *         // do something when view is visible
 *       } else {
 *         // do something when view is not fully visible
 *       }
 *     });
 *   }
 * }
 *
 * ---
 * Logic behind this function
 * ---
 *
 *  wa==================wb
 *  ||      window      ||
 *  ||                  ||
 *  ||   a----w----b    ||
 *  ||   |         |    ||
 *  ||   |         |    ||
 *  ||   h   view  |    ||
 *  ||   |         |    ||
 *  ||   |         |    ||
 *  ||   c---------d    ||
 *  ||                  ||
 *  wc==================wd
 *
 * A window has position, width and height, if we put it into numbers:
 *
 * wa = (0,0)
 * wb = (windowWidth, 0)
 * wc = (0, windowHeight)
 * wd = (windowWidth, windowHeight)
 *
 * the View also has position, width, and height, for the view:
 *
 * a = (viewX, viewY)
 * b = (viewX + w, viewY)
 * c = (viewX, viewY + h)
 * d = (viewX + w, viewY + h)
 *
 *
 * So, for the view to be fully visible in the window, all of this
 * comparison must be true:
 *
 *  - viewX >= 0
 *  - viewY >= 0
 *  - viewX + w <= windowWidth
 *  - viewY + h <= windowHeight
 *  - w > 0
 *  - h > 0
 *
 * @param w view width
 * @param h view height
 * @param viewX view x-coordinate relative to page
 * @param viewY view y-coordinate relative to page
 * @param windowWidth window width
 * @param windowHeight window height
 * @returns boolean value, true if view is visible on screen,
 * false if view is not fully visible on screen.
 */

export function isViewVisibleOnScreen(
  w: number,
  h: number,
  viewX: number,
  viewY: number,
  windowWidth: number,
  windowHeight: number,
): boolean {
  return (
    viewX >= 0 &&
    viewY >= 0 &&
    w > 0 &&
    h > 0 &&
    viewX + w <= windowWidth &&
    viewY + h <= windowHeight
  );
}
