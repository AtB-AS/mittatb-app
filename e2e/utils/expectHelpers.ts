import {by, element, expect} from 'detox';
import {expectBoolean} from "./jestAssertions";

//** VISIBILITY **

export const expectVisible = async (elementRef: Detox.NativeElement) => {
    await expect(elementRef).toBeVisible();
};

const expectNotVisible = async (elementRef: Detox.NativeElement) => {
    await expect(elementRef).not.toBeVisible();
};

export const expectToBeVisibleById = async (id: string, index: number = 0) => {
    await expectVisible(element(by.id(id)).atIndex(index));
};

export const expectToBeVisibleByText = async (text: string) => {
    await expectVisible(element(by.text(text)).atIndex(0));
};

export const expectNotToBeVisibleById = async (id: string, index: number = 0) => {
    await expectNotVisible(element(by.id(id)).atIndex(index));
};

export const expectNotToBeVisibleByText = async (text: string) => {
    await expectNotVisible(element(by.text(text)));
};

// Expect that the text is visible, i.e. text is part of a text field
// Find element that includes the text based on type 'RCTTextView' and search term. element(by...) does not support RegExp.
// Use with caution since this method takes some time to travers the text elements - use rather 'expectToBeVisibleByText' for full text fields
export async function expectToBeVisibleByPartOfText(searchTerm: string) {
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

// ** CONTAINS TEXT / ID **

export const replaceTextById = async (id: string, text: string) => {
    await element(by.id(id)).replaceText(text);
}

export const expectTextById = async (id: string, text: string) => {
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
    await expect(elementRef).toExist();
};

const expectNotToExists = async (elementRef: Detox.NativeElement) => {
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

// ** ENABLED **

export const expectToBeEnabled = async (id: string, index: number = 0) => {
    const value = await element(by.id(id)).atIndex(index).getAttributes().then(e => (!('elements' in e) && e.enabled))
    expectBoolean(value, true)
};

export const expectNotToBeEnabled = async (id: string, index: number = 0) => {
    const value = await element(by.id(id)).atIndex(index).getAttributes().then(e => (!('elements' in e) && e.enabled))
    expectBoolean(value, false)
};