import {by, element, expect} from 'detox';
import {scrollToId, tapById} from './interactionHelpers';

// Go to the given tab
export async function goToTab(
  tab?: 'assistant' | 'departures' | 'tickets' | 'profile',
) {
  const tabId = tab + 'Tab';
  await tapById(tabId);
}

export const goBack = async () => {
  await tapById('lhb');
};

// Find element display text name based on type 'RCTTextView' and search term. element(by...) does not support RegExp.
export async function findTextViewElementDisplayText(searchTerm: string) {
  return await element(by.type('RCTTextView'))
    .getAttributes()
    .then((e) => {
      return 'elements' in e
        ? e.elements.filter(function (el) {
            return el.text?.includes(searchTerm);
          })[0].text
        : 'NotFound';
    })
    .catch((e) => (e == undefined ? 'NotFound' : e));
}

export const setInputById = async (id: string, text: string) => {
  await tapById(id);
  await element(by.id(id)).replaceText(text);
};

export const clearInputById = async (id: string) => {
  await tapById(id);
  await element(by.id(id)).clearText();
};

export const chooseSearchResult = async (id: string) => {
  await scrollToId('historyAndResultsScrollView', id, 'down', 100);
  await tapById(id);
};

// Set the time. Use format 'HH:mm'
export const setTimeInDateTimePicker = async (time: string) => {
  await element(by.id('timeInput')).setDatePickerDate(time, 'HH:mm');
};

// Get the number of an id with increasing id-number, e.g. 'item0, ..., itemN'
export const getNumberOfIncreasedIds = async (id: string) => {
  let counter = 0;
  // Loop through all ids
  while (true) {
    const idWithCount: string = id + counter.toString();
    // Try and catch when expecting an id that does not exist
    try {
      await expect(element(by.id(idWithCount))).toExist();

      counter += 1;
    } catch (e) {
      break;
    }
  }

  return counter;
};

// Get the number of an id
export const getNumberOfIds = async (id: string) => {
  return await element(by.id(id))
    .getAttributes()
    .then((e) => (!('elements' in e) ? 1 : e.elements.length))
    .catch((e) => 0);
};

// Get the number of an id in a hierarchy
export const getNumberOfHierarchyIds = async (
  elementMatcher: Detox.NativeMatcher,
) => {
  return await element(elementMatcher)
    .getAttributes()
    .then((e) => (!('elements' in e) ? 1 : e.elements.length))
    .catch((e) => 0);
};

// Return text of given element id
export const getTextOfElementId = async (elementId: string) => {
  return await element(by.id(elementId))
    .getAttributes()
    .then((e) => {
      return !('elements' in e) ? e.text : 'TooManyElements';
    });
};

// true: id or idHierarchy exists
// false: id or idHierarchy does not exists
export const idExists = async (
  elementMatcher: Detox.NativeMatcher,
  withTimeoutMillis: number = 0,
) => {
  if (withTimeoutMillis > 0) {
    return await waitFor(element(elementMatcher))
      .toExist()
      .withTimeout(withTimeoutMillis)
      .then((e) => true)
      .catch((e) => false);
  } else {
    return await expect(element(elementMatcher))
      .toExist()
      .then((e) => true)
      .catch((e) => false);
  }
};

// Get current time
export const getCurrentTime = () => {
  function addZero(i: number) {
    return i < 10 ? '0' + i.toString() : i.toString();
  }

  let date = new Date();
  let hr = addZero(date.getHours());
  let min = addZero(date.getMinutes());

  return `${hr}:${min}`;
};
