import {device} from 'detox';
import {goToTab, goBack} from '../utils/commonHelpers';
import {
  expectNotToExistsByText,
  scrollToId,
  scrollToText,
  scroll,
  expectToBeVisibleById,
  expectToBeVisibleByText,
  tapById,
  tapByText,
  expectElementToContainText,
  expectElementToContainId,
  expectElementNotToContainId,
} from '../utils/interactionHelpers';
import {skipOnboarding} from '../utils/onboarding';
import {
  addFavouriteLocation,
  deleteFavouriteLocation,
  editFavouriteLocation,
  expectNumberOfFavourites,
  toggleLanguage,
} from '../utils/myatb';
import setLocation from '../utils';

describe('My AtB', () => {
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

    await goToTab('profile');
  });

  beforeEach(async () => {
    //await device.reloadReactNative();
    await goToTab('profile');
    await scroll('profileHomeScrollView', 'top');
  });

  // Validates all the option in 'My AtB'
  it('should show correct options in My AtB', async () => {
    // Scrolls to the bottom first in order to ensure that all sub menus are visible when scrolling up to a menu
    await scroll('profileHomeScrollView', 'bottom');

    // Info and prices
    await expectToBeVisibleByText('Info and prices');
    await expectToBeVisibleById('ticketingInfoButton');
    await expectToBeVisibleByText('Ticketing');
    await expectToBeVisibleById('paymentInfoButton');
    await expectToBeVisibleByText('Payment');
    await expectToBeVisibleById('termsInfoButton');
    await expectToBeVisibleByText('Terms');
    await expectToBeVisibleById('inspectionInfoButton');
    await expectToBeVisibleByText('Ticket inspection');

    // Privacy
    await scrollToText('profileHomeScrollView', 'Privacy', 'up');
    await expectToBeVisibleByText('Privacy');
    await expectToBeVisibleById('privacyButton');
    await expectToBeVisibleByText('Privacy statement');
    await expectToBeVisibleById('clearHistoryButton');
    await expectToBeVisibleByText('Clear search history');

    // Favourites
    await scrollToText('profileHomeScrollView', 'Favourites', 'up');
    await expectToBeVisibleByText('Favourites');
    await expectToBeVisibleById('favoriteLocationsButton');
    await expectToBeVisibleByText('Locations');
    await expectToBeVisibleById('favoriteDeparturesButton');
    await expectToBeVisibleByText('Departures');

    // New features
    await scrollToText('profileHomeScrollView', 'BETA', 'up');
    await expectToBeVisibleByText('New features');
    await expectToBeVisibleById('newDeparturesToggle');
    await expectToBeVisibleByText('Try the new departure view');
    await expectToBeVisibleById('newAssistantToggle');
    await expectToBeVisibleByText('Try the new travel search engine');
    await expectToBeVisibleById('invitationCodeButton');
    await expectToBeVisibleByText('Invitation code');

    // Settings
    await scrollToText('profileHomeScrollView', 'Settings', 'up');
    await expectToBeVisibleByText('Settings');
    await expectToBeVisibleById('defaultTravellerButton');
    await expectToBeVisibleByText('Default traveller');
    await expectToBeVisibleById('appearanceButton');
    await expectToBeVisibleByText('Appearance');
    await expectToBeVisibleById('startScreenButton');
    await expectToBeVisibleByText('Start page');
    await expectToBeVisibleById('languageButton');
    await expectToBeVisibleByText('Language');

    // My account
    await scrollToText('profileHomeScrollView', 'My account', 'up');
    await expectToBeVisibleByText('My account');
    await expectToBeVisibleByText('Customer number');
    await expectToBeVisibleById('loginButton');
    await expectToBeVisibleByText('Sign in');
    await expectToBeVisibleById('expiredTicketsButton');
    await expectToBeVisibleByText('Expired tickets');
  });

  xit('Settings: should change the appearance', async () => {
    /*
        How to check change of appearance?
        - Potentially possible to run device.captureViewHiarchy() and encode the stored file?
        - Another crazy idea is to run device.takeScreenshot() and interpret the colours with ImageMagick or something?
        - A third approach is to print the colour codes within the "Design system"-view and check that it is changed?
        */
  });

  // Validates language change
  it('Settings: should change language', async () => {
    await scrollToText('profileHomeScrollView', 'Settings', 'up');

    await tapById('languageButton');
    await expectToBeVisibleByText('Use my phone settings');
    await expectToBeVisibleByText('Language');
    await expectNotToExistsByText('Språk');
    await expectNotToExistsByText('Norsk bokmål');
    await expectNotToExistsByText('English');

    // Manually choose language
    //NOTE! Any failures in here might lead to the app being stuck in Norwegian for remaining tests
    await toggleLanguage(false);
    await expectToBeVisibleByText('Norsk bokmål');
    await expectToBeVisibleByText('English');

    await tapByText('Norsk bokmål');
    await expectToBeVisibleByText('Språk');
    await expectNotToExistsByText('Language');

    // Validate
    await goBack();
    await expectToBeVisibleByText('Standard reisende');
    await expectToBeVisibleByText('Utseende');
    await expectToBeVisibleByText('Startside');
    await expectToBeVisibleByText('Språk');

    await tapById('languageButton');
    await expectNotToExistsByText('Language');
    await expectToBeVisibleByText('Språk');
    await expectToBeVisibleByText('Bruk telefoninnstillingene mine');
    await expectToBeVisibleByText('Norsk bokmål');
    await expectToBeVisibleByText('English');

    await tapByText('English');
    await expectToBeVisibleByText('Language');
    await expectNotToExistsByText('Språk');
    await expectToBeVisibleByText('Use my phone settings');
    await expectToBeVisibleByText('Norsk bokmål');
    await expectToBeVisibleByText('English');

    // Use phone settings
    await toggleLanguage(true);
    await expectToBeVisibleByText('Language');
    await expectNotToExistsByText('Språk');
    await expectToBeVisibleByText('Use my phone settings');
    await expectNotToExistsByText('Norsk bokmål');
    await expectNotToExistsByText('English');

    await goBack();
    await expectToBeVisibleByText('Default traveller');
    await expectToBeVisibleByText('Appearance');
    await expectToBeVisibleByText('Start page');
    await expectToBeVisibleByText('Language');
  });

  it('Settings: should add, edit, delete and sort favourite locations', async () => {
    const favLocation = 'Loddgårdstrøa';
    const favLocationName1 = 'LGT';
    const favLocationName1edit = 'LGTedit';
    const favLocationName2 = 'LGT2';

    await scrollToId(
      'profileHomeScrollView',
      'favoriteLocationsButton',
      'down',
    );
    await tapById('favoriteLocationsButton');
    await expectToBeVisibleByText('Favourite locations');
    await expectNumberOfFavourites(0);

    // Add
    await expectNotToExistsByText(favLocationName1);
    await addFavouriteLocation(favLocation, favLocationName1);
    await expectToBeVisibleByText(favLocationName1);
    await expectNumberOfFavourites(1);

    // Edit
    await expectNotToExistsByText(favLocationName1edit);
    await editFavouriteLocation(favLocationName1, favLocationName1edit);
    await expectNotToExistsByText(favLocationName1);
    await expectToBeVisibleByText(favLocationName1edit);
    await expectNumberOfFavourites(1);

    // Delete
    await deleteFavouriteLocation('LGTedit');
    await expectNotToExistsByText(favLocationName1edit);
    await expectNumberOfFavourites(0);

    // Add 2 locations
    await addFavouriteLocation(favLocation, favLocationName1);
    await addFavouriteLocation(favLocation, favLocationName2);
    await expectToBeVisibleByText(favLocationName1);
    await expectToBeVisibleByText(favLocationName2);

    // Validate
    await expectElementToContainText('favorite0', favLocationName1);
    await expectElementToContainText('favorite1', favLocationName2);
    await expectNumberOfFavourites(2);

    // Sort and validate
    await tapById('changeOrderButton');
    await expectToBeVisibleByText('Reorder favourites');

    await expectElementToContainId('favoriteItem0', 'down');
    await expectElementNotToContainId('favoriteItem0', 'up');
    await expectElementToContainText('favoriteItem0', favLocationName1);
    await expectElementToContainId('favoriteItem1', 'up');
    await expectElementNotToContainId('favoriteItem1', 'down');
    await expectElementToContainText('favoriteItem1', favLocationName2);

    await tapById('down');
    await expectElementToContainText('favoriteItem0', favLocationName2);
    await expectElementToContainText('favoriteItem1', favLocationName1);
    await tapByText('Save');

    // Validate
    await expectElementToContainText('favorite0', favLocationName2);
    await expectElementToContainText('favorite1', favLocationName1);
    await expectNumberOfFavourites(2);

    await goBack();
  });
});
