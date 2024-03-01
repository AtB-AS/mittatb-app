/**
 * Function for checking whether an element's border is inside screen or not, by comparing
 * it's position and size on screen and the available window size.
 *
 * If it's border is within the available window size, then the element is visible
 * otherwise the element is deemed as not visible. So, only when all the borders of an element
 * is visible on screen that it is considered as "visible".
 *
 * example of how to use this function:
 *
 * const viewRef = useRef<View>(null);
 *
 * function doSomethingWhenLayoutIsVisible() {
 *   if (viewRef.current) {
 *     viewRef.current.measure((x, y, width, height, pageX, pageY) => {
 *       const window = Dimensions.get('window');
 *       const isVisible = isElementFullyInsideScreen(
 *         width,height,pageX,pageY,window.width, window.height
 *       );
 *
 *       if (isVisible){
 *         // do something when element is visible
 *       } else {
 *         // do something when element is not fully visible
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
 *  ||   h element |    ||
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
 * the element also has position, width, and height:
 *
 * a = (elementX, elementY)
 * b = (elementX + w, elementY)
 * c = (elementX, elementY + h)
 * d = (elementX + w, elementY + h)
 *
 *
 * So, for the element to be fully visible in the window, all of this
 * comparison must be true:
 *
 *  - elementX >= 0
 *  - elementY >= 0
 *  - elementX + w <= windowWidth
 *  - elementY + h <= windowHeight
 *  - w > 0
 *  - h > 0
 *
 * @param w element width
 * @param h element height
 * @param elementX element starting x-coordinate (left) relative to page
 * @param elementY element starting y-coordinate (top) relative to page
 * @param windowWidth window width
 * @param windowHeight window height
 * @returns boolean value, true if element is fully visible on screen,
 * false if element is not fully visible on screen.
 */

export function isElementFullyInsideScreen(
  w: number,
  h: number,
  elementX: number,
  elementY: number,
  windowWidth: number,
  windowHeight: number,
): boolean {
  return (
    elementX >= 0 &&
    elementY >= 0 &&
    w > 0 &&
    h > 0 &&
    elementX + w <= windowWidth &&
    elementY + h <= windowHeight
  );
}
