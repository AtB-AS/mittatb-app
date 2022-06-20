# token-lib

Library for implementing support for so-called tokens. A client can use a token to sign payloads which can be validated on the server.

In this implementation, a token can exist in three states:

-   pending new token
-   activated token
-   pending renewal token

A pending token consist of the following:

-   token id (string)
-   signature key pair
-   encryption key pair

while an activated token also has

-   certificate
-   start time
-   end time

So this module allows the user to

-   create new tokens (from nonce and token id)
-   renew tokens

in such a way that the client and server 'always' agree on which token to use (and thuse cryptographic keys), regardless of faulty network connections (lost requests and/or responses).

See confluence for further documentation.

## Tracing

Tracing calls across the network, i.e. using a so-called correlation-id or trace-id, is supported. For calls against Entur this value should be a UUID string.

## Multiple tokens

The library supports using multiple tokens in parallel via so-called `Token Context`s. The token contexts can be used at the same time, for example two in-flight requests with two different tokens contexts is a possiblity.

Token contexts must be declared upon initialization of the app, and can have individual renewal configuration. Token context id must be specified on all relevant network calls.

Token persistance consists of `Preferences` and `Keystore`. For `Preferences` write operations are synchronized, for `Keystore` both read and write is synchronied. Note that other operations using the same persistance also should be synchronized (if so, pass custom locks into the builders).

## Troubleshooting

Attestation seems timeout if the network connection is bad - this has been seen multiple times during testlab testing. So set the `attestationTimeout` to a somewhat reasonable value (i.e. allow for some network traffic).
