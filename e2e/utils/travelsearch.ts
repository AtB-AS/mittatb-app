import {by, element} from 'detox';
import {expectToBeVisibleByText, tapById} from './interactionHelpers';
import {chooseSearchResult, setInputById} from './commonHelpers';

// Do a travel search (NOTE: use departure and arrival with only one bus station in the suggestions)
export async function travelSearch(departure: string, arrival: string) {
  await tapById('searchFromButton');
  await setInputById('locationSearchInput', departure);
  await chooseSearchResult('locationSearchItem0');

  await expectToBeVisibleByText('Travel assistant');

  await tapById('searchToButton');
  await setInputById('locationSearchInput', arrival);
  await chooseSearchResult('locationSearchItem0');

  await expectToBeVisibleByText('Travel assistant');
}

// Get the number of travel suggestions
export async function numberOfTravelSuggestions() {
  return await element(by.type('RCTTextView').and(by.text('Details')))
    .getAttributes()
    .then((e) => (!('elements' in e) ? 1 : e.elements.length))
    .catch((e) => 0);
}
