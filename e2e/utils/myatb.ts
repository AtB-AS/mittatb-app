import {by, element, expect} from "detox";
import {scrollToElementText} from "./common";

// Toggle travel search v2 on/off
export async function toggleTravelSearchV2(enableV2: boolean){
    await scrollToElementText({searchTerm: 'Try the new travel search engine', direction: 'down'})

    const toggle = await element(by.type('RCTSwitch').and(by.label('Try the new travel search engine'))).getAttributes()
        .then(elem => {return !('elements' in elem) ? elem.value : undefined })

    // Enable OTP 2 if not enabled
    if (toggle == 0 && enableV2){
        await element(by.type('RCTSwitch').and(by.label('Try the new travel search engine'))).tap()
    }
    // Disable OTP 2 if not disabled
    if (toggle == 1 && !enableV2){
        await element(by.type('RCTSwitch').and(by.label('Try the new travel search engine'))).tap()
    }
}

// Add a favourite location. NOTE: Choose a bus stop
export async function addFavouriteLocation(location: string, locationName: string) {
    await element(by.text('Add favourite location')).tap()
    await expect(element(by.text('Add a favourite location'))).toBeVisible();
    const inputField = await element(by.type('UITextField').withDescendant(by.text('Search for an address or location')))
    await inputField.tap()
    await inputField.clearText()
    await inputField.typeText(location)
    await element(by.type('RCTView').and(by.label('Bussholdeplass'))).atIndex(0).tap()

    const nameField = await element(by.type('UITextField').withDescendant(by.text('Add name')))
    await nameField.tap()
    await nameField.clearText()
    await nameField.typeText(locationName)

    await element(by.text('Save location as favourite')).tap()
}

// Edit the name of a favourite location.
export async function editFavouriteLocation(locationName: string, newLocationName: string) {
    // Choose item to edit
    await element(by.text(locationName)).tap()

    //Edit
    let nameField = await element(by.type('RCTUITextField').and(by.text(locationName)))
    await nameField.tap()
    await nameField.clearText()
    await element(by.type('RCTSinglelineTextInputView').and(by.label('Add name')).withDescendant(by.type('RCTUITextField'))).typeText(newLocationName)

    await element(by.text('Save location as favourite')).tap()
}

// Delete a favourite location.
export async function deleteFavouriteLocation(locationName: string) {
    // Choose item to delete
    await element(by.text(locationName)).tap()

    // Delete
    await element(by.text('Delete favourite location')).tap()
    await element(by.type('_UIAlertControllerActionView').and(by.label('Delete favourite location'))).tap()
}

// TODO Not used - see TODO [1] in ../tests/myatb.e2e.ts
// Walks through all relevant elements and returns the label used for sorting
export async function sortLabelExists(favouriteName: string, sortDirection: string) {
    return await element(by.type('RCTView')).getAttributes()
        .then(e => {return ('elements' in e) ? e.elements.filter(function (el) {
            return el.label?.includes(`${favouriteName} ${sortDirection}`) && !el.label?.includes(`${favouriteName} Flytt`)})[0].label : 'NotFound'
        })
        .catch(e => e == undefined ? 'NotFound' : e)
}
