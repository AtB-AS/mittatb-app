# QA ticketing in the app

When QA-testing ticketing in the app, we cannot use real payment cards / apps.

## NETS / Credit cards

For credit cards, we use the NETS-terminal. NETS provides different test card numbers here: https://developer.nexigroup.com/nexi-checkout/en-EU/docs/test-card-processing/#build-sample-credit-cards

To simulate various payment errors, see https://developer.nexigroup.com/netaxept/en-EU/docs/test-environment/#build-test-cards

The payment card number most used for successful purchases is `5413000000000000` (Mastercard). The terminal accepts any three digit verification-code, but the month/year-combo always has to be newer or equal to the current date.

Goes without saying; but none of these card numbers will be valid in production.

The NETS-terminal can be tested in simulator as well.

## Vipps

The Vipps-payment method requires the **Vipps MT**-app installed on your device. It is not possible to test in simulator.

To download the app, go to one of these links:

- iOS: https://testflight.apple.com/join/hTAYrwea
- Android: https://install.appcenter.ms/orgs/vipps/apps/vipps-android/distribution_groups/mt%20testers

For details on how to use the Vipps MT (phone number, etc), see: [Vipps MT in testing](https://github.com/AtB-AS/docs-private/blob/main/vipps-mt.md)

When testing the QA-version on the device, the payment process will launch the **Vipps MT**-app. Therefore it should not be possible to pay with the production version (and your own money), unless you make a mistake and open _our_ production app.
