# bluetooth advertisting frame model
Binary parser / serializer.

The format is unversioned.

Refer to the official handbook for additional information.

## format

| Length (bytes)| Type                   | Description  |
| ------------- |:---------------------- |:------------ |
| 3 bit         | Logical channel number | Logical Channel Number. Intended for use when using multiple signatures and/or versions of challenges in parallel. |
| 1 bit         | Last frame flag        | If true, this is the last frame |
| 4 bit         | Frame number           | Frame number |
| 2             | Client id              | ClientId - the Traveller App client id that is broadcasting. This is the (untrusted) same as the one used in the challenge itself. |
| 1             | Correlation ID         | Frame number | Correlation ID is used to separate each challenge from each other. Increasing number (before rotation) |
| Varying       | Payload.               | The BLE stack handles broadcast size length as part of its protocol, so the payload is simply the remaining bytes (up to 23 bytes for BLE 4.2). |




