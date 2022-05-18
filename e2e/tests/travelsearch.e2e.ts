import {device} from 'detox';
import {
  chooseSearchResult,
  clearInputById,
  getCurrentTime,
  getNumberOfIds,
  goBack,
  goToTab,
  setInputById,
  setTimeInDateTimePicker,
} from '../utils/commonHelpers';
import {
  tapById,
  tapByText,
  scrollContentToText,
  scrollContent,
  scrollContentToId,
  waitToExistById,
  scrollToId,
} from '../utils/interactionHelpers';
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectIdToHaveText,
  expectIdToHaveChildText,
  expectToBeVisibleByPartOfText,
  expectToExistsById,
  expectNotToExistsById,
  expectToExistsByLabel,
  expectNotToExistsByText,
  expectNotToBeVisibleById,
} from '../utils/expectHelpers';
import {skipOnboarding} from '../utils/onboarding';
import setLocation from '../utils';
import {
  expectCorrectTransportationDeparture,
  expectCorrectStartAndEndTimesInTravelDetails,
  expectEndLocationInTravelDetails,
  expectStartLocationInTravelDetails,
  getDepartureInfo,
  getStartAndEndTimes,
  getTripDuration,
  numberOfTravelSuggestions,
  travelSearch,
  getNumberOfLegs,
  getNumberOfCollapsedLegs,
  getArrivalTimes,
  getDepartureTimes,
  verifyLegTypeOnQuays,
} from '../utils/travelsearch';
import {
  expectBoolean,
  expectGreaterThan,
  expectNumber,
} from '../utils/jestAssertions';
import {
  addFavouriteLocation,
  deleteFavouriteLocation,
  removeSearchHistory,
} from '../utils/myprofile';

