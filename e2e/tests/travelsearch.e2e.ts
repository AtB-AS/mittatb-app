import {device, by, element, expect} from 'detox';
import {findTextViewElement, scrollToElement, goToPage} from "../utils/common";
import {skipOnboarding} from "../utils/onboarding";
import {numberOfTravelSuggestions, travelSearch} from "../utils/travelsearch";
import {toggleTravelSearchV2} from "../utils/myatb";
import setLocation from "../utils";

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

  //jest.retryTimes(2)
  it('should do a simple search - version 1', async () => {

    const departure = 'Loddgårdstrøa'
    const arrival = 'Anders Buens gate'
    const inTransferStop = 'Melhus skysstasjon'

    // Do a travel search
    await travelSearch(departure, arrival)

    // Number of travel suggestions
    let travelSuggestions = await numberOfTravelSuggestions()

    // Get travel details of first travel
    let paging = `1 of ${travelSuggestions}`
    await expect(element(by.type('RCTTextView').and(by.text('Details'))).atIndex(0)).toBeVisible();
    await element(by.type('RCTTextView').and(by.text('Details'))).atIndex(0).tap()
    await expect(element(by.text('Trip details'))).toBeVisible();

    await expect(element(by.type('RCTTextView').and(by.text(paging)))).toBeVisible();
    await expect(element(by.type('RCTTextView').and(by.text('Next')))).toBeVisible();
    await expect(element(by.type('RCTTextView').and(by.text('Previous')))).toBeVisible();

    await expect(element(by.type('RCTTextView').and(by.text(departure)))).toBeVisible();

    // Scroll to arrival
    const arrivalElement = await findTextViewElement(arrival)
    await scrollToElement({element: arrivalElement, direction: 'down'})
    await expect(arrivalElement).toBeVisible();

    // Scroll to bottom and check 'Trip time'
    const tripTime = await findTextViewElement('Trip time')
    await scrollToElement({element: tripTime, direction: 'down'})
    await expect(tripTime).toBeVisible();

    // Open departure view for in transfer bus station
    const transfer = await findTextViewElement(inTransferStop)
    await scrollToElement({element: transfer, direction: 'up'})
    await expect(transfer).toBeVisible();
    await transfer.tap();

    await expect(element(by.text(inTransferStop))).toBeVisible();

    // Go back
    await element(by.text('Back')).tap();
    await expect(element(by.text('Trip details'))).toBeVisible();
    await element(by.text('Back')).tap();
    await expect(element(by.text('Travel assistant'))).toBeVisible();
  });


  it('should do a simple search - version 2', async () => {
    const departure = 'Loddgårdstrøa'
    const arrival = 'Anders Buens gate'
    //NOTE! At specific times, the first travel suggestion goes through 'Melhus sentrum' instead
    const inTransferStop = 'Melhus skysstasjon'

    // Enable v2
    await goToPage('My AtB')
    await toggleTravelSearchV2(true)

    // Go to travel search
    await goToPage('Assistant')
    await expect(element(by.text('Travel assistant'))).toBeVisible();

    // Do a travel search
    await travelSearch(departure, arrival)

    // Number of travel suggestions
    let travelSuggestions = await numberOfTravelSuggestions()

    // Get travel details of first travel
    let paging = `1 of ${travelSuggestions}`
    await expect(element(by.type('RCTTextView').and(by.text('Details'))).atIndex(0)).toBeVisible();
    await element(by.type('RCTTextView').and(by.text('Details'))).atIndex(0).tap()
    await expect(element(by.text('Trip details'))).toBeVisible();

    await expect(element(by.type('RCTTextView').and(by.text(paging)))).toBeVisible();
    await expect(element(by.type('RCTTextView').and(by.text('Next')))).toBeVisible();
    await expect(element(by.type('RCTTextView').and(by.text('Previous')))).toBeVisible();

    // Choose first occurance; sometimes the app suggests to walk from the departure to the bus stop even though
    // the bus stop is chosen as departure
    await expect(element(by.type('RCTTextView').and(by.text(departure))).atIndex(0)).toBeVisible();

    // Scroll to arrival
    const arrivalElement = await findTextViewElement(arrival)
    await scrollToElement({element: arrivalElement, direction: 'down'})
    await expect(arrivalElement).toBeVisible();

    // Scroll to bottom and check 'Trip time'
    const tripTime = await findTextViewElement('Trip time')
    await scrollToElement({element: tripTime, direction: 'down'})
    await expect(tripTime).toBeVisible();

    // Open departure view for in transfer bus station
    const transfer = await findTextViewElement(inTransferStop)
    await scrollToElement({element: transfer, direction: 'up'})
    await expect(transfer).toBeVisible();
    await transfer.tap();

    await expect(element(by.text(inTransferStop))).toBeVisible();

    // Go back
    await element(by.text('Back')).tap();
    await expect(element(by.text('Trip details'))).toBeVisible();
    await element(by.text('Back')).tap();
    await expect(element(by.text('Travel assistant'))).toBeVisible();

  });


});
