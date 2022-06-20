# challenge model
Binary parser / serializer.

The format is versioned.

Refer to the official handbook for additional information.

## header

| Length (bytes)| Type          | Description  |
| ------------- |:------------- |:------------ |
| 1             | version       | Format version identifier |

## Format version 0x00

| Length (bytes)| Type                           | Description  |
| ------------- |:------------------------------ |:------------ |
| 1             | Length                         | Challenge length (excluding signature) |
| 2             | Client id                      | Random id for the Inspection App client. |
| 2             | General transport delay minute | Number of minutes delay for this departure. Used to assist Traveller Apps to select the correct inspection nonce received with the FARE CONTRACTs. One quarter of the number range is reserved for negative delays. Offset is 16383. Example: Read unsigned value 16503 should be interpreted as a 120 minute delay. |
| 1 bit         | Self-inspect flag              | If set to TRUE/1, the Traveller App shall perform the Self-Inspection process. |
| 7 bit         | Transport                      | Physical transport channel. 0x01 for BLE or 0x02 for NFC. |
| 4             | Challenge Expiry               | Expiry timestamp as seconds since the reference time. Reference time is  Unix epoch + 1608336000 seconds (i.e. 51 * 365 days from Unix epoc).  Traveller Apps must discard expired challenges. Used to limit replay attacks. |
| 8+            | Secret nonce                   | The secret to embed in the token response from the Traveller App. |


