import {by, element, expect} from 'detox';
import {tapById} from './interactionHelpers';
import {expectIdToHaveText, expectToBeVisibleByText} from './expectHelpers';
import {chooseSearchResult, idExists, setInputById} from './commonHelpers';

// Do a departure search
export const departureSearch = async (departure: string) => {
  await tapById('searchFromButton');
  await setInputById('locationSearchInput', departure);
  await chooseSearchResult('locationSearchItem0');

  await expectToBeVisibleByText('Departures');
};

// Check if departure onboarding is done
export const ensureOnboardingIsConfirmed = async () => {
  const haveToConfirmOnboarding = await idExists(
    by.id('departuresOnboardingConfirmButton'),
  );
  if (haveToConfirmOnboarding) {
    await tapById('departuresOnboardingConfirmButton');
  }
};

// v2: Choose bus stop
export const chooseBusStop = async (itemId: string, departureStop: string) => {
  await expectIdToHaveText(itemId + 'Name', departureStop);
  await tapById(itemId);
  await expectToBeVisibleByText(departureStop);
};

// Every line in a quay should have at least one departure
export const expectEveryLineToHaveAnDeparture = async (quayId: string) => {
  let counter = 0;
  // Loop through all line departures from a quay
  while (true) {
    const lineId: string = 'lineItem' + counter.toString();
    // Try and catch when expecting a line that does not exist
    try {
      await expect(
        element(by.id(quayId).withDescendant(by.id(lineId))),
      ).toExist();
    } catch (e) {
      break;
    }
    // Expect that an existing line has a departure
    await expect(
      element(
        by
          .id(quayId)
          .withDescendant(by.id(lineId).withDescendant(by.id('depTime0'))),
      ),
    ).toExist();

    counter += 1;
  }
};

// v1: Tap departure time within the quay-line hierarchy
export const tapDepartureTime = async (
  quayId: string,
  lineId: string,
  departureId: string,
) => {
  await element(
    by.id(departureId).withAncestor(by.id(lineId).withAncestor(by.id(quayId))),
  ).tap();
};

// v2: Tap departure time within the quay
export const tapDeparture = async (quayId: string, departureId: string) => {
  await element(by.id(departureId).withAncestor(by.id(quayId))).tap();
};

// v1: Get the number of departure times for a quay-line combination
export const numberOfDepartureTimes = async (
  quayId: string,
  lineId: string,
) => {
  let counter = 0;
  // Loop through all departure times from a quay-line
  while (true) {
    const depTimeId: string = 'depTime' + counter.toString();
    // Try and catch when expecting a depTime that does not exist
    try {
      await expect(
        element(
          by
            .id(quayId)
            .withDescendant(by.id(lineId).withDescendant(by.id(depTimeId))),
        ),
      ).toExist();
      counter += 1;
    } catch (e) {
      break;
    }
  }

  return counter;
};

// v2: Get the number of departure times for a quay
export const numberOfDepartures = async (quayId: string) => {
  let counter = 0;
  // Loop through all departure times from a quay
  while (true) {
    const depItemId: string = 'departureItem' + counter.toString();
    // Try and catch when expecting a depTime that does not exist
    try {
      await expect(
        element(by.id(quayId).withDescendant(by.id(depItemId))),
      ).toExist();

      counter += 1;
    } catch (e) {
      break;
    }
  }

  return counter;
};

// v1: Return the title of quay-line combination
export const getLineTitle = async (quayId: string, lineId: string) => {
  let title = await element(
    by
      .id(lineId + 'Title')
      .withAncestor(by.id(lineId).withAncestor(by.id(quayId))),
  )
    .getAttributes()
    .then((e) => (!('elements' in e) ? e.text : 'NA'))
    .catch((error) => 'NA');
  return title !== undefined ? title : 'NA';
};

// v1: Return the title of quay-line combination
export const getLineTitleV2 = async (quayId: string, itemId: string) => {
  let publicCode = await element(
    by
      .id(itemId + 'PublicCode')
      .withAncestor(by.id(itemId).withAncestor(by.id(quayId))),
  )
    .getAttributes()
    .then((e) => (!('elements' in e) ? e.text : 'NA'))
    .catch((error) => 'Error ' + error.toString());

  let title = await element(
    by
      .id(itemId + 'Name')
      .withAncestor(by.id(itemId).withAncestor(by.id(quayId))),
  )
    .getAttributes()
    .then((e) => (!('elements' in e) ? e.text : 'NA'))
    .catch((error) => 'Error ' + error.toString());

  return title !== undefined || publicCode !== undefined
    ? `${publicCode} ${title}`
    : 'NA: Undefined';
};
