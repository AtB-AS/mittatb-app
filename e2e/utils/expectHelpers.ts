import {by, element, expect} from 'detox';
import {expectBoolean} from './jestAssertions';

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

export const expectNotToBeVisibleById = async (
  id: string,
  index: number = 0,
) => {
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

// ** CONTAINS TEXT / ID / LABEL **

export const expectIdToHaveText = async (id: string, text: string) => {
  await expectExists(element(by.id(id)));
  await expect(element(by.id(id))).toHaveText(text);
};

export const expectIdToNotHaveText = async (id: string, text: string) => {
  await expectExists(element(by.id(id)));
  await expect(element(by.id(id))).not.toHaveText(text);
};

export const expectIdToHaveLabel = async (id: string, label: string) => {
  await expect(element(by.id(id).and(by.label(label)))).toExist();
};

export const expectIdToHaveChildText = async (
  parentId: string,
  childText: string,
) => {
  await expect(
    element(by.id(parentId).withDescendant(by.text(childText))),
  ).toExist();
};

// Expect that a given element has a text attribute that contains param: text
export async function expectElementToIncludeText(
  text: string,
  elementRef: Detox.NativeElement,
  index: number = 0,
) {
  let isIncluded = await elementRef
    .getAttributes()
    .then((e) => {
      return !('elements' in e)
        ? e.text?.includes(text)
        : e.elements[index].text?.includes(text);
    })
    .catch((e) => false);
  if (isIncluded === undefined) {
    isIncluded = false;
  }

  expectBoolean(isIncluded, true);
}

export const expectIdToHaveChildId = async (
  parentId: string,
  childId: string,
) => {
  await expect(
    element(by.id(parentId).withDescendant(by.id(childId))),
  ).toExist();
};

export const expectIdNotToHaveChildId = async (
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

export const expectToExistsByLabel = async (label: string) => {
  await expectExists(element(by.label(label)));
};

export const expectToExistsById = async (id: string) => {
  await expectExists(element(by.id(id)));
};

export const expectToExistsByIdHierarchy = async (
  elementMatcher: Detox.NativeMatcher,
) => {
  await expectExists(element(elementMatcher));
};

export const expectNotToExistsByIdHierarchy = async (
  elementMatcher: Detox.NativeMatcher,
) => {
  await expectNotToExists(element(elementMatcher));
};

export const expectNotToExistsById = async (id: string) => {
  await expectNotToExists(element(by.id(id)));
};

export const expectNotToExistsByText = async (text: string) => {
  await expectNotToExists(element(by.text(text)));
};

// ** ENABLED **

export const expectToBeEnabled = async (id: string, index: number = 0) => {
  const value = await element(by.id(id))
    .atIndex(index)
    .getAttributes()
    .then((e) => !('elements' in e) && e.enabled);
  expectBoolean(value, true);
};

export const expectNotToBeEnabled = async (id: string, index: number = 0) => {
  const value = await element(by.id(id))
    .atIndex(index)
    .getAttributes()
    .then((e) => !('elements' in e) && e.enabled);
  expectBoolean(value, false);
};
