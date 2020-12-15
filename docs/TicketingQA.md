# QA ticketing in the app

When QA-testing ticketing in the app, we cannot use real payment cards / apps.

## NETS / Credit cards

For credit cards, we use the NETS-terminal. NETS provides different test card numbers which will simulate different scenarios: https://shop.nets.eu/nb/web/partners/test-cards

The terminal accepts any three digit verification-code, but the month/year-combo always has to be newer or equal to the current date.

The payment card number most used for successful purchases is `4925000000000004`.

Goes without saying; but none of these card numbers will be valid in production.

The NETS-terminal can be tested in simulator as well.

## Vipps

The Vipps-payment method requires the **Vipps MT**-app installed on your device. It is not possible to test in simulator.

To download the app, go to one of these links:

- iOS: https://testflight.apple.com/join/hTAYrwea
- Android: https://install.appcenter.ms/orgs/vipps/apps/vipps-android/distribution_groups/mt%20testers

After downloading, you will need to make an account. The only phone number(that we know of) which works is `977 77 776`. It will accept any OTP you input to verify the phone number. You will also define your own PIN, which you will need to remember to unlock the app.

When testing the QA-version on the device, the payment process will launch the **Vipps MT**-app. Therefore it should not be possible to pay with the production version (and your own money), unless you make a mistake and open _our_ production app.
