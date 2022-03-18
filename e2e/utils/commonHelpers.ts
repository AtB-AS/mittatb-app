import {by, element} from 'detox';
import {tapById} from './interactionHelpers';
import {replaceTextById} from './expectHelpers';

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
  await replaceTextById(id, text);
};

export const chooseSearchResult = async (id: string) => {
  await tapById(id);
};