describe('Travel Search', () => {
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
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // A happy day path through a travel search and details
  it('should do a simple search', async () => {
    const departure = 'Udduvoll bru vest';
    const arrival = 'Anders Buens gate';
    const intermediateStop = 'Sandmoen E6';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Number of travel suggestions
    let travelSuggestions = await numberOfTravelSuggestions();

    // Get travel details of first travel
    let paging = `1 of ${travelSuggestions}`;
    await expectToBeVisibleById('assistantSearchResult0');
    await expectIdToHaveChildText('assistantSearchResult0', 'Details');
    await tapById('assistantSearchResult0');

    await expectToBeVisibleByText('Trip details');
    await expectToBeVisibleByText(paging);
    await expectToBeVisibleByText('Next');
    await expectToBeVisibleByText('Previous');
    await expectToBeVisibleByText(departure);

    // Scroll to arrival
    await scrollContentToText('tripDetailsContentView', arrival, 'down');
    await expectToBeVisibleByText(arrival);

    // Scroll to bottom and expect 'Trip time'
    await scrollContent('tripDetailsContentView', 'bottom');
    await expectToBeVisibleByPartOfText('Trip time');

    // Show intermediate stops - and expect a specific intermediate stop
    await scrollContent('tripDetailsContentView', 'top');
    await tapById('intermediateStops');
    // Note space at the end
    await scrollContentToText(
      'departureDetailsContentView',
      intermediateStop + ' ',
      'down',
    );
    await tapByText(intermediateStop + ' ');
    await expectToBeVisibleByText(intermediateStop);
    await expectIdToHaveText('quaySection0Title', intermediateStop);

    // Go back
    await goBack();
    await goBack();
    await expectToBeVisibleByText('Trip details');
  });

  // Check that information on the suggestions are the same as in the details
  it('travel suggestions should be reflected in the details', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Get values to assert on
    await expectToBeVisibleById('assistantSearchResult0');
    let startEndTime = await getStartAndEndTimes('assistantSearchResult0');
    let startTime = startEndTime[0];
    let endTime = startEndTime[1];
    let depInfo = await getDepartureInfo('assistantSearchResult0');
    let depLocation = depInfo[0];
    let depTime = depInfo[1];
    let tripDuration = await getTripDuration('assistantSearchResult0');

    // Get travel details of first travel
    await tapById('assistantSearchResult0');

    // Check correct departure and arrival locations in details
    await expectStartLocationInTravelDetails(departure);
    await expectEndLocationInTravelDetails(arrival);

    // Check correct departure and arrival times in details
    await expectCorrectStartAndEndTimesInTravelDetails(startTime, endTime);

    // Check correct transportation departure and time in details
    await expectCorrectTransportationDeparture(depLocation, depTime);

    // Check the trip duration in details
    // NB! Only handles trips < 1 hr
    await scrollContentToId('tripDetailsContentView', 'travelTime', 'down');
    await expectToBeVisibleByText(`Trip time: ${tripDuration}`);
  });

  // Check that the details have correct departure and arrival according to the search parameters
  it('travel details should have correct departure and arrival', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Do a travel search
    await travelSearch(departure, arrival);

    await expectToBeVisibleById('assistantSearchResult0');
    let travelSuggestions = await numberOfTravelSuggestions();
    let paging = `1 of ${travelSuggestions}`;

    // Get travel details of first travel
    await tapById('assistantSearchResult0');

    await expectIdToHaveText('tripPagination', paging);
    await expectStartLocationInTravelDetails(departure);
    await expectEndLocationInTravelDetails(arrival);

    // Step through all suggestions and verify the departure and arrival locations
    for (let i = 2; i <= travelSuggestions; i++) {
      await tapById('nextTripButton');
      paging = `${i} of ${travelSuggestions}`;

      await expectIdToHaveText('tripPagination', paging);
      await expectStartLocationInTravelDetails(departure);
      await expectEndLocationInTravelDetails(arrival);
    }
  });

  // Check that the number of legs is correct on the suggestions
  it('should show correct number of legs', async () => {
    const departure = 'Snåsa skole';
    const arrival = 'Fillan kai';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Set time to trigger collapsed legs
    await tapById('assistantDateTimePicker');
    await tapById('radioButtonDeparture');
    await setTimeInDateTimePicker('04:00');
    await tapById('searchButton');

    // Check for two first travel suggestions
    for (let i = 0; i < 2; i++) {
      // Get number of legs on overview
      const noWalkLegs = await getNumberOfLegs(
        'assistantSearchResult' + i,
        'fLeg',
      );
      const noTransportLegs = await getNumberOfLegs(
        'assistantSearchResult' + i,
        'trLeg',
      );
      const noCollapsedLegs = await getNumberOfCollapsedLegs(
        'assistantSearchResult' + i,
      );
      const noLegs = noWalkLegs + noTransportLegs + noCollapsedLegs;

      // Get travel details of first travel
      await tapById('assistantSearchResult' + i);

      //Verify number of legs
      const noWalkLegsInDetails = await getNumberOfIds('footLeg');
      const noTransportLegsInDetails = await getNumberOfIds(
        'transportationLeg',
      );
      const noLegsInDetails = noWalkLegsInDetails + noTransportLegsInDetails;

      expectNumber(noLegs, noLegsInDetails);

      await goBack();
    }
  });

  // Test the pagination where a user asks for more suggestions
  it('should load more travel suggestions', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Nidarosdomen';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Verify loading ids (Note: 'searchingForResults' cannot be found since Detox are waiting on an 'idle' state)
    await waitToExistById('resultsLoaded', 10000);
    await expectNotToExistsById('searchingForResults');
    await expectIdToHaveChildText('loadMoreButton', 'Load more results ');

    let travelSuggestions = await numberOfTravelSuggestions();

    // Load more suggestions
    await scrollContentToId('assistantContentView', 'loadMoreButton', 'down');
    await tapById('loadMoreButton');

    // Verify
    await waitToExistById('resultsLoaded', 10000);
    await expectNotToExistsById('searchingForResults');

    let moreTravelSuggestions = await numberOfTravelSuggestions();

    expectGreaterThan(moreTravelSuggestions, travelSuggestions);
  });

  // Arrival time is the basis for sorting among the travel suggestions
  it('travel suggestions should be sorted according to arrival time as default', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Get arrival times
    let travelSuggestions = await numberOfTravelSuggestions();
    let arrTimeList = await getArrivalTimes(travelSuggestions);

    // Verify
    for (let i = 1; i < arrTimeList.length; i++) {
      expectBoolean(arrTimeList[i] >= arrTimeList[i - 1], true);
    }
  });

  // Choosing "Now", "Departure after" or "Arrival before" should be reflected in the suggestions
  it('should be able to change time criteria for departure', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';
    const reqDepTime = '10:00';
    const reqArrTime = '23:59';

    // Do a travel search
    await travelSearch(departure, arrival);
    let reqDepTimeNow = getCurrentTime();

    // Default
    await expectToExistsByLabel(`Departing now (${reqDepTimeNow})`);

    // ** Departure after
    await tapById('assistantDateTimePicker');
    await tapById('radioButtonDeparture');
    await setTimeInDateTimePicker(reqDepTime);
    await tapById('searchButton');

    await expectToExistsByLabel(`Departure ${reqDepTime}`);

    let depTimeList = await getDepartureTimes(
      await numberOfTravelSuggestions(),
    );

    // Verify departure times are after requested departure
    for (let i = 0; i < depTimeList.length; i++) {
      expectBoolean(depTimeList[i] >= reqDepTime, true);
    }

    // ** Arrival before
    await tapById('assistantDateTimePicker');
    await tapById('radioButtonArrival');
    await setTimeInDateTimePicker(reqArrTime);
    await tapById('searchButton');

    await expectToExistsByLabel(`Arrival ${reqArrTime}`);

    let arrTimeList = await getArrivalTimes(await numberOfTravelSuggestions());

    // Verify arrival times are after requested arrival
    for (let i = 0; i < arrTimeList.length; i++) {
      expectBoolean(arrTimeList[i] <= reqArrTime, true);
    }

    // ** Now
    await tapById('assistantDateTimePicker');
    await tapById('radioButtonNow');
    await tapById('searchButton');
    reqDepTimeNow = getCurrentTime();

    await expectToExistsByLabel(`Departing now (${reqDepTimeNow})`);

    depTimeList = await getDepartureTimes(await numberOfTravelSuggestions());

    // Verify departure times are after now
    for (let i = 0; i < depTimeList.length; i++) {
      expectBoolean(depTimeList[i] >= reqDepTimeNow, true);
    }
  });

  // Check that earlier and later quays on a line is rendered correctly, when travelling only a part of the line
  it('should show the journey as part of a complete line', async () => {
    // Line 82 has 1 previous quay, 1 intermediate quay and 1 later quay
    const departure = 'Høyeggen skole';
    const arrivalSearch = 'Uglevegen, Melhus';
    const arrival = 'Uglevegen';

    // Do a travel search and get details of the line
    await travelSearch(departure, arrivalSearch);
    await tapById('assistantSearchResult1');
    await scrollContentToId(
      'tripDetailsContentView',
      'intermediateStops',
      'down',
    );
    await tapById('intermediateStops');

    // Verify correct leg types (passed | trip | after)
    let noQuays = await getNumberOfIds('quayName');
    await verifyLegTypeOnQuays(departure, arrival, noQuays);
  });

  // Check that recent journeys are listed and able to choose
  it('should list recent journeys', async () => {
    const departure1 = 'Prinsens gate';
    const departure2 = 'Nidarosdomen';
    const arrival1 = 'Melhus skysstasjon';
    const arrival2 = 'Melhus sentrum';

    // Remove the search history
    await goToTab('profile');
    await removeSearchHistory();
    await goToTab('assistant');

    // Search #1
    await travelSearch(departure1, arrival1);

    // Search #2
    await tapById('searchToButton');
    await setInputById('locationSearchInput', arrival2);
    await chooseSearchResult('locationSearchItem0');

    // Search #3
    await tapById('searchFromButton');
    await setInputById('locationSearchInput', departure2);
    await chooseSearchResult('locationSearchItem0');

    // Verify recent journeys with given departure
    await tapById('searchFromButton');
    await expectIdToHaveChildText(
      'journeyHistoryItem0',
      `${departure2} - ${arrival2}`,
    );

    // Verify recent journeys with any departure
    await clearInputById('locationSearchInput');
    await expectIdToHaveChildText(
      'journeyHistoryItem0',
      `${departure2} - ${arrival2}`,
    );
    await expectIdToHaveChildText(
      'journeyHistoryItem1',
      `${departure1} - ${arrival2}`,
    );
    await expectIdToHaveChildText(
      'journeyHistoryItem2',
      `${departure1} - ${arrival1}`,
    );
  });

  // Check that recent locations are listed and able to choose
  it('should list recent locations', async () => {
    const departure1 = 'Prinsens gate';
    const departure2 = 'Studentersamfundet';
    const arrival1 = 'Melhus skysstasjon';
    const arrival2 = 'Melhus sentrum';

    // Remove the search history
    await goToTab('profile');
    await removeSearchHistory();
    await goToTab('assistant');

    // Search #1
    await travelSearch(departure1, arrival1);

    // Search #2
    await travelSearch(departure2, arrival2);

    // Verify no recent locations with given departure
    await tapById('searchFromButton');
    await expectNotToExistsById('previousResultItem0');

    // Verify recent journeys with any departure
    await clearInputById('locationSearchInput');
    await expectIdToHaveText('previousResultItem0Name', arrival2);
    await expectIdToHaveText('previousResultItem1Name', departure2);
    await expectIdToHaveText('previousResultItem2Name', arrival1);
    await expectIdToHaveText('previousResultItem3Name', departure1);
  });

  // Test the use of favourites in a travel search
  it('should be able to use favourites in the travel search', async () => {
    const fav1 = 'Prinsens gate';
    const favName1 = 'PG';
    const fav2 = 'Melhus skysstasjon';
    const favName2 = 'MS';

    await expectNotToExistsById('favoriteChip0');
    await expectNotToExistsById('favoriteChip1');

    await addFavouriteLocation(fav1, favName1);
    await addFavouriteLocation(fav2, favName2);

    await expectToExistsById('favoriteChip0');
    await expectToExistsById('favoriteChip1');

    // Search
    await tapById('searchFromButton');
    await tapById('favoriteChip0');
    await tapById('searchToButton');
    await tapById('favoriteChip1');

    // Verify
    await expectToBeVisibleByText('Travel assistant');
    await expectGreaterThan(await numberOfTravelSuggestions(), 0);
    // Get travel details of first travel
    await tapById('assistantSearchResult0');
    await expectStartLocationInTravelDetails(fav1);
    await expectEndLocationInTravelDetails(fav2);

    await goBack();
    await tapById('assistantTab');

    await expectToExistsById('favoriteChip0');
    await expectToExistsById('favoriteChip1');

    // Remove a favourite
    await goToTab('profile');
    await scrollToId(
      'profileHomeScrollView',
      'favoriteLocationsButton',
      'down',
    );
    await tapById('favoriteLocationsButton');
    await deleteFavouriteLocation(favName2);

    // Verify
    await goToTab('assistant');
    await expectToExistsById('favoriteChip0');
    await expectNotToExistsById('favoriteChip1');
  });

  // Tapping should reset the travel search
  it('should be able to reset the travel search', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Remove the search history
    await goToTab('profile');
    await removeSearchHistory();
    await goToTab('assistant');

    // Do a travel search
    await travelSearch(departure, arrival);

    // Last journey index
    let lastJourneyIndex = (await numberOfTravelSuggestions()) - 1;

    await scrollContentToId(
      'assistantContentView',
      'assistantSearchResult' + lastJourneyIndex,
      'down',
    );
    await tapById('assistantSearchResult' + lastJourneyIndex);

    await expectNotToExistsByText('Travel assistant');
    await expectToBeVisibleByText('Trip details');

    // Verify 'back' by tapping the assistant tab
    await tapById('assistantTab');

    await expectNotToExistsByText('Trip details');
    await expectToBeVisibleByText('Travel assistant');
    await expectToBeVisibleById('assistantSearchResult' + lastJourneyIndex);
    await expectNotToBeVisibleById('assistantSearchResult0');

    // Verify 'scrollUp' by tapping the assistant tab
    await tapById('assistantTab');

    await expectToBeVisibleByText('Travel assistant');
    await expectToBeVisibleById('assistantSearchResult0');
    await expectNotToBeVisibleById('assistantSearchResult' + lastJourneyIndex);

    // Verify 'reset' by tapping the assistant tab
    await tapById('assistantTab');

    await expectToBeVisibleByText('Travel assistant');
    await expectNotToExistsById('assistantContentView');
  });

  // The service disruption button should lead to a link
  it('should show where to find service disruptions', async () => {
    const serviceDisruptionText = 'atb.no/driftsavvik (opens in browser)';

    // Open information
    await tapById('serviceDisruptionButton');

    // Verify
    await expectToBeVisibleByText('Service disruptions');
    await expectIdToHaveChildText(
      'navigateToServiceDisruptions',
      serviceDisruptionText,
    );

    await tapById('cancelButton');
    await expectNotToExistsByText('Service disruptions');
  });
});
