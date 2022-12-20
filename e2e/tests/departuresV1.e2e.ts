import {device} from 'detox';
import {goToTab, goBack} from '../utils/commonHelpers';
import {
  tapById,
  tapByText,
  scrollContent,
  scrollContentToId,
} from '../utils/interactionHelpers';
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectToExistsById,
  expectNotToExistsByText,
  expectNotToBeVisibleById,
} from '../utils/expectHelpers';
import {skipOnboarding} from '../utils/onboarding';
import setLocation from '../utils';
import {
  departureSearch,
  expectEveryLineToHaveAnDeparture,
  getLineTitle,
  numberOfDepartureTimes,
  tapDepartureTime,
} from '../utils/departures';
import {toggleDeparturesV2} from '../utils/myprofile';

describe('Departures v1', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        location: 'inuse',
      },
      languageAndLocale: {
        language: 'en',
        locale: 'US',
      },
      // If problems with 'hanging' network requests (on iossimulator15.4)
      //launchArgs: { detoxURLBlacklistRegex: ' \\("https://firebaselogging-pa.googleapis.com/v1/firelog/legacy/batchlog"\\)' },
    });
    // If problems with 'hanging' network requests (on iossimulator15.4)
    //await device.setURLBlacklist(['.*firebaselogging-pa.googleapis.com/v1/firelog/legacy/batchlog']);
    await setLocation(62.4305, 9.3951);
    await skipOnboarding();
  });

  beforeEach(async () => {
    // Activate when more test cases are implemented
    //await device.reloadReactNative();
    await goToTab('departures');
  });

  it('should search for a platform and find departures', async () => {
    const departureStop = 'Prinsens gate';
    const departureQuay0 = 'Prinsens gate P1';
    const departureQuay1 = 'Prinsens gate P2';
    const nextDepartureStop = 'Nidarosdomen';

    // Enable v1
    await goToTab('profile');
    await toggleDeparturesV2(false);

    // Go to departures
    await goToTab('departures');
    // Do a departure search
    await departureSearch(departureStop);

    await expectToBeVisibleByText('Departures');
    await expectToExistsById('quaySection0');
    await expectIdToHaveText('quaySection0Title', departureQuay0);

    // ** Quay 0 **

    // Departures exists
    await expectToBeVisibleById('lineItem0Title', 0);

    // Hide departures for the departureStop
    await expectToBeVisibleByText('Hide');
    await tapById('stopDeparture0HideAction');
    await expectNotToExistsByText('Hide');
    await expectToBeVisibleByText('Show');
    await expectNotToBeVisibleById('lineItem0Title', 0);
    await tapById('stopDeparture0HideAction');
    await expectToBeVisibleByText('Hide');
    await expectToBeVisibleById('lineItem0Title', 0);

    // Every line in a quay should have at least one departure
    await expectEveryLineToHaveAnDeparture('quaySection0');

    // ** Quay 1 **

    await scrollContentToId('stopDeparture0', 'quaySection1', 'down');
    await expectIdToHaveText('quaySection1Title', departureQuay1);

    // Departures exists
    await expectToBeVisibleById('lineItem0Title', 1);

    // Every line in a quay should have at least one departure
    await expectEveryLineToHaveAnDeparture('quaySection1');

    // ** Departure details Quay 0 **

    await scrollContent('stopDeparture0', 'top');

    // Collect info to check in details
    let noDepTimes = await numberOfDepartureTimes('quaySection0', 'lineItem0');
    let firstDepTimePaging = `1 of ${noDepTimes}`;
    let lineTitle = await getLineTitle('quaySection0', 'lineItem0');

    // Get travel details of first travel
    await tapDepartureTime('quaySection0', 'lineItem0', 'depTime0');

    await expectToBeVisibleByText(firstDepTimePaging);
    await expectToBeVisibleByText(lineTitle);
    await expectToBeVisibleByText('Next');
    await expectToBeVisibleByText('Previous');
    await expectToBeVisibleByText(departureQuay0);

    // Choose a stop place on the line
    await tapByText(nextDepartureStop);
    await expectIdToHaveText('quaySection0Title', nextDepartureStop);

    // Go back
    await goBack();
    await goBack();
    await expectToBeVisibleByText('Departures');
  });
});

// Note! Place skipped tests in a separate 'describe' without app start-up to save run time
xdescribe('Departures v1 - skipped', () => {
  xit('departure times should be sorted', async () => {
    /*
         1. Expect that the departure times per line is sorted
         2. Expect that the first departure of each line is sorted by quay
         */
  });

  xit('should filter on favourite departures', async () => {
    /*
         1. Mark a single quay-line combination as favourite and assert
         2. Mark all quay-line combinations as favourite and assert
            - Make sure that the combination has different line types of the same publicCode
         3. Remove all favourites and assert
         */
  });
});
