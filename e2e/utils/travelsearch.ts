import {by, element, expect} from 'detox';
import {tapById} from './interactionHelpers';
import {
  expectElementToIncludeText,
  expectToBeVisibleByText,
  expectToExistsByIdHierarchy,
} from './expectHelpers';
import {
  chooseSearchResult,
  getNumberOfHierarchyIds,
  getNumberOfIncreasedIds,
  idExists,
  setInputById,
} from './commonHelpers';

// Do a travel search
export async function travelSearch(departure: string, arrival: string) {
  await tapById('searchFromButton');
  await setInputById('locationSearchInput', departure);
  await chooseSearchResult('locationSearchItem0');

  await expectToBeVisibleByText('Travel search');

  await tapById('searchToButton');
  await setInputById('locationSearchInput', arrival);
  await chooseSearchResult('locationSearchItem0');

  await expectToBeVisibleByText('Travel search');
}

// Get the number of travel suggestions
export const numberOfTravelSuggestions = async () => {
  return await element(by.type('RCTTextView').and(by.text('Details')))
    .getAttributes()
    .then((e) => (!('elements' in e) ? 1 : e.elements.length))
    .catch((e) => 0);
};

// Return start and end times in an array
export const getStartAndEndTimes = async (id: string) => {
  let startEndTime = await element(
    by.id('resultStartAndEndTime').withAncestor(by.id(id)),
  )
    .getAttributes()
    .then((e) => (!('elements' in e) ? e.text : 'NA'))
    .catch((error) => 'Error ' + error.toString());
  return startEndTime !== undefined ? startEndTime.split(' – ') : [];
};

// Return departure location and time in an array
export const getDepartureInfo = async (id: string) => {
  let depLocation = await element(
    by.id('resultDeparturePlace').withAncestor(by.id(id)),
  )
    .getAttributes()
    .then((e) => (!('elements' in e) ? e.text?.split('From ') : 'NA'))
    .catch((error) => 'Error ' + error.toString());

  let depTime = await element(
    by.id('resultDepartureTime').withAncestor(by.id(id)),
  )
    .getAttributes()
    .then((e) => (!('elements' in e) ? e.text?.split(' ') : 'NA'))
    .catch((error) => 'Error ' + error.toString());

  return Array.isArray(depLocation) && Array.isArray(depTime)
    ? [
        depLocation[depLocation.length - 1].trim(),
        depTime[depTime.length - 1].trim(),
      ]
    : [];
};

// Return trip duration (NB! assumes minutes)
export const getTripDuration = async (id: string) => {
  let tripDuration = await element(
    by.id('resultDuration').withAncestor(by.id(id)),
  )
    .getAttributes()
    .then((e) => (!('elements' in e) ? e.text : 'NA'))
    .catch((error) => 'Error ' + error.toString());

  return tripDuration !== undefined
    ? tripDuration.replace('min', 'minutes')
    : 'NA undefined';
};

// Check that the start location has the given text
export const expectStartLocationInTravelDetails = async (location: string) => {
  const elem = element(
    by
      .id('fromPlaceName')
      .withAncestor(by.id('fromPlace').withAncestor(by.id('legContainer0'))),
  );
  await expectElementToIncludeText(location, elem);
};

// Check that the start location has the given text
export const expectEndLocationInTravelDetails = async (location: string) => {
  const lastLegIndex = (await getNumberOfIncreasedIds('legContainer')) - 1;
  const elem = element(
    by
      .id('toPlaceName')
      .withAncestor(
        by.id('toPlace').withAncestor(by.id('legContainer' + lastLegIndex)),
      ),
  );
  await expectElementToIncludeText(location, elem);
};

// Check that the start and end times of the trip is correct in the travel suggestion details
export const expectCorrectStartAndEndTimesInTravelDetails = async (
  startTime: string,
  endTime: string,
) => {
  const lastLegIndex = (await getNumberOfIncreasedIds('legContainer')) - 1;

  // ** START TIME **

  // Use expected time if it exists
  // See 'src/screens/TripDetails/components/Time.tsx'
  let hasExpTime = await timeIdExists(0, 'fromPlace', 'expTime');
  let hasScTime = await timeIdExists(0, 'fromPlace', 'schTime');
  let hasScCaTime = await timeIdExists(0, 'fromPlace', 'schCaTime');

  // Aimed time is not used on the overview
  let timeId = 'noTimeId';
  timeId = hasExpTime ? 'expTime' : timeId;
  timeId = hasScCaTime ? 'schCaTime' : timeId;
  timeId = hasScTime ? 'schTime' : timeId;
  let startTimeEdit = hasScCaTime ? 'ca. ' + startTime : startTime;

  // Expect that the text is present on the timeId
  await expectToExistsByIdHierarchy(
    by
      .id('legContainer0')
      .withDescendant(
        by
          .id('fromPlace')
          .withDescendant(by.id(timeId).and(by.text(startTimeEdit))),
      ),
  );

  // ** END TIME **
  // TODO Disablet pga https://github.com/AtB-AS/mittatb-app/issues/2401
  /*
  hasExpTime = await hasTimeId(lastLegIndex, 'toPlace', 'expTime')
  hasScTime = await hasTimeId(lastLegIndex, 'toPlace','schTime')
  hasScCaTime = await hasTimeId(lastLegIndex, 'toPlace','schCaTime')

  timeId = 'noTimeId'
  timeId = hasExpTime ? 'expTime' : timeId;
  timeId = hasScCaTime ? 'schCaTime' : timeId;
  timeId = hasScTime ? 'schTime' : timeId;
  let endTimeEdit = hasScCaTime ? 'ca. ' + endTime : endTime;

  // Expect that the text is present on the timeId
  await expectToExistsByIdHierarchy(by.id('legContainer' + lastLegIndex).withDescendant(by.id('toPlace').withDescendant(by.id(timeId).and(by.text(endTimeEdit)))))
   */
};

