import {shouldStoredFavoriteDepartureBeMigrated} from '../utils';

// idProps is just used to match the StoredFavoriteDeparture type (not used by shouldStoredFavoriteDepartureBeMigrated)
const idProps = {id: '1', stopId: '1', lineId: '1', quayId: '1', quayName: '1'};

const bffMigrationPairBefore = {
  lineName: 'Lohove via sentrum',
  destinationDisplay: {
    frontText: 'Lohove via sentrum',
    via: [],
  },
};

const bffMigrationPairAfter = {
  lineName: 'Lohove via sentrum',
  destinationDisplay: {
    frontText: 'Lohove',
    via: ['sentrum'],
  },
};

describe('shouldStoredFavoriteDepartureBeMigrated', () => {
  it('returns false when bffMigrationPair via is not migrated', async () => {
    expect(
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {frontText: 'Lohove via sentrum', via: undefined},
        },
        bffMigrationPairBefore,
      ),
    ).toBe(false);
  });

  it('returns true when via included in stored frontText and undefined stored via array, but is in via array from bff', async () => {
    expect(
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {frontText: 'Lohove via sentrum', via: undefined},
        },
        bffMigrationPairAfter,
      ),
    ).toBe(true);
  });

  it('returns true when via included in stored frontText and empty stored via array, but is in via array from bff', async () => {
    expect(
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {frontText: 'Lohove via sentrum', via: []},
        },
        bffMigrationPairAfter,
      ),
    ).toBe(true);
  });

  it('returns false when already of the same format', async () => {
    expect(
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {frontText: 'Lohove', via: ['sentrum']},
        },
        bffMigrationPairAfter,
      ),
    ).toBe(false);
  });

  it('does not cross match different line names', async () => {
    expect(
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {frontText: 'Lohove via utkanten', via: []},
        },
        bffMigrationPairBefore,
      ),
    ).toBe(false);
  });

  it('does not cross match different line names with via migrated', async () => {
    expect(
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {frontText: 'Lohove', via: ['utkanten']},
        },
        bffMigrationPairAfter,
      ),
    ).toBe(false);
  });

  it('handles several elements and chars in via when matching', async () => {
    expect(
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {
            frontText: 'Havstad via Lerkendal-St. Olavs H.',
            via: [],
          },
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
      shouldStoredFavoriteDepartureBeMigrated(
        {
          ...idProps,
          destinationDisplay: {
            frontText: 'Havstad via stadion-sykehuset',
            via: [],
          },
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
