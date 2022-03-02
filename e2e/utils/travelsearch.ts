import {by, element, expect} from "detox";

// Do a travel search (NOTE: use departure and arrival with only one bus station in the suggestions)
export async function travelSearch(departure: string, arrival: string){
    await element(by.text('From')).tap()
    await element(by.type('UITextFieldLabel').and(by.text('Place or address'))).tap()

    await element(by.type('UITextField')).clearText()
    await element(by.type('UITextField')).typeText(departure)
    await element(by.type('RCTView').and(by.label('Bussholdeplass'))).tap()

    await expect(element(by.text('Travel assistant'))).toBeVisible();

    await element(by.text('To')).tap()
    await element(by.type('UITextFieldLabel').and(by.text('Place or address'))).tap()

    await element(by.type('UITextField')).clearText()
    await element(by.type('UITextField')).typeText(arrival)
    await element(by.type('RCTView').and(by.label('Bussholdeplass'))).tap()

    await expect(element(by.text('Travel assistant'))).toBeVisible();
}

// Get the number of travel suggestions
export async function numberOfTravelSuggestions(){
    return await element(by.type('RCTTextView').and(by.text('Details'))).getAttributes()
        .then(e => !('elements' in e) ? 1 : e.elements.length)
        .catch(e => 0)
}