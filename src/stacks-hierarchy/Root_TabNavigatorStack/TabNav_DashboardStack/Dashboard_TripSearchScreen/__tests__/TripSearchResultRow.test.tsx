import React from 'react';
import {act, render} from '@testing-library/react-native';
import type {TripPatternWithKey} from '@atb/screen-components/travel-details-screens';
import {TripSearchResultRow} from '../components/TripSearchResultRow';

// The card reports being ready through the onReady it was last rendered with.
let mockCardOnReady: (() => void) | undefined;

jest.mock('@atb/screen-components/travel-card', () => {
  const {createElement} = require('react');
  const {View} = require('react-native');
  return {
    TravelCard: ({onReady}: {onReady: () => void}) => {
      mockCardOnReady = onReady;
      return createElement(View, {testID: 'card'});
    },
    WithTravelCardSkeleton: jest.requireActual(
      '@atb/screen-components/travel-card/skeleton/WithTravelCardSkeleton',
    ).WithTravelCardSkeleton,
  };
});
jest.mock(
  '@atb/screen-components/travel-card/skeleton/TravelCardSkeleton',
  () => {
    const {createElement} = require('react');
    const {View} = require('react-native');
    return {
      TravelCardSkeleton: () => createElement(View, {testID: 'skeleton'}),
    };
  },
);
jest.mock('@atb/modules/experimental-store-trip-patterns', () => ({
  SaveableTripSearchResultRow: ({
    children,
  }: {
    children: (isSaved: boolean) => React.ReactNode;
  }) => children(false),
}));
jest.mock('../components/DayLabel', () => ({DayLabel: () => null}));
jest.mock('@atb/translations', () => ({
  useTranslation: () => ({t: (text: unknown) => String(text)}),
  TravelCardTexts: {
    card: {
      a11yPrefix: {tripSuggestion: () => 'trip'},
      a11yHint: {tripDetails: 'details'},
    },
  },
}));

const tripPattern = {
  expectedStartTime: '2026-10-21T15:00:00+02:00',
} as TripPatternWithKey;

const renderRow = (isDeferred: boolean, onInitialRowReady = jest.fn()) =>
  render(
    <TripSearchResultRow
      tripPattern={tripPattern}
      previousDepartureTime={undefined}
      index={6}
      numberOfResults={12}
      onDetailsPressed={jest.fn()}
      isDeferred={isDeferred}
      onInitialRowReady={onInitialRowReady}
    />,
  );

const reportCardReady = () => act(() => mockCardOnReady?.());

// While it is measured, the card is mounted but hidden (also from screen
// readers) behind the skeleton.
const isCardMounted = (view: ReturnType<typeof render>) =>
  view.queryByTestId('card', {includeHiddenElements: true}) !== null;
const isCardShown = (view: ReturnType<typeof render>) =>
  view.queryByTestId('card') !== null;
const isSkeletonShown = (view: ReturnType<typeof render>) =>
  view.queryByTestId('skeleton') !== null;

describe('TripSearchResultRow', () => {
  beforeEach(() => {
    mockCardOnReady = undefined;
  });

  it('shows the skeleton until the card is ready', () => {
    const view = renderRow(false);

    expect(isCardMounted(view)).toBe(true);
    expect(isCardShown(view)).toBe(false);
    expect(isSkeletonShown(view)).toBe(true);
    reportCardReady();
    expect(isCardShown(view)).toBe(true);
    expect(isSkeletonShown(view)).toBe(false);
  });

  it('only shows the skeleton while deferred', () => {
    const view = renderRow(true);

    expect(isSkeletonShown(view)).toBe(true);
    expect(isCardMounted(view)).toBe(false);
  });

  it('reports the row as ready with its index', () => {
    const onInitialRowReady = jest.fn();
    renderRow(false, onInitialRowReady);

    reportCardReady();
    expect(onInitialRowReady).toHaveBeenCalledWith(6);
  });

  it('waits for the card to be ready again when it is rendered after being deferred', () => {
    const view = renderRow(false);
    reportCardReady();
    expect(isCardShown(view)).toBe(true);

    view.rerender(
      <TripSearchResultRow
        tripPattern={tripPattern}
        previousDepartureTime={undefined}
        index={6}
        numberOfResults={12}
        onDetailsPressed={jest.fn()}
        isDeferred={true}
      />,
    );
    expect(isCardMounted(view)).toBe(false);
    expect(isSkeletonShown(view)).toBe(true);

    view.rerender(
      <TripSearchResultRow
        tripPattern={tripPattern}
        previousDepartureTime={undefined}
        index={6}
        numberOfResults={12}
        onDetailsPressed={jest.fn()}
        isDeferred={false}
      />,
    );
    expect(isCardMounted(view)).toBe(true);
    expect(isCardShown(view)).toBe(false);
    expect(isSkeletonShown(view)).toBe(true);
    reportCardReady();
    expect(isCardShown(view)).toBe(true);
    expect(isSkeletonShown(view)).toBe(false);
  });
});
