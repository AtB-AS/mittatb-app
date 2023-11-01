import {shouldStoredDestinationDisplayBeMigrated} from '../utils';

// what the bff data looks like before migration
const bffMigrationPairBefore = {
  lineName: 'Lohove via sentrum',
  destinationDisplay: {
    frontText: 'Lohove via sentrum',
    via: [],
  },
};

// what the bff data looks like after migration
const bffMigrationPairAfter = {
  lineName: 'Lohove via sentrum',
  destinationDisplay: {
    frontText: 'Lohove',
    via: ['sentrum'],
  },
};

describe('shouldDestinationDisplayBeMigrated', () => {
  it('returns false when bffMigrationPair via is not migrated', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {frontText: 'Lohove via sentrum', via: undefined},
        bffMigrationPairBefore,
      ),
    ).toBe(false);
  });

  it('returns true when via included in stored frontText and undefined stored via array, but is in via array from bff', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {frontText: 'Lohove via sentrum', via: undefined},
        bffMigrationPairAfter,
      ),
    ).toBe(true);
  });

  it('returns true when via included in stored frontText and empty stored via array, but is in via array from bff', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {frontText: 'Lohove via sentrum', via: []},
        bffMigrationPairAfter,
      ),
    ).toBe(true);
  });

  it('returns false when already of the same format', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {frontText: 'Lohove', via: ['sentrum']},
        bffMigrationPairAfter,
      ),
    ).toBe(false);
  });

  it('does not cross match different line names', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {frontText: 'Lohove via utkanten', via: []},
        bffMigrationPairBefore,
      ),
    ).toBe(false);
  });

  it('does not cross match different line names with via migrated', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {frontText: 'Lohove', via: ['utkanten']},
        bffMigrationPairAfter,
      ),
    ).toBe(false);
  });

  it('handles several elements and chars in via when matching', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {
          frontText: 'Havstad via Lerkendal-St. Olavs H.',
          via: [],
        },
        {
          lineName: 'Havstad via Lerkendal-St. Olavs H.',
          destinationDisplay: {
            frontText: 'Havstad',
            via: ['Lerkendal', 'St. Olavs H.'],
          },
        },
      ),
    ).toBe(true);
  });

  it('handles several elements and chars in via when not matching', async () => {
    expect(
      shouldStoredDestinationDisplayBeMigrated(
        {
          frontText: 'Havstad via stadion-sykehuset',
          via: [],
        },
        {
          lineName: 'Havstad via Lerkendal-St. Olavs H.',
          destinationDisplay: {
            frontText: 'Havstad',
            via: ['Lerkendal', 'St. Olavs H.'],
          },
        },
      ),
    ).toBe(false);
  });
});