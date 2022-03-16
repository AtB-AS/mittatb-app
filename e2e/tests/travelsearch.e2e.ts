import {device} from 'detox';
import {goToTab, goBack} from '../utils/commonHelpers';
import {
  expectToBeVisibleById,
  expectToBeVisibleByText,
  tapById,
  tapByText,
  expectTextById,
  expectElementToContainText,
  scrollContentToText,
  scrollContent,
  expectTextToBeVisible,
  scrollContentToId,
} from '../utils/interactionHelpers';
import {skipOnboarding} from '../utils/onboarding';
import {toggleTravelSearchV2} from '../utils/myprofile';
import setLocation from '../utils';
import {numberOfTravelSuggestions, travelSearch} from '../utils/travelsearch';

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

  it('should do a simple search - version 1', async () => {
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
    await expectElementToContainText('assistantSearchResult0', 'Details');
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
    await expectTextToBeVisible('Trip time');

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
    await goBack();
    await expectToBeVisibleByText('Travel assistant');
  });

  it('should do a simple search - version 2', async () => {
    const departure = 'Udduvoll bru vest';
    const arrival = 'Anders Buens gate';
    const intermediateStop = 'Sandmoen E6';

    // Enable v2
    await goToTab('profile');
    await toggleTravelSearchV2(true);

    // Go to travel search
    await goToTab('assistant');

    // Do a travel search
    await travelSearch(departure, arrival);

    // Number of travel suggestions
    let travelSuggestions = await numberOfTravelSuggestions();

    // Get travel details of first travel
    let paging = `1 of ${travelSuggestions}`;
    await expectToBeVisibleById('assistantSearchResult0');
    await expectElementToContainText('assistantSearchResult0', 'Details');
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
    await expectTextToBeVisible('Trip time');

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
    await goBack();
    await expectToBeVisibleByText('Travel assistant');
  });
});
