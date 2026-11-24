import React from 'react';
import {render} from '@testing-library/react-native';
import {NotEligibleBenefitCard} from '../NotEligibleBenefitCard';

// The card only composes these; stub them to keep the test free of theme,
// navigation and SVG dependencies.
jest.mock('@atb/translations', () => ({
  ...jest.requireActual('@atb/translations/utils'),
  useTranslation: () => ({language: 'nb'}),
}));
jest.mock('@atb/theme', () => ({
  StyleSheet: {createThemeHook: () => () => ({})},
}));
jest.mock('@atb/components/sections', () => {
  const {View} = require('react-native');
  return {Section: View, GenericSectionItem: View};
});
jest.mock('@atb/components/text', () => {
  const {Text} = require('react-native');
  return {ThemeText: Text, screenReaderPause: '\n'};
});
jest.mock('../BenefitIllustration', () => {
  const {Text} = require('react-native');
  return {
    BenefitIllustration: ({illustrationName}: {illustrationName?: string}) => (
      <Text>{`illustration:${illustrationName}`}</Text>
    ),
  };
});

const texts = (value: string) => [{language: 'nob', value}];

describe('NotEligibleBenefitCard', () => {
  it('shows the illustration, title and description', () => {
    const view = render(
      <NotEligibleBenefitCard
        notEligibleBenefit={{
          title: texts('Få bysykler inkludert'),
          description: texts('Våre periodebilletter inkluderer bysykler.'),
          illustrationName: 'TicketValid',
        }}
      />,
    );

    expect(view.getByText('illustration:TicketValid')).toBeTruthy();
    expect(view.getByText('Få bysykler inkludert')).toBeTruthy();
    expect(
      view.getByText('Våre periodebilletter inkluderer bysykler.'),
    ).toBeTruthy();
    expect(
      view.getByLabelText(
        'Få bysykler inkludert\nVåre periodebilletter inkluderer bysykler.',
      ),
    ).toBeTruthy();
  });

  it('shows only the title when there is no description', () => {
    const view = render(
      <NotEligibleBenefitCard
        notEligibleBenefit={{
          title: texts('Få bysykler inkludert'),
          description: [],
          illustrationName: undefined,
        }}
      />,
    );

    expect(view.getByLabelText('Få bysykler inkludert')).toBeTruthy();
  });

  it('renders nothing when there are no texts', () => {
    const view = render(
      <NotEligibleBenefitCard
        notEligibleBenefit={{
          title: [],
          description: [],
          illustrationName: 'TicketValid',
        }}
      />,
    );

    expect(view.toJSON()).toBeNull();
  });
});
