import {by, element, expect} from 'detox';
import {scroll, scrollToId, tapById, tapByText} from './interactionHelpers';
import {expectToBeVisibleByText} from './expectHelpers';
import {chooseSearchResult, goToTab, setInputById} from './commonHelpers';

// Toggle language
export const toggleLanguage = async (useMyPhoneSettings: boolean) => {
  const toggle = await element(
    by.type('RCTSwitch').and(by.label('Use my phone settings')),
  )
    .getAttributes()
    .then((elem) => {
      return !('elements' in elem) ? elem.value : undefined;
    });

  // Enable my phone settings if not enabled
  if (toggle == 0 && useMyPhoneSettings) {
    await element(
      by.type('RCTSwitch').and(by.label('Use my phone settings')),
    ).tap();
  }
  // Disable my phone settings if not enabled
  if (toggle == 1 && !useMyPhoneSettings) {
    await element(
      by.type('RCTSwitch').and(by.label('Use my phone settings')),
    ).tap();
  }
};

// Toggle frontpage on/off
export const toggleFrontpage = async (enable: boolean) => {
  await scrollToId('profileHomeScrollView', 'newFrontpageToggle', 'down');

  const toggle = await element(by.id('newFrontpageToggle'))
    .getAttributes()
    .then((elem) => {
      return !('elements' in elem) ? elem.value : undefined;
    });

  // Enable OTP 2 if not enabled
  if (toggle == 0 && enable) {
    await tapById('newFrontpageToggle');
  }
  // Disable OTP 2 if not disabled
  if (toggle == 1 && !enable) {
    await tapById('newFrontpageToggle');
  }
};

// Toggle departures v2 on/off
export const toggleDeparturesV2 = async (enableV2: boolean) => {
  await scrollToId('profileHomeScrollView', 'newDeparturesToggle', 'down');

  const toggle = await element(by.id('newDeparturesToggle'))
    .getAttributes()
    .then((elem) => {
      return !('elements' in elem) ? elem.value : undefined;
    });

  // Enable OTP 2 if not enabled
  if (toggle == 0 && enableV2) {
    await tapById('newDeparturesToggle');
  }
  // Disable OTP 2 if not disabled
  if (toggle == 1 && !enableV2) {
    await tapById('newDeparturesToggle');
  }
};

// Add a favourite location, first hit.
export const addFavouriteLocation = async (
  location: string,
  locationName: string,
) => {
  await tapById('addFavoriteButton');
  await expectToBeVisibleByText('Add a favourite location');
  await setInputById('locationSearchInput', location);
  await chooseSearchResult('locationSearchItem0');

  await setInputById('nameInput', locationName);
  await tapById('saveButton');
};

// Edit the name of a favourite location.
export const editFavouriteLocation = async (
  locationName: string,
  newLocationName: string,
) => {
  // Choose item to edit
  await tapByText(locationName);

  //Edit
  await setInputById('nameInput', newLocationName);
  await tapById('saveButton');
};

// Delete a favourite location.
export const deleteFavouriteLocation = async (locationName: string) => {
  // Choose item to delete
  await tapByText(locationName);

  // Delete
  await tapById('deleteButton');
  await element(
    by
      .type('_UIAlertControllerActionView')
      .and(by.label('Delete favourite location')),
  ).tap();
};

// Check number of favourites
export const expectNumberOfFavourites = async (numFav: number) => {
  if (numFav === 0) {
    await expect(element(by.id('favorite0'))).not.toExist();
  } else {
    for (let i = 0; i < numFav; i++) {
      let favId = 'favorite' + i;
      await expect(element(by.id(favId))).toExist();
    }
    let favId = 'favorite' + numFav;
    await expect(element(by.id(favId))).not.toExist();
  }
};

// Removes the search history
export const removeSearchHistory = async () => {
  await scroll('profileHomeScrollView', 'top');
  await scrollToId('profileHomeScrollView', 'clearHistoryButton', 'down');
  await tapById('clearHistoryButton');
  await element(
    by.type('_UIAlertControllerActionView').and(by.label('Clear history')),
  ).tap();
};
