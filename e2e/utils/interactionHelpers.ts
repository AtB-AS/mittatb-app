import {by, element} from 'detox';
import {expectVisible} from './expectHelpers';

// ** TAP **

export const tap = async (elementRef: Detox.NativeElement) => {
  await expectVisible(elementRef);
  await elementRef.tap();
};

export const tapById = async (id: string) => {
  await tap(element(by.id(id)).atIndex(0));
};

export const tapByText = async (text: string) => {
  await tap(element(by.text(text)).atIndex(0));
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

export const scrollTo = async (
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

// ** WAIT **

// Wait for element to exists
export const waitToExistById = async (id: string, timeout: number) => {
  await waitFor(element(by.id(id)))
    .toExist()
    .withTimeout(timeout)
};