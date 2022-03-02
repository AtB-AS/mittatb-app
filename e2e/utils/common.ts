import {by, element} from "detox";

// Go to the given page
export async function goToPage(page: string){
    //await element(by.type('RCTTextView').and(by.text(page))).tap()
    await element(by.text(page).withAncestor(by.label('Assistant Departures Tickets My ATB'))).tap()
}

// Find element display text name based on type 'RCTTextView' and search term. element(by...) does not support RegExp.
export async function findTextViewElementDisplayText(searchTerm: string){
    return await element(by.type('RCTTextView')).getAttributes()
        .then(e => {return ('elements' in e) ? e.elements.filter(function (el) {return el.text?.includes(searchTerm)})[0].text : 'NotFound'})
        .catch(e => e == undefined ? 'NotFound' : e)
}

//TODO Can this be made any faster? Takes approx 2-4 sec based on the number of elements
// Find element based on type 'RCTTextView' and search term. element(by...) does not support RegExp.
export async function findTextViewElement(searchTerm: string){
    const elemName = await element(by.type('RCTTextView')).getAttributes()
        .then(e => {return ('elements' in e) ? e.elements.filter(function (el) {return el.text?.includes(searchTerm)})[0].text : 'NotFound'})
        .catch(e => e == undefined ? 'NotFound' : e)
    return await element(by.type('RCTTextView').and(by.text(elemName))).atIndex(0)
}


// Scroll to element based on text field and type 'RCTTextView'
export async function scrollToElementText({
                            searchTerm,
                            direction = 'down',
                        }: { searchTerm: string, direction?: "left" | "right" | "top" | "bottom" | "up" | "down" }){
    await waitFor(element(by.type('RCTTextView').and(by.text(searchTerm))).atIndex(0)).toBeVisible()
        .whileElement(by.type('RCTScrollView')).scroll(200, direction)
    //RCTScrollContentView
}

// Scroll to element
export async function scrollToElement({
                                   element,
                                   direction = 'down',
                               }: { element: Detox.NativeElement, direction?: "left" | "right" | "top" | "bottom" | "up" | "down" }){
    await waitFor(element).toBeVisible()
        .whileElement(by.type('RCTScrollView')).scroll(400, direction)
    //RCTScrollContentView
}