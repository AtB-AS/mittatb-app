import {useEffect, useState} from 'react';
import {AbtMobileClient, CONTEXT_ID} from '@atb/modules/mobile-token';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

/**
 * Counts the inspection runs. The SDK has one inspection per token context, so
 * only the latest run may end it.
 */
let latestInspectionRun = 0;

/**
 * Runs the SDK's barcode inspection for `AbtBarcodeInspectionView` while
 * `isActive` is true.
 *
 * @returns `true` if the inspection could not begin, so no barcode is shown
 */
export const useBarcodeInspection = (
  isActive: boolean,
  base64EncodedBarcode: boolean,
): boolean => {
  const [hasInspectionError, setHasInspectionError] = useState(false);

  useEffect(() => {
    // Only run inspection while the screen is focused and the app is in the
    // foreground. Re-running when the app becomes active again (e.g. after the
    // phone is unlocked) forces an immediate barcode refresh: the native ~30s
    // update timer is suspended while backgrounded, so the displayed barcode
    // would otherwise stay frozen and expire until the next tick fires.
    if (!isActive) return;

    const run = ++latestInspectionRun;
    let isEnded = false;

    // Prepare data for AbtBarcodeInspectionView
    AbtMobileClient.beginInspection(CONTEXT_ID, {
      visualInspection: {enabled: false},
      barcodeInspection: {
        base64EncodedBarcode,

        // Exclude some data to make the barcode more readable for scanners.
        // This is the same configuration as in the Entur app as of October
        // 2025.
        includedDeviceDetails: {
          application: false,
          os: false,
          network: false,
          nfc: false,
          bluetooth: false,
          attestation: false,
        },
      },
    })
      .then(() => {
        if (!isEnded) setHasInspectionError(false);
        // The inspection began after the cleanup below, so end it again,
        // unless a newer run has begun its own inspection since
        else if (run === latestInspectionRun) {
          AbtMobileClient.endInspection(CONTEXT_ID);
        }
      })
      .catch((error) => {
        notifyBugsnag('Error beginning inspection', {metadata: {error}});
        if (!isEnded) setHasInspectionError(true);
      });
    return () => {
      // Stop updating data for AbtBarcodeInspectionView when backgrounded,
      // navigated away, or unmounted. Unless another screen has begun its own
      // inspection since, for example when opening another ticket.
      isEnded = true;
      if (run === latestInspectionRun) {
        AbtMobileClient.endInspection(CONTEXT_ID);
      }
    };
  }, [base64EncodedBarcode, isActive]);

  return hasInspectionError;
};
