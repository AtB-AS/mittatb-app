import {device, by, element, expect} from 'detox';
import {goToPage} from "../utils/common";
import {skipOnboarding} from "../utils/onboarding";
import setLocation from "../utils";

describe('Tickets', () => {
    beforeAll(async () => {
        await device.launchApp({
            permissions: {
                location: 'inuse',
            },
            languageAndLocale: {
                language: 'en',
                locale: 'US',
            },
        });
        await setLocation(62.4305, 9.3951);
        await skipOnboarding();

        // Accept ticket limitations
        await goToPage('Tickets')
        await expect(element(by.text('Try buying tickets'))).toBeVisible();
        await element(by.text('Accept')).tap()
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should be able to buy a single ticket', async () => {
        const ticketPrice = '42 kr'

        await goToPage('Tickets')

        await expect(element(by.text('Buy'))).toBeVisible();
        await expect(element(by.text('Valid'))).toBeVisible();
        await expect(element(by.text('New single ticket'))).toBeVisible();
        await expect(element(by.text('New period ticket'))).toBeVisible();

        // Choose single ticket
        await element(by.text('New single ticket')).tap()

        await expect(element(by.text('Single ticket'))).toBeVisible();
        await expect(element(by.text('1 Adult'))).toBeVisible();
        await expect(element(by.text('Travel in 1 zone (A)'))).toBeVisible();
        await expect(element(by.text(`Total: ${ticketPrice}`))).toBeVisible();
        await expect(element(by.text('Go to payment'))).toBeVisible();

        await element(by.text('Go to payment')).tap();

        await expect(element(by.text('Single ticket'))).toBeVisible();
        await expect(element(by.label(`1 Adult ${ticketPrice} Single ticket bus/tram Valid in zone A Starting now`)).atIndex(0)).toExist()
        await expect(element(by.text('1 Adult'))).toBeVisible();
        await expect(element(by.text(ticketPrice)).atIndex(0)).toBeVisible();
        await expect(element(by.text('Single ticket bus/tram'))).toBeVisible();
        await expect(element(by.text('Valid in zone A'))).toBeVisible();
        await expect(element(by.text('Starting now'))).toBeVisible();

        /*
        TODO How to check that 'Confirm option' is disabled before choosing a payment method?
        await expect(element(by.text('Confirm option'))).not.toBeFocused()
        await element(by.text('Confirm option')).getAttributes()
            .then(e => {
                if (!('elements' in e)) {
                    console.log('Confirm option: ', e.text)
                    console.log('Confirm option: ', e.value)
                    console.log('Confirm option: ', e.enabled)
                    console.log('Confirm option: ', e.label)
                    console.log('Confirm option: ', e.placeholder)
                }
            })
         */

        // Check the payment cards
        for (let paymentMethod of ['Visa', 'MasterCard']){
            await element(by.text('Choose payment option')).tap();

            await expect(element(by.text('Select payment option'))).toBeVisible();
            await expect(element(by.text('Vipps'))).toBeVisible();
            await expect(element(by.text('Visa'))).toBeVisible();
            await expect(element(by.text('MasterCard'))).toBeVisible();

            await element(by.text(paymentMethod)).tap();

            await element(by.text('Confirm option')).tap();

            // Validate loading of external payment component
            await expect(element(by.text('Loading payment terminal…'))).toBeVisible();
            await waitFor(element(by.type('AXRemoteElement'))).toExist();

            // Cancel
            await element(by.text('Cancel')).tap();

            await expect(element(by.text('Single ticket'))).toBeVisible();

        }

        //TODO How to test the Vipps integration?
        /*
        await element(by.text('Choose payment option')).tap();

        await element(by.text('Vipps')).tap();

        await element(by.text('Confirm option')).tap();

        await expect(element(by.text('Loading payment terminal…'))).toBeVisible();
        await expect(element(by.type('RCTActivityIndicatorView').and(by.label('Pågår')))).toExist();
        await waitFor(element(by.text('Go to Vipps for payment'))).toBeVisible();
        await expect(element(by.text('Payment using Vipps'))).toBeVisible();

        // Here it "hangs" on 'The event "Network Request" is taking place with object: "URL: “https://api.staging.mittatb.no/ticket/v1/payments/653889”"'
        // Possible to use device.setURLBlacklist() on /payment to disable the app from hanging?

        //await device.terminateApp()
        await device.reloadReactNative()
         */
    })

    it('should be able to buy a period ticket', async () => {
        await goToPage('Tickets')

        await expect(element(by.text('Buy'))).toBeVisible();
        await expect(element(by.text('Valid'))).toBeVisible();
        await expect(element(by.text('New single ticket'))).toBeVisible();
        await expect(element(by.text('New period ticket'))).toBeVisible();

        // Choose period ticket
        await element(by.text('New period ticket')).tap()

        await expect(element(by.text('Period tickets – available now!'))).toBeVisible();
        await expect(element(by.text('Log in to purchase 7, 30 or 180-day tickets.'))).toBeVisible();
        await expect(element(by.text('Take me to login'))).toBeVisible();

        //TODO How do we handle login here? Using the same phone number will probably create a lot of App-tokens.
        // No alarms for Entur in staging, but maybe not a wanted situation.
        // Having said that, testing the login process would be a benefical test of an important integration..

    })

});
