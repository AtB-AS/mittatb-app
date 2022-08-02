import {device} from 'detox';
import {goToTab, goBack} from '../utils/commonHelpers';
import {
  tapById,
  tapByText,
  scrollToId,
  scroll,
} from '../utils/interactionHelpers';
import {
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectIdToHaveChildText,
  expectToBeEnabled,
  expectNotToBeEnabled,
} from '../utils/expectHelpers';
import {skipOnboarding} from '../utils/onboarding';
import {toggleDeparturesV2} from '../utils/myprofile';
import setLocation from '../utils';
import {
  chooseBusStop,
  departureSearch,
  numberOfDepartures,
  tapDeparture,
  getLineTitleV2,
} from '../utils/departures';
import {expectGreaterThan, expectNumber} from '../utils/jestAssertions';

describe('Departures v2', () => {
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
    await device.reloadReactNative();
    await goToTab('departures');
  });

  it('should search for a place and find nearby departures', async () => {
    const placeSearch = 'Emilies ELD';
    const departureStop = 'Prinsens gate';
    const departureQuay0 = 'Prinsens gate P1';
    const departureQuay0Description = 'ved Bunnpris';
    const departureQuay1 = 'Prinsens gate P2';
    const departureQuay1Description = 'ved AtB Kundesenter';
    const nextDepartureStop = 'Nidarosdomen';

    // Enable v2
    await goToTab('profile');
    await toggleDeparturesV2(true);

    // Go to departures
    await goToTab('departures');

    // Do a departure search
    await departureSearch(placeSearch);
    await chooseBusStop('stopPlaceItem0', departureStop);

    // Platform buttons
    await expectIdToHaveChildText('quaySelectionButton', departureQuay0);
    await expectIdToHaveChildText('quaySelectionButton', departureQuay1);

    await expectToBeEnabled('allStopsSelectionButton');
    await expectNotToBeEnabled('quaySelectionButton', 0);
    await expectNotToBeEnabled('quaySelectionButton', 1);

    // ** Quay 0 **

    await expectIdToHaveText('quaySection0Name', departureQuay0);
    await expectIdToHaveText(
      'quaySection0Description',
      departureQuay0Description,
    );

    // Hide and expand departures
    let noDepTimesQuay0Expanded = await numberOfDepartures('quaySection0');
    expectGreaterThan(noDepTimesQuay0Expanded, 0);

    await tapById('quaySection0HideAction');

    let noDepTimesQuay0Hidden = await numberOfDepartures('quaySection0');
    expectNumber(noDepTimesQuay0Hidden, 0);

    await tapById('quaySection0HideAction');

    // ** Quay 1 **

    await scrollToId('departuresContentView', 'quaySection1', 'down');

    await expectIdToHaveText('quaySection1Name', departureQuay1);
    await expectIdToHaveText(
      'quaySection1Description',
      departureQuay1Description,
    );

    // Hide and expand departures
    let noDepTimesQuay1Expanded = await numberOfDepartures('quaySection1');
    expectGreaterThan(noDepTimesQuay1Expanded, 0);

    await tapById('quaySection1HideAction');

    let noDepTimesQuay1Hidden = await numberOfDepartures('quaySection1');
    expectNumber(noDepTimesQuay1Hidden, 0);

    await tapById('quaySection1HideAction');

    // ** Departure details Quay 0 **

    await scroll('departuresContentView', 'top');

    // Collect info to check in details
    let lineTitle = await getLineTitleV2('quaySection0', 'departureItem0');

    // Get travel details of first travel
    await tapDeparture('quaySection0', 'departureItem0');

    await expectToBeVisibleByText(lineTitle);
    await expectToBeVisibleByText(departureQuay0 + ' ');

    // Choose a stop place on the line
    await tapByText(nextDepartureStop + ' ');
    await expectIdToHaveText('quaySection0Title', nextDepartureStop);

    // Go back
    await goBack();
    await goBack();
    await expectToBeVisibleByText(departureStop);
    await goBack();
    await expectToBeVisibleByText('Departures');
  });

  it('should search for a platform and automatically find departures', async () => {
    const departureStop = 'Prinsens gate';
    const departureQuay0 = 'Prinsens gate P1';
    const departureQuay0Description = 'ved Bunnpris';
    const departureQuay1 = 'Prinsens gate P2';
    const departureQuay1Description = 'ved AtB Kundesenter';
    const nextDepartureStop = 'Nidarosdomen';

    // Enable v2
    await goToTab('profile');
    await toggleDeparturesV2(true);

    // Go to departures
    await goToTab('departures');

    // Do a departure search - that should automatically display the stop
    await departureSearch(departureStop);

    // Platform buttons
    await expectIdToHaveChildText('quaySelectionButton', departureQuay0);
    await expectIdToHaveChildText('quaySelectionButton', departureQuay1);

    await expectToBeEnabled('allStopsSelectionButton');
    await expectNotToBeEnabled('quaySelectionButton', 0);
    await expectNotToBeEnabled('quaySelectionButton', 1);

    // ** Quay 0 **

    await expectIdToHaveText('quaySection0Name', departureQuay0);
    await expectIdToHaveText(
      'quaySection0Description',
      departureQuay0Description,
    );

    // Hide and expand departures
    let noDepTimesQuay0Expanded = await numberOfDepartures('quaySection0');
    expectGreaterThan(noDepTimesQuay0Expanded, 0);

    await tapById('quaySection0HideAction');

    let noDepTimesQuay0Hidden = await numberOfDepartures('quaySection0');
    expectNumber(noDepTimesQuay0Hidden, 0);

    await tapById('quaySection0HideAction');

    // ** Quay 1 **

    await scrollToId('departuresContentView', 'quaySection1', 'down');

    await expectIdToHaveText('quaySection1Name', departureQuay1);
    await expectIdToHaveText(
      'quaySection1Description',
      departureQuay1Description,
    );

    // Hide and expand departures
    let noDepTimesQuay1Expanded = await numberOfDepartures('quaySection1');
    expectGreaterThan(noDepTimesQuay1Expanded, 0);

    await tapById('quaySection1HideAction');

    let noDepTimesQuay1Hidden = await numberOfDepartures('quaySection1');
    expectNumber(noDepTimesQuay1Hidden, 0);

    await tapById('quaySection1HideAction');

    // ** Departure details Quay 0 **

    await scroll('departuresContentView', 'top');

    // Collect info to check in details
    let lineTitle = await getLineTitleV2('quaySection0', 'departureItem0');

    // Get travel details of first travel
    await tapDeparture('quaySection0', 'departureItem0');

    await expectToBeVisibleByText(lineTitle);
    await expectToBeVisibleByText(departureQuay0 + ' ');

    // Choose a stop place on the line
    await tapByText(nextDepartureStop + ' ');
    await expectIdToHaveText('quaySection0Title', nextDepartureStop);

    // Go back
    await goBack();
    await goBack();
    await expectToBeVisibleByText(departureStop);
    await goBack();
    await expectToBeVisibleByText('Departures');
  });

  xit('should show departures depending on given time', async () => {
    /*
         1. Set a different time in the date/time picker and assert
         2. Choose 'Next' and 'Previous' day buttons and assert
         */
  });

  xit('should show more departures for a single quay', async () => {
    /*
         1. Select each quay-button and assert
         2. Select the 'Show more departures' button and assert per quay
         */
  });

  xit('departure times should be sorted', async () => {
    /*
         1. Expect that the departure times per quay are sorted
            - Handle the combination of 'Now', 'X min' and 'HH:MM'
         */
  });
});
