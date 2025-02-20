import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import OnboardingPage from './onboarding.page.ts';
import AlertHelper from '../utils/alert.helper.ts';

class PurchaseOverviewPage {
  /**
   * Get the payment button
   */
  get goToPayment() {
    const reqId = `//*[@resource-id="goToPaymentButton"]`;
    return $(reqId);
  }

  /**
   * Get the payment button - after adding on-behalf-of phone number
   */
  get goToPaymentOnBehalfOf() {
    const reqId = `//*[@resource-id="toPaymentButton"]`;
    return $(reqId);
  }

  /**
   * Get flex discount expandable - expand or hide
   */
  get flexDiscountExpandable() {
    const reqId = `//*[@resource-id="flexDiscountExpandable"]`;
    return $(reqId);
  }

  /**
   * Get the description toggle for category info
   */
  get toggleDescription() {
    const reqId = `//*[@resource-id="descriptionToggle"]`;
    return $(reqId);
  }

  /**
   * Get the on-behalf-of toggle
   */
  get onBehalfOfToggle() {
    const reqId = `//*[@resource-id="onBehalfOfToggle"]`;
    return $(reqId);
  }

  /**
   * Click on the edit traveller button
   */
  async selectTraveller() {
    const reqId = `//*[@resource-id="selectTravellerButton"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', 'counterInput_adult');
  }

  /**
   * Click on the edit zone button
   */
  async selectZones() {
    const reqId = `//*[@resource-id="selectZonesButton"]`;
    await $(reqId).click();

    // Deny to share location
    await OnboardingPage.denyLocationAndDontAskAgain();
    await AlertHelper.systemSettingsCancel.click();

    await ElementHelper.waitForElement('text', 'Select stops/zones');
  }

  /**
   * Reduce the number of travellers given the category
   * @param userProfile The user profile to reduce
   */
  async decreaseTravellerCount(userProfile: string) {
    const reqId = `//*[@resource-id="counterInput_${userProfile}_rem"]`;
    await $(reqId).click();
  }

  /**
   * Increase the number of travellers given the category
   * @param userProfile The user profile to increase
   */
  async increaseTravellerCount(userProfile: string) {
    const reqId = `//*[@resource-id="counterInput_${userProfile}_add"]`;
    await $(reqId).click();
  }

  /**
   * Confirm the traveller edits
   */
  async confirmTravellers() {
    const reqId = `//*[@resource-id="confirmButton"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Get the zones selected and displayed
   * @param index The zone to get (i.e. 0 = from / both, 1 = to)
   */
  async getZone(index: number = 0) {
    const reqId = `//*[@resource-id="selectedZone"]`;
    return $$(reqId)[index].getText();
  }

  /**
   * Get the travellers chosen
   */
  async getTraveller() {
    const reqId = `//*[@resource-id="selectedTravellers"]`;
    return $(reqId).getText();
  }

  /**
   * Open the ticket information
   */
  async showTicketInformation() {
    const reqId = `//*[@resource-id="ticketInformationButton"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('text', 'Ticket description');
  }

  /**
   * Set phone number to send the ticket to
   * @param number Phone number to send to
   */
  async setPhoneNumber(number: number) {
    const phoneInputId = `//*[@resource-id="loginPhoneInput"]`;

    await ElementHelper.waitForElement('id', 'loginPhoneInput');
    await $(phoneInputId).setValue(number);
    await AppHelper.pause();
  }

  /**
   * Set from and to zones
   * @param zoneFrom The zone to travel from
   * @param zoneTo The zone to travel to
   */
  async setZones(zoneFrom: string, zoneTo: string) {
    const openZoneSelectorId = `//*[@resource-id="selectZonesButton"]`;
    const searchFromId = `//*[@resource-id="searchFromButton"]`;
    const searchToId = `//*[@resource-id="searchToButton"]`;
    const zoneFromId = `//*[@resource-id="tariffZone${zoneFrom}Button"]`;
    const zoneToId = `//*[@resource-id="tariffZone${zoneTo}Button"]`;
    const saveId = `//*[@resource-id="saveZonesButton"]`;

    // Open
    await $(openZoneSelectorId).click();

    // Deny to share location
    await OnboardingPage.denyLocationAndDontAskAgain();
    await AlertHelper.systemSettingsCancel.click();

    // Set from zone
    await ElementHelper.waitForElement('text', 'Select stops/zones');
    await $(searchFromId).click();
    await ElementHelper.waitForElement('id', `tariffZone${zoneFrom}Button`);
    // One click to opt out of the search input field
    await $(zoneFromId).click();
    await $(zoneFromId).click();
    await ElementHelper.waitForElement('text', 'Select stops/zones');

    // Set to zone
    await $(searchToId).click();
    await ElementHelper.waitForElement('id', `tariffZone${zoneTo}Button`);
    // One click to opt out of the search input field
    await $(zoneToId).click();
    await $(zoneToId).click();
    await ElementHelper.waitForElement('id', `saveZonesButton`);

    // Save
    await $(saveId).click();
    await AppHelper.pause();
  }

  /**
   * Return the total price of the offer
   */
  async getTotalPrice() {
    const priceId = `//*[@resource-id="offerTotalPriceText"]`;
    const price = await $(priceId).getText();

    // Price text is "Total ${priceString} kr"
    return parseFloat(price.split(' ')[1]);
  }
}

export default new PurchaseOverviewPage();
