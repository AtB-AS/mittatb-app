import { by, device, element } from "detox";
import {
  getNumberOfHierarchyIds,
  getNumberOfIds,
  goBack,
  setInputById,
  setTimeInDateTimePicker
} from "../utils/commonHelpers";
import {
  tapById,
  tapByText,
  scrollContentToText,
  scrollContent,
  scrollContentToId, waitToExistById
} from "../utils/interactionHelpers";
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  expectTextById,
  expectElementIdToHaveText,
  expectToBeVisibleByPartOfText,
  expectToExistsById,
  expectNotToExistsById,
  expectElementToContainText,
  expectElementIdToContainId
} from "../utils/expectHelpers";
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
  travelSearch, getNumberOfLegs, getNumberOfCollapsedLegs, getArrivalTimes
} from "../utils/travelsearch";
import { expectBoolean, expectGreaterThan, expectNumber } from "../utils/jestAssertions";

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

  // Activate when more test cases are implemented
  /*
  beforeEach(async () => {
    await device.reloadReactNative();
  });
   */

  // A happy day path through a travel search and details
  xit('should do a simple search', async () => {
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
    await expectElementIdToHaveText('assistantSearchResult0', 'Details');
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
    await scrollContentToId(
      'tripDetailsContentView',
      'intermediateStops',
      'up',
    );
    await tapById('intermediateStops');
    // Note space at the end
    await scrollContentToText(
      'departureDetailsContentView',
      intermediateStop + ' ',
      'down',
    );
    await tapByText(intermediateStop + ' ');
    await expectToBeVisibleByText(intermediateStop);
    await expectTextById('quaySection0Title', intermediateStop);

    // Go back
    await goBack();
    await goBack();
    await expectToBeVisibleByText('Trip details');
  });


  // Check that information on the suggestions are the same as in the details
  xit('travel suggestions should be reflected in the details', async() => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Get values to assert on
    await expectToBeVisibleById('assistantSearchResult0');
    let startEndTime = await getStartAndEndTimes('assistantSearchResult0')
    let startTime = startEndTime[0]
    let endTime = startEndTime[1]
    let depInfo = await getDepartureInfo('assistantSearchResult0')
    let depLocation = depInfo[0]
    let depTime = depInfo[1]
    let tripDuration = await getTripDuration('assistantSearchResult0')

    // Get travel details of first travel
    await tapById('assistantSearchResult0');

    // Check correct departure and arrival locations in details
    await expectStartLocationInTravelDetails(departure)
    await expectEndLocationInTravelDetails(arrival)

    // Check correct departure and arrival times in details
    await expectCorrectStartAndEndTimesInTravelDetails(startTime, endTime)

    // Check correct transportation departure and time in details
    await expectCorrectTransportationDeparture(depLocation, depTime)

    // Check the trip duration in details
    // NB! Only handles trips < 1 hr
    await scrollContentToId(
      'tripDetailsContentView',
      'travelTime',
      'down',
    );
    await expectToBeVisibleByText(`Trip time: ${tripDuration}`)
  });

  // Check that the details have correct departure and arrival according to the search parameters
  xit('travel details should have correct departure and arrival', async() => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Do a travel search
    await travelSearch(departure, arrival);

    await expectToBeVisibleById('assistantSearchResult0');
    let travelSuggestions = await numberOfTravelSuggestions();
    let paging = `1 of ${travelSuggestions}`;

    // Get travel details of first travel
    await tapById('assistantSearchResult0');

    await expectTextById('tripPagination', paging)
    await expectStartLocationInTravelDetails(departure)
    await expectEndLocationInTravelDetails(arrival)

    // Step through all suggestions and verify the departure and arrival locations
    for (let i = 2; i <= travelSuggestions; i++){
      await tapById('nextTripButton');
      paging = `${i} of ${travelSuggestions}`;

      await expectTextById('tripPagination', paging)
      await expectStartLocationInTravelDetails(departure)
      await expectEndLocationInTravelDetails(arrival)
    }
  });

  // Check that the number of legs is correct on the suggestions
  xit('should show correct number of legs', async() => {
    const departure = 'Snåsa skole';
    const arrival = 'Fillan kai';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Set time to trigger collapsed legs
    await tapById('assistantDateTimePicker')
    await tapById('radioButtonDeparture')
    await setTimeInDateTimePicker('04:00')
    await tapById('searchButton')

    // Check for two first travel suggestions
    for (let i = 0; i < 2; i++){
      // Get number of legs on overview
      const noWalkLegs = await getNumberOfLegs('assistantSearchResult' + i, 'fLeg')
      const noTransportLegs = await getNumberOfLegs('assistantSearchResult' + i, 'trLeg')
      const noCollapsedLegs = await getNumberOfCollapsedLegs('assistantSearchResult' + i)
      const noLegs = noWalkLegs + noTransportLegs + noCollapsedLegs

      // Get travel details of first travel
      await tapById('assistantSearchResult' + i);

      //Verify number of legs
      const noWalkLegsInDetails = await getNumberOfIds('footLeg')
      const noTransportLegsInDetails = await getNumberOfIds('transportationLeg')
      const noLegsInDetails = noWalkLegsInDetails + noTransportLegsInDetails

      expectNumber(noLegs, noLegsInDetails)

      await goBack()
    }
  });

  // Test the pagination where a user asks for more suggestions
  xit('should load more travel suggestions', async() => {
    const departure = 'Prinsens gate';
    const arrival = 'Nidarosdomen';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Verify loading ids (Note: 'searchingForResults' cannot be found since Detox are waiting on an 'idle' state)
    await waitToExistById('resultsLoaded', 10000)
    await expectNotToExistsById('searchingForResults')
    await expectElementIdToHaveText('loadMoreButton', 'Load more results ')

    let travelSuggestions = await numberOfTravelSuggestions();

    // Load more suggestions
    await scrollContentToId(
      'assistantContentView',
      'loadMoreButton',
      'down',
    );
    await tapById('loadMoreButton')

    // Verify
    await waitToExistById('resultsLoaded', 10000)
    await expectNotToExistsById('searchingForResults')

    let moreTravelSuggestions = await numberOfTravelSuggestions();

    expectGreaterThan(moreTravelSuggestions, travelSuggestions)

  });

  // Arrival time is the basis for sorting among the travel suggestions
  it('travel suggestions should be sorted according to arrival time as default', async() => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Get departure times
    let travelSuggestions = await numberOfTravelSuggestions();
    let arrTimeList = await getArrivalTimes(travelSuggestions)
    //TODO TEST
    console.log(`-- arrTimeList: ${arrTimeList}`)

    // Verify
    for (let i = 1; i < arrTimeList.length; i++) {
      expectBoolean(arrTimeList[i] >= arrTimeList[i - 1], true)
    }

  });

  // Choosing "Now", "Departure after" or "Arrival before" should be reflected in the suggestions
  xit('should be able to change time criteria for departure', async() => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    // Do a travel search
    await travelSearch(departure, arrival);

    // Default
    await expectElementIdToHaveText('assistantDateTimePicker',   'Departing now')

    // Now => Departure
    await tapById('assistantDateTimePicker')
    await tapById('radioButtonDeparture')
    await setTimeInDateTimePicker('10:00')
    await tapById('searchButton')

    //TODO KOM HIT


    //
    let arrTimeList = await getArrivalTimes(await numberOfTravelSuggestions())

  });

  // The service disruption button should lead to a link
  xit('should show where to find service disruptions', async() => {
    // after "feat: removes logo from header and adds service disruptions #2375"
  });

  // Tapping (or long press?) should reset the travel search
  xit('should be able to reset the travel search', async() => {
    // after "feat: removes logo from header and adds service disruptions #2375"
  });

  // Test the use of favourites in a travel search
  xit('should be able to use favourites in the travel search', async() => {
    /*
    - use favourites in the travel search
    - add a favourite from the travel search pane
    - removing a favourite should be reflected as options for the travel search
     */
  });

  // Check that earlier travel searches are listed as possible search parameters
  xit('should list the last travel searches', async() => {

  });

  /*
      søk
        journeyHistoryItem0
      reiseforslag
        resultStartAndEndTime: 08:00 - 09:00
        resultDuration: 25 min / 1 h, 25 min
        resultDeparturePlace: From Prinsens gate P1
        resultDepartureTime: 19:41
        fLeg: foot legs
        trLegs: transp legs
        collapsedLegs: +4
      more
        loadMoreButton
          searchingForResults
          resultsLoaded
      reisedetaljer
        (header)
          tripStartTime
          previousTripButton
          nextTripButton
          tripPagination
        legContainer
          fromPlace
            fromPlaceName
          transportationLeg / footLeg
          intermediateStops
          toPlace
            toPlaceName
        linjedetaljer
          departureDetailsContentView
            tripStartTime
            tripItem0
              [legType_passed | legType_trip | legType_after]
              tripItem0Name
        tidsvelger
          assistantDateTimePicker
            radioButtonNow
            radioButtonDeparture
              dateTimePickerSection
              ?
            radioButtonArrival
              dateTimePickerSection
              ?
            searchButton
   */


});
