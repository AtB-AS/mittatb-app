/**
 * Different helper methods related to alerts
 */
class AlertHelper {
  /**
   * Confirm button in pop-up alerts
   */
  get alertConfirm() {
    const id = `//*[@resource-id="android:id/button1"]`;
    return $(id);
  }

  /**
   * Title of the pop-up alert
   */
  get alertTitle() {
    const id = `//*[@resource-id="android:id/alertTitle"]`;
    return $(id).getText();
  }

  /**
   * Cancel button in pop-up alerts
   */
  get alertCancel() {
    const id = `//*[@resource-id="android:id/button2"]`;
    return $(id);
  }
}

export default new AlertHelper();
