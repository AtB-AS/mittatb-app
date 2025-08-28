import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.js';
import {$} from '@wdio/globals';

class AuthenticationPage {
  /**
   * Choose a ticket aka fare product
   * @param fareProduct fare product to choose, e.g. 'single'
   */
  async chooseFareProduct(fareProduct: string) {
    const reqId = `//*[@resource-id="${fareProduct}FareProduct"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Login with phone
   * @param phoneNumber phone number to log in
   * @param otp one time password (default: 123456)
   */
  async loginWithPhone(phoneNumber: string, otp: string = '123456') {
    const loginId = 'chooseLoginPhoneButton';
    const phoneInputId = 'loginPhoneInput';
    const sendCodeId = 'sendCodeButton';
    const codeInputId = 'loginConfirmCodeInput';
    const confirmId = 'submitButton';
    const loginEl = `//*[@resource-id="${loginId}"]`;
    const phoneInputEl = `//*[@resource-id="${phoneInputId}"]`;
    const sendCodeEl = `//*[@resource-id="${sendCodeId}"]`;
    const codeInputEl = `//*[@resource-id="${codeInputId}"]`;
    const confirmEl = `//*[@resource-id="${confirmId}"]`;

    await ElementHelper.waitForElement('id', loginId);
    await $(loginEl).click();
    await ElementHelper.waitForElement('id', phoneInputId);
    await $(phoneInputEl).setValue(phoneNumber);
    await $(sendCodeEl).click();
    await AppHelper.pause(1000);
    await ElementHelper.waitForElement('id', codeInputId);
    await $(codeInputEl).setValue(otp);
    await $(confirmEl).click();
  }

  /**
   * Return the title of the warning info for anonymous purchases
   */
  get getAnonymousWarningTitle() {
    const reqId = `//*[@resource-id="anonymousWarningTitle"]`;
    return $(reqId).getText();
  }
}

export default new AuthenticationPage();