// Check the first transportation departure location and time
export const expectCorrectTransportationDeparture = async (
  depLocation: string,
  depTime: string,
) => {
  let firstLegIsTransportation = await idExists(
    by.id('legContainer0').withDescendant(by.id('transportationLeg')),
  );
  let firstTrLeg = firstLegIsTransportation ? 0 : 1;

  // Check departure location
  let elem = element(
    by
      .id('fromPlaceName')
      .withAncestor(
        by.id('fromPlace').withAncestor(by.id('legContainer' + firstTrLeg)),
      ),
  );
  await expectElementToIncludeText(depLocation, elem);

  // Check departure time
  let hasExpTime = await timeIdExists(firstTrLeg, 'fromPlace', 'expTime');
  let hasScTime = await timeIdExists(firstTrLeg, 'fromPlace', 'schTime');
  let hasScCaTime = await timeIdExists(firstTrLeg, 'fromPlace', 'schCaTime');

  let timeId = 'noTimeId';
  timeId = hasExpTime ? 'expTime' : timeId;
  timeId = hasScCaTime ? 'schCaTime' : timeId;
  timeId = hasScTime ? 'schTime' : timeId;
  let depTimeEdit = hasScCaTime ? 'ca. ' + depTime : depTime;

  // Expect that the depTime is present on the timeId
  await expectToExistsByIdHierarchy(
    by
      .id('legContainer' + firstTrLeg)
      .withDescendant(
        by
          .id('fromPlace')
          .withDescendant(by.id(timeId).and(by.text(depTimeEdit))),
      ),
  );
};

// Returns the number of legs of a travel suggestion
export const getNumberOfLegs = async (resultId: string, legId: string) => {
  return await getNumberOfHierarchyIds(
    by.id(legId).withAncestor(by.id(resultId)),
  );
};

// Returns number of collapsed legs - if exists
export const getNumberOfCollapsedLegs = async (resultId: string) => {
  const hasCollapsed = await idExists(
    by.id('collapsedLegs').withAncestor(by.id(resultId)),
  );

  if (hasCollapsed) {
    const noCollapsed = await element(
      by.id('collapsedLegs').withAncestor(by.id(resultId)),
    )
      .getAttributes()
      .then((e) => (!('elements' in e) ? e.text?.replace('+', '') : '0'))
      .catch((e) => '0');

    return noCollapsed === undefined ? 0 : Number.parseInt(noCollapsed);
  } else {
    return 0;
  }
};

// Returns a list of all departure times
export const getDepartureTimes = async (noTravelSuggestions: number) => {
  let depTimeList: string[] = [];

  // Loop through all travel suggestions
  for (let i = 0; i < noTravelSuggestions; i++) {
    let arrDepTime = await element(
      by
        .id('resultStartAndEndTime')
        .withAncestor(by.id('tripSearchSearchResult' + i)),
    )
      .getAttributes()
      .then((e) => (!('elements' in e) ? e.text?.split(' ') : ['00:00']))
      .catch((e) => ['00:00']);

    let depTime: string = arrDepTime !== undefined ? arrDepTime[0] : '00:00';

    depTimeList.push(depTime);
  }

  return depTimeList;
};

// Returns a list of all arrival times
export const getArrivalTimes = async (noTravelSuggestions: number) => {
  let arrTimeList: string[] = [];

  // Loop through all travel suggestions
  for (let i = 0; i < noTravelSuggestions; i++) {
    let arrDepTime = await element(
      by
        .id('resultStartAndEndTime')
        .withAncestor(by.id('tripSearchSearchResult' + i)),
    )
      .getAttributes()
      .then((e) => (!('elements' in e) ? e.text?.split(' ') : ['00:00']))
      .catch((e) => ['00:00']);

    let arrTime: string =
      arrDepTime !== undefined ? arrDepTime[arrDepTime.length - 1] : '00:00';

    arrTimeList.push(arrTime);
  }

  return arrTimeList;
};

// Verify correct leg types (passed | trip | after) on the line details
export const verifyLegTypeOnQuays = async (
  departure: string,
  arrival: string,
  noQuays: number,
) => {
  let legType = 'passed';

  // Walk through all quays
  for (let i = 0; i < noQuays; i++) {
    let quayName = await element(by.id('quayName'))
      .getAttributes()
      .then((e) => ('elements' in e ? e.elements[i].text : 'NA'))
      .catch((e) => 'NA');
    quayName = quayName === undefined ? 'NA' : quayName;

    // Change legType on departure quay
    legType = quayName.trim() === departure ? 'trip' : legType;

    // Verify
    await expect(
      element(by.text(quayName).withAncestor(by.id('legType_' + legType))),
    ).toExist();

    // Change legType after arrival quay
    legType = quayName.trim() === arrival ? 'after' : legType;
  }
};

// Helper method
const timeIdExists = async (
  legNo: number,
  fromToPlaceId: string,
  timeId: string,
) => {
  return await idExists(
    by
      .id('legContainer' + legNo)
      .withDescendant(by.id(fromToPlaceId).withDescendant(by.id(timeId))),
  );
};
