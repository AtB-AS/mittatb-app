import {by, element, expect} from 'detox';

/*
const waitForTimeout = 5000

//If waiting is necessary
const waitForVisible = async (elementRef: Detox.NativeElement) => {
    await waitFor(elementRef)
        .toBeVisible()
        .withTimeout(waitForTimeout)
}

const waitForExist = async (elementRef: Detox.NativeElement) => {
    await waitFor(elementRef)
        .toExist()
        .withTimeout(waitForTimeout)
}
*/

//** VISIBILITY **

const expectVisible = async (elementRef: Detox.NativeElement) => {
  //await waitForVisible(elementRef)
  await expect(elementRef).toBeVisible();
};

const expectNotVisible = async (elementRef: Detox.NativeElement) => {
  //await waitForVisible(elementRef)
  await expect(elementRef).not.toBeVisible();
};

export const expectToBeVisibleById = async (id: string) => {
  await expectVisible(element(by.id(id)));
};

export const expectToBeVisibleByText = async (text: string) => {
  await expectVisible(element(by.text(text)).atIndex(0));
};

export const expectNotToBeVisibleById = async (id: string) => {
  await expectNotVisible(element(by.id(id)));
};

export const expectNotToBeVisibleByText = async (text: string) => {
  await expectNotVisible(element(by.text(text)));
};

// Expect that the text is visible, i.e. text is part of a text field
// Find element that includes the text based on type 'RCTTextView' and search term. element(by...) does not support RegExp.
// Use with caution since this method takes some time to travers the text elements - use rather 'expectToBeVisibleByText' for full text fields
export async function expectTextToBeVisible(searchTerm: string) {
  const elemName = await element(by.type('RCTTextView'))
    .getAttributes()
    .then((e) => {
      return 'elements' in e
        ? e.elements.filter(function (el) {
            return el.text?.includes(searchTerm);
          })[0].text
        : 'NotFound';
    })
    .catch((e) => (e == undefined ? 'NotFound' : e));
  await expect(element(by.text(elemName))).toBeVisible();
}

// ** TAP **

const tap = async (elementRef: Detox.NativeElement) => {
  //await waitForVisible(elementRef)
  await expectVisible(elementRef);
  await elementRef.tap();
};

export const tapById = async (id: string) => {
  await tap(element(by.id(id)).atIndex(0));
};

export const tapByText = async (text: string) => {
  await tap(element(by.text(text)).atIndex(0));
};

// ** TEXT / ID **

export const replaceTextById = async (id: string, text: string) => {
    await element(by.id(id)).replaceText(text);
}

export const expectTextById = async (id: string, text: string) => {
  //await waitForVisible(element(by.id(id))
  //await expectVisible(element(by.id(id)))
  await expectExists(element(by.id(id)));
  await expect(element(by.id(id))).toHaveText(text);
};

export const expectElementToContainText = async (
  parentId: string,
  childText: string,
) => {
  await expect(
    element(by.id(parentId).withDescendant(by.text(childText))),
  ).toExist();
};

export const expectElementToContainId = async (
  parentId: string,
  childId: string,
) => {
  await expect(
    element(by.id(parentId).withDescendant(by.id(childId))),
  ).toExist();
};

export const expectElementNotToContainId = async (
  parentId: string,
  childId: string,
) => {
  await expect(
    element(by.id(parentId).withDescendant(by.id(childId))),
  ).not.toExist();
};

// ** EXIST **

const expectExists = async (elementRef: Detox.NativeElement) => {
  //await waitForExist(elementRef)
  await expect(elementRef).toExist();
};

const expectNotToExists = async (elementRef: Detox.NativeElement) => {
  //await waitForNotExist(elementRef)
  await expect(elementRef).not.toExist();
};

export const expectToExistsById = async (id: string) => {
  await expectExists(element(by.id(id)));
};

export const expectNotToExistsById = async (id: string) => {
  await expectNotToExists(element(by.id(id)));
};

export const expectNotToExistsByText = async (text: string) => {
  await expectNotToExists(element(by.text(text)));
};

// ** SCROLL **

export const scroll = async (
  scrollViewId: string,
  direction: 'left' | 'right' | 'top' | 'bottom',
) => {
  await element(by.id(scrollViewId)).scrollTo(direction);
};

export const scrollContent = async (
  contentViewId: string,
  direction: 'left' | 'right' | 'top' | 'bottom',
) => {
  await element(
    by.type('RCTScrollView').withDescendant(by.id(contentViewId)),
  ).scrollTo(direction);
};

export const scrollByPixels = async (
  scrollViewId: string,
  direction: 'left' | 'right' | 'top' | 'bottom' | 'up' | 'down',
  pixels: number,
) => {
  await element(by.id(scrollViewId)).scroll(pixels, direction);
};

const scrollTo = async (
  scrollViewRef: Detox.NativeMatcher,
  scrollToRef: Detox.NativeElement,
  direction: Detox.Direction,
) => {
  await waitFor(scrollToRef)
    .toBeVisible()
    .whileElement(scrollViewRef)
    .scroll(400, direction);
};

export const scrollToId = async (
  scrollViewId: string,
  scrollToId: string,
  direction: 'left' | 'right' | 'up' | 'down',
) => {
  await scrollTo(by.id(scrollViewId), element(by.id(scrollToId)), direction);
};

export const scrollToText = async (
  scrollViewId: string,
  scrollToText: string,
  direction: 'left' | 'right' | 'up' | 'down',
) => {
  await scrollTo(
    by.id(scrollViewId),
    element(by.text(scrollToText)),
    direction,
  );
};

export const scrollContentToText = async (
  contentViewId: string,
  scrollToText: string,
  direction: 'left' | 'right' | 'up' | 'down',
) => {
  await scrollTo(
    by.type('RCTScrollView').withDescendant(by.id(contentViewId)),
    element(by.text(scrollToText)).atIndex(0),
    direction,
  );
};

export const scrollContentToId = async (
  contentViewId: string,
  scrollToId: string,
  direction: 'left' | 'right' | 'up' | 'down',
) => {
  await scrollTo(
    by.type('RCTScrollView').withDescendant(by.id(contentViewId)),
    element(by.id(scrollToId)).atIndex(0),
    direction,
  );
};
